import {
  CompiledQuery,
  IdentifierNode,
  RawNode,
  SelectQueryNode,
  SqliteAdapter,
  SqliteIntrospector,
  SqliteQueryCompiler
} from "./chunk-EP7ZSNVX.js";
import {
  __publicField
} from "./chunk-MZQ22LAU.js";

// ../../node_modules/.pnpm/kysely-generic-sqlite@1.2.1_kysely@0.28.2/node_modules/kysely-generic-sqlite/dist/chunk-YWE62C55.js
var BaseSqliteDialect = class {
  /**
   * Base class that implements {@link Dialect}
   * @param create function that create {@link Driver}
   */
  constructor(create) {
    __publicField(this, "createDriver");
    this.createDriver = create;
  }
  createQueryCompiler() {
    return new SqliteQueryCompiler();
  }
  createAdapter() {
    return new SqliteAdapter();
  }
  createIntrospector(db) {
    return new SqliteIntrospector(db);
  }
};
var ConnectionMutex = class {
  constructor() {
    __publicField(this, "promise");
    __publicField(this, "resolve");
  }
  async lock() {
    while (this.promise) {
      await this.promise;
    }
    this.promise = new Promise((resolve) => {
      this.resolve = resolve;
    });
  }
  unlock() {
    const resolve = this.resolve;
    this.promise = void 0;
    this.resolve = void 0;
    resolve == null ? void 0 : resolve();
  }
};
async function runSavepoint(command, createQueryId, connection, savepointName, compileQuery) {
  await connection.executeQuery(
    compileQuery(
      RawNode.createWithChildren([
        RawNode.createWithSql(`${command} `),
        IdentifierNode.create(savepointName)
        // ensures savepointName gets sanitized
      ]),
      createQueryId()
    )
  );
}
var BaseSqliteDriver = class {
  /**
   * Base abstract class that implements {@link Driver}
   *
   * You **MUST** assign `this.conn` in `init` and implement `destroy` method
   */
  constructor(init) {
    __publicField(this, "mutex", new ConnectionMutex());
    __publicField(this, "conn");
    __publicField(this, "savepoint");
    __publicField(this, "releaseSavepoint");
    __publicField(this, "rollbackToSavepoint");
    __publicField(this, "init");
    this.init = () => import("./kysely.js").then(({ createQueryId }) => {
      if (createQueryId) {
        this.savepoint = runSavepoint.bind(null, "savepoint", createQueryId);
        this.releaseSavepoint = runSavepoint.bind(null, "release", createQueryId);
        this.rollbackToSavepoint = runSavepoint.bind(null, "rollback to", createQueryId);
      }
    }).then(init);
  }
  async acquireConnection() {
    await this.mutex.lock();
    return this.conn;
  }
  async beginTransaction(connection) {
    await connection.executeQuery(CompiledQuery.raw("begin"));
  }
  async commitTransaction(connection) {
    await connection.executeQuery(CompiledQuery.raw("commit"));
  }
  async rollbackTransaction(connection) {
    await connection.executeQuery(CompiledQuery.raw("rollback"));
  }
  async releaseConnection() {
    this.mutex.unlock();
  }
};
function buildQueryFnAlt(exec) {
  return async (isSelect, sql, parameters) => isSelect ? { rows: await exec.all(sql, parameters) } : { rows: [], ...await exec.run(sql, parameters) };
}
function buildQueryFn(exec) {
  return async (isSelect, sql, parameters) => {
    const rows = await exec.all(sql, parameters);
    return isSelect || rows.length ? { rows } : { rows: [], ...await exec.run("select 1") };
  };
}
function parseBigInt(num) {
  return num === void 0 || num === null ? void 0 : BigInt(num);
}

// ../../node_modules/.pnpm/kysely-generic-sqlite@1.2.1_kysely@0.28.2/node_modules/kysely-generic-sqlite/dist/index.js
var GenericSqliteDriver = class extends BaseSqliteDriver {
  constructor(executor, onCreateConnection) {
    super(async () => {
      this.db = await executor();
      this.conn = new GenericSqliteConnection(this.db);
      await (onCreateConnection == null ? void 0 : onCreateConnection(this.conn));
    });
    __publicField(this, "db");
  }
  async destroy() {
    var _a;
    await ((_a = this.db) == null ? void 0 : _a.close());
  }
};
var GenericSqliteConnection = class {
  constructor(db) {
    this.db = db;
  }
  async *streamQuery({ parameters, query, sql }) {
    if (!this.db.iterator) {
      throw new Error("streamQuery() is not supported.");
    }
    const it = this.db.iterator(SelectQueryNode.is(query), sql, parameters);
    for await (const row of it) {
      yield { rows: [row] };
    }
  }
  async executeQuery({ parameters, query, sql }) {
    return await this.db.query(SelectQueryNode.is(query), sql, parameters);
  }
};
var GenericSqliteDialect = class extends BaseSqliteDialect {
  /**
   * Dialect for generic SQLite that run SQLs in current thread
   *
   * @param executor function to create {@link IGenericSqlite}
   * @param onCreateConnection optional callback after connection created
   */
  constructor(executor, onCreateConnection) {
    super(() => new GenericSqliteDriver(executor, onCreateConnection));
  }
};
export {
  BaseSqliteDialect,
  BaseSqliteDriver,
  GenericSqliteConnection,
  GenericSqliteDialect,
  GenericSqliteDriver,
  buildQueryFn,
  buildQueryFnAlt,
  parseBigInt
};
//# sourceMappingURL=kysely-generic-sqlite.js.map
