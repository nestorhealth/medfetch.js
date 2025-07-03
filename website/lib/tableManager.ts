import { Kysely, sql } from "kysely";

export interface ColumnDefinition {
  name: string;
  type: "TEXT" | "INTEGER" | "REAL" | "BLOB" | "BOOLEAN" | "DATE";
  nullable?: boolean;
  primaryKey?: boolean;
  unique?: boolean;
  defaultValue?: any;
  check?: string;
  references?: {
    table: string;
    column: string;
    onDelete?: "CASCADE" | "SET NULL" | "RESTRICT";
    onUpdate?: "CASCADE" | "SET NULL" | "RESTRICT";
  };
}

export interface TableDefinition {
  name: string;
  columns: ColumnDefinition[];
  constraints?: string[];
}

export interface BulkOperationResult {
  success: boolean;
  affectedRows: number;
  errors?: string[];
}

export class TableManager {
  constructor(private db: Kysely<any>) {}

  /**
   * Creates a new table with the given definition
   */
  async createTable(definition: TableDefinition): Promise<void> {
    const columnDefs = definition.columns.map((col) => {
      const parts = [
        col.name,
        col.type,
        col.nullable === false ? "NOT NULL" : "",
        col.primaryKey ? "PRIMARY KEY" : "",
        col.unique ? "UNIQUE" : "",
        col.defaultValue !== undefined
          ? `DEFAULT ${this.formatDefaultValue(col.defaultValue)}`
          : "",
        col.check ? `CHECK (${col.check})` : "",
        col.references ? this.formatForeignKeyConstraint(col) : "",
      ]
        .filter(Boolean)
        .join(" ");
      return parts;
    });

    const constraints = definition.constraints || [];
    const sqlText = `
      CREATE TABLE IF NOT EXISTS ${definition.name} (
        ${[...columnDefs, ...constraints].join(",\n        ")}
      );
    `;

    try {
      await sql.raw(sqlText).execute(this.db);
    } catch (err: unknown) {
      const error = err as Error;
      throw new Error(
        `Failed to create table ${definition.name}: ${error.message}`,
      );
    }
  }

  /**
   * Validates data against table schema before insertion/update
   */
  async validateData(
    tableName: string,
    data: Record<string, any>,
  ): Promise<void> {
    const schema = await this.getTableSchema(tableName);
    const errors: string[] = [];

    // Check required fields
    for (const col of schema) {
      if (!col.nullable && data[col.name] === undefined && !col.defaultValue) {
        errors.push(`Column ${col.name} is required`);
      }
    }

    // Validate data types
    for (const [key, value] of Object.entries(data)) {
      const column = schema.find((col) => col.name === key);
      if (!column) {
        errors.push(`Unknown column: ${key}`);
        continue;
      }

      if (value !== null) {
        const typeError = this.validateType(column.type, value);
        if (typeError) {
          errors.push(`Invalid type for ${key}: ${typeError}`);
        }
      }
    }

    if (errors.length > 0) {
      throw new Error(`Validation failed:\n${errors.join("\n")}`);
    }
  }

  /**
   * Gets the current schema for a table
   */
  async getTableSchema(tableName: string): Promise<ColumnDefinition[]> {
    try {
      const columns = await sql.raw(`PRAGMA table_info("patients");`)
        .execute(this.db)
        .then((r) => r.rows);
      console.log("Columns", columns)

      return columns.map((col: any) => ({
        name: col.name,
        type: col.type as ColumnDefinition["type"],
        nullable: !col.notnull,
        primaryKey: !!col.pk,
        unique: !!col.pk, // SQLite doesn't expose UNIQUE constraint in table_info
        defaultValue: col.dflt_value,
      }));
    } catch (err: unknown) {
      const error = err as Error;
      throw new Error(
        `Failed to get schema for table ${tableName}: ${error.message}`,
      );
    }
  }

  /**
   * Checks if a table exists
   */
  async tableExists(tableName: string): Promise<boolean> {
    try {
      const result = await this.db
        .selectFrom("sqlite_master")
        .select("name")
        .where("type", "=", "table")
        .where("name", "=", tableName)
        .execute();
      return result.length > 0;
    } catch (err: unknown) {
      const error = err as Error;
      throw new Error(
        `Failed to check if table ${tableName} exists: ${error.message}`,
      );
    }
  }

  /**
   * Drops a table if it exists
   */
  async dropTable(tableName: string): Promise<void> {
    try {
      await this.db.schema.dropTable(tableName).ifExists().execute();
    } catch (err: unknown) {
      const error = err as Error;
      throw new Error(`Failed to drop table ${tableName}: ${error.message}`);
    }
  }

  /**
   * Adds a new column to an existing table
   */
  async addColumn(tableName: string, column: ColumnDefinition): Promise<void> {
    if (!(await this.tableExists(tableName))) {
      throw new Error(`Table ${tableName} does not exist`);
    }
    try {
      await this.db.schema.alterTable(tableName).addColumn(column.name, sql`${column.type}`).execute();
    } catch (err: unknown) {
      const error = err as Error;
      throw new Error(
        `Failed to add column ${column.name} to table ${tableName}: ${error.message}`,
      );
    }
  }

  /**
   * Removes a column from a table
   * Note: SQLite doesn't support DROP COLUMN directly, so we need to recreate the table
   */
  async removeColumn(tableName: string, columnName: string): Promise<void> {
    if (!(await this.tableExists(tableName))) {
      throw new Error(`Table ${tableName} does not exist`);
    }

    const schema = await this.getTableSchema(tableName);
    const column = schema.find((col) => col.name === columnName);
    if (!column) {
      throw new Error(
        `Column ${columnName} does not exist in table ${tableName}`,
      );
    }

    // Create a new table without the column
    const newColumns = schema.filter((col) => col.name !== columnName);
    const tempTableName = `${tableName}_temp`;

    try {
      // Create new table
      await this.createTable({
        name: tempTableName,
        columns: newColumns,
      });

      // Copy data
      const columnNames = newColumns.map((col) => col.name).join(", ");
      await sql.raw(`
        INSERT INTO ${tempTableName} (${columnNames})
        SELECT ${columnNames} FROM ${tableName};
      `).execute(this.db);

      // Drop old table and rename new one
      await this.dropTable(tableName);
      await sql.raw(
        `ALTER TABLE ${tempTableName} RENAME TO ${tableName};`,
      ).execute(this.db)
    } catch (err: unknown) {
      const error = err as Error;
      // Cleanup temp table if it exists
      await this.dropTable(tempTableName).catch(() => {});
      throw new Error(
        `Failed to remove column ${columnName} from table ${tableName}: ${error.message}`,
      );
    }
  }

  /**
   * Validates multiple rows of data against table schema
   */
  async validateBulkData(
    tableName: string,
    data: Record<string, any>[],
  ): Promise<BulkOperationResult> {
    const errors: string[] = [];
    let validRows = 0;

    for (const [index, row] of data.entries()) {
      try {
        await this.validateData(tableName, row);
        validRows++;
      } catch (err: unknown) {
        const error = err as Error;
        errors.push(`Row ${index + 1}: ${error.message}`);
      }
    }

    return {
      success: errors.length === 0,
      affectedRows: validRows,
      errors: errors.length > 0 ? errors : undefined,
    };
  }

  /**
   * Bulk inserts data into a table with validation
   */
  async bulkInsert(
    tableName: string,
    data: Record<string, any>[],
  ): Promise<BulkOperationResult> {
    const validation = await this.validateBulkData(tableName, data);
    if (!validation.success) {
      return validation;
    }

    try {
      const schema = await this.getTableSchema(tableName);
      const columns = schema.map((col) => col.name).join(", ");
      const placeholders = data
        .map(() => `(${schema.map(() => "?").join(", ")})`)
        .join(", ");

      const values = data.flatMap((row) =>
        schema.map((col) => {
          const value = row[col.name];
          return value === undefined ? null : value;
        }),
      );

      await sql.raw(`
        INSERT INTO ${tableName} (${columns})
        VALUES ${placeholders};
      `).execute(this.db);

      return {
        success: true,
        affectedRows: data.length,
      };
    } catch (err: unknown) {
      const error = err as Error;
      return {
        success: false,
        affectedRows: 0,
        errors: [`Bulk insert failed: ${error.message}`],
      };
    }
  }

  /**
   * Bulk updates data in a table with validation
   */
  async bulkUpdate(
    tableName: string,
    data: Record<string, any>[],
    keyColumn: string,
  ): Promise<BulkOperationResult> {
    const validation = await this.validateBulkData(tableName, data);
    if (!validation.success) {
      return validation;
    }

    try {
      const schema = await this.getTableSchema(tableName);
      const updateColumns = schema
        .filter((col) => col.name !== keyColumn)
        .map((col) => col.name);

      let affectedRows = 0;
      for (const row of data) {
        const keyValue = row[keyColumn];
        if (keyValue === undefined) {
          continue;
        }

        const setClause = updateColumns.map((col) => `${col} = ?`).join(", ");

        const values = updateColumns.map((col) => row[col]);

        await sql`
          UPDATE ${tableName}
          SET ${setClause}
          WHERE ${keyColumn} = ?;
        `
        .execute(this.db)

        affectedRows++;
      }

      return {
        success: true,
        affectedRows,
      };
    } catch (err: unknown) {
      const error = err as Error;
      return {
        success: false,
        affectedRows: 0,
        errors: [`Bulk update failed: ${error.message}`],
      };
    }
  }

  private formatDefaultValue(value: any): string {
    if (typeof value === "string") {
      return `'${value.replace(/'/g, "''")}'`;
    }
    if (value === null) {
      return "NULL";
    }
    return value.toString();
  }

  private validateType(
    type: ColumnDefinition["type"],
    value: any,
  ): string | null {
    switch (type) {
      case "TEXT":
        return typeof value === "string" ? null : "Expected string";
      case "INTEGER":
        return Number.isInteger(value) ? null : "Expected integer";
      case "REAL":
        return typeof value === "number" ? null : "Expected number";
      case "BOOLEAN":
        return typeof value === "boolean" ? null : "Expected boolean";
      case "DATE":
        return this.isValidDate(value) ? null : "Expected valid date";
      case "BLOB":
        return value instanceof Uint8Array ? null : "Expected binary data";
      default:
        return `Unknown type: ${type}`;
    }
  }

  private isValidDate(value: any): boolean {
    if (typeof value === "string") {
      const date = new Date(value);
      return !isNaN(date.getTime());
    }
    return value instanceof Date && !isNaN(value.getTime());
  }

  private formatColumnDefinition(column: ColumnDefinition): string {
    const parts = [
      column.name,
      column.type,
      column.nullable === false ? "NOT NULL" : "",
      column.primaryKey ? "PRIMARY KEY" : "",
      column.unique ? "UNIQUE" : "",
      column.defaultValue !== undefined
        ? `DEFAULT ${this.formatDefaultValue(column.defaultValue)}`
        : "",
      column.check ? `CHECK (${column.check})` : "",
      column.references ? this.formatForeignKeyConstraint(column) : "",
    ]
      .filter(Boolean)
      .join(" ");
    return parts;
  }

  private formatForeignKeyConstraint(column: ColumnDefinition): string {
    if (!column.references) return "";

    const { table, column: refColumn, onDelete, onUpdate } = column.references;
    const parts = [
      `REFERENCES ${table}(${refColumn})`,
      onDelete ? `ON DELETE ${onDelete}` : "",
      onUpdate ? `ON UPDATE ${onUpdate}` : "",
    ]
      .filter(Boolean)
      .join(" ");

    return parts;
  }
}
