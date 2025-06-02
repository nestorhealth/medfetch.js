import { NextApiRequest, NextApiResponse } from 'next';
import { initMedfetchDB } from 'medfetch';

interface ColumnInfo {
  name: string;
  type: string;
  nullable: boolean;
  primaryKey: boolean;
  defaultValue?: string;
  foreignKey?: {
    table: string;
    column: string;
  };
}

interface TableInfo {
  name: string;
  columns: ColumnInfo[];
  indexes?: string[];
  constraints?: string[];
}

// Define the expected schema for validation
const EXPECTED_SCHEMA = {
  Patient: {
    columns: [
      { name: 'rowid', type: 'INTEGER', nullable: false, primaryKey: true },
      { name: 'patient_id', type: 'TEXT', nullable: false, primaryKey: false },
      { name: 'givenName', type: 'TEXT', nullable: true, primaryKey: false },
      { name: 'familyName', type: 'TEXT', nullable: true, primaryKey: false },
      { name: 'birthDate', type: 'TEXT', nullable: true, primaryKey: false },
      { name: 'gender', type: 'TEXT', nullable: true, primaryKey: false },
      { name: 'condition', type: 'TEXT', nullable: true, primaryKey: false },
      { name: 'status', type: 'TEXT', nullable: true, primaryKey: false }
    ],
    indexes: ['patient_id'],
    constraints: ['UNIQUE(patient_id)']
  },
  Procedure: {
    columns: [
      { name: 'rowid', type: 'INTEGER', nullable: false, primaryKey: true },
      { name: 'procedure_id', type: 'TEXT', nullable: false, primaryKey: false },
      { name: 'patient_id', type: 'TEXT', nullable: false, primaryKey: false, 
        foreignKey: { table: 'Patient', column: 'patient_id' } },
      { name: 'code', type: 'TEXT', nullable: true, primaryKey: false },
      { name: 'performedDate', type: 'TEXT', nullable: true, primaryKey: false },
      { name: 'notes', type: 'TEXT', nullable: true, primaryKey: false }
    ],
    indexes: ['procedure_id', 'patient_id'],
    constraints: [
      'UNIQUE(procedure_id)',
      'FOREIGN KEY(patient_id) REFERENCES Patient(patient_id)'
    ]
  }
};

export async function validateSchema(schema: TableInfo[]): Promise<{ valid: boolean; errors: string[] }> {
  const errors: string[] = [];
  
  // Check if all expected tables exist
  const expectedTables = Object.keys(EXPECTED_SCHEMA);
  const actualTables = schema.map(t => t.name);
  
  for (const expectedTable of expectedTables) {
    if (!actualTables.includes(expectedTable)) {
      errors.push(`Missing table: ${expectedTable}`);
    }
  }

  // Validate each table's structure
  for (const table of schema) {
    const expectedTable = EXPECTED_SCHEMA[table.name as keyof typeof EXPECTED_SCHEMA];
    if (!expectedTable) {
      errors.push(`Unexpected table: ${table.name}`);
      continue;
    }

    // Check columns
    const expectedColumns = new Map(expectedTable.columns.map(c => [c.name, c]));
    const actualColumns = new Map(table.columns.map(c => [c.name, c]));

    // Check for missing or extra columns
    for (const [colName, expectedCol] of expectedColumns) {
      const actualCol = actualColumns.get(colName);
      if (!actualCol) {
        errors.push(`Table ${table.name} is missing column: ${colName}`);
        continue;
      }

      // Validate column properties
      if (actualCol.type !== expectedCol.type) {
        errors.push(`Column ${table.name}.${colName} has wrong type: expected ${expectedCol.type}, got ${actualCol.type}`);
      }
      if (actualCol.nullable !== expectedCol.nullable) {
        errors.push(`Column ${table.name}.${colName} has wrong nullability: expected ${expectedCol.nullable}, got ${actualCol.nullable}`);
      }
      if (actualCol.primaryKey !== expectedCol.primaryKey) {
        errors.push(`Column ${table.name}.${colName} has wrong primary key setting: expected ${expectedCol.primaryKey}, got ${actualCol.primaryKey}`);
      }
    }

    // Check for extra columns
    for (const [colName] of actualColumns) {
      if (!expectedColumns.has(colName)) {
        errors.push(`Table ${table.name} has unexpected column: ${colName}`);
      }
    }

    // Validate indexes
    if (expectedTable.indexes) {
      const actualIndexes = await getTableIndexes(table.name);
      for (const expectedIndex of expectedTable.indexes) {
        if (!actualIndexes.includes(expectedIndex)) {
          errors.push(`Table ${table.name} is missing index: ${expectedIndex}`);
        }
      }
    }

    // Validate constraints
    if (expectedTable.constraints) {
      const actualConstraints = await getTableConstraints(table.name);
      for (const expectedConstraint of expectedTable.constraints) {
        if (!actualConstraints.includes(expectedConstraint)) {
          errors.push(`Table ${table.name} is missing constraint: ${expectedConstraint}`);
        }
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

async function getTableIndexes(tableName: string): Promise<string[]> {
  const db = await initMedfetchDB();
  const indexes = await db.db.prepare(`
    SELECT name 
    FROM sqlite_master 
    WHERE type='index' 
    AND tbl_name='${tableName}';
  `).all();
  return indexes.map((idx: { name: string }) => idx.name);
}

async function getTableConstraints(tableName: string): Promise<string[]> {
  const db = await initMedfetchDB();
  const constraints = await db.db.prepare(`
    SELECT sql 
    FROM sqlite_master 
    WHERE type='table' 
    AND name='${tableName}';
  `).all();
  
  // Extract constraints from CREATE TABLE statement
  const createTable = constraints[0]?.sql || '';
  const constraintMatches = createTable.match(/CONSTRAINT\s+[^,]+|UNIQUE\s*\([^)]+\)|FOREIGN\s+KEY\s*\([^)]+\)/gi) || [];
  return constraintMatches.map((c: string) => c.trim());
}

export async function getSchema(): Promise<TableInfo[]> {
  const db = await initMedfetchDB();
  
  // Get all tables
  const tables = await db.db.prepare(`
    SELECT name 
    FROM sqlite_master 
    WHERE type='table' 
    AND name NOT LIKE 'sqlite_%';
  `).all();

  const schema: TableInfo[] = [];

  // For each table, get its column information
  for (const table of tables) {
    const tableName = table.name;
    const columns = await db.db.prepare(`
      PRAGMA table_info(${tableName});
    `).all();

    const columnInfo: ColumnInfo[] = columns.map((col: any) => ({
      name: col.name,
      type: col.type,
      nullable: !col.notnull,
      primaryKey: col.pk === 1,
      defaultValue: col.dflt_value
    }));

    // Get foreign key information
    const foreignKeys = await db.db.prepare(`
      PRAGMA foreign_key_list(${tableName});
    `).all();

    // Add foreign key information to columns
    for (const fk of foreignKeys) {
      const column = columnInfo.find(c => c.name === fk.from);
      if (column) {
        column.foreignKey = {
          table: fk.table,
          column: fk.to
        };
      }
    }

    schema.push({
      name: tableName,
      columns: columnInfo,
      indexes: await getTableIndexes(tableName),
      constraints: await getTableConstraints(tableName)
    });
  }

  // Validate the schema
  const validation = await validateSchema(schema);
  if (!validation.valid) {
    console.warn('Schema validation errors:', validation.errors);
  }

  return schema;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const schema = await getSchema();
    const validation = await validateSchema(schema);
    
    return res.status(200).json({
      schema,
      validation: {
        valid: validation.valid,
        errors: validation.errors
      }
    });
  } catch (error) {
    console.error('Error getting schema:', error);
    return res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Internal server error' 
    });
  }
} 