import { D1Client, D1ExecResult, D1PreparedStatement, D1Result } from './d1';

export class D1DatabaseWrapper implements D1Client {
  constructor(private db: D1Database) {}

  prepare(query: string): D1PreparedStatement {
    const stmt = this.db.prepare(query);
    const self: D1PreparedStatement = {
      bind: (...values: any[]) => {
        stmt.bind(...values);
        return self;
      },
      first: async <T = unknown>(colName: string) => {
        const result = await stmt.first<T>(colName);
        return result;
      },
      run: async () => {
        try {
          await stmt.run();
          return { success: true };
        } catch (error) {
          return { success: false, error: String(error) };
        }
      },
      all: async <T = unknown>() => {
        try {
          const results = await stmt.all<T>();
          return { success: true, results: results.results };
        } catch (error) {
          return { success: false, error: String(error), results: [] };
        }
      }
    };
    return self;
  }

  async exec(query: string): Promise<D1ExecResult> {
    try {
      await this.db.exec(query);
      return { success: true };
    } catch (error) {
      return { success: false, error: String(error) };
    }
  }
} 