
/**
 * Utility functions for database testing
 */

import { Kysely, sql } from "kysely";

export interface TestData {
  id: number;
  name: string;
  age: number;
  is_active: boolean;
  created_at: string;
  score: number;
  email?: string;
}

export const generateTestData = (count: number): TestData[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `Test User ${i + 1}`,
    age: 20 + Math.floor(Math.random() * 30),
    is_active: Math.random() > 0.5,
    created_at: new Date(2024, 0, i + 1).toISOString().split('T')[0],
    score: 80 + Math.random() * 20,
    email: `user${i + 1}@example.com`
  }));
};

export const verifyTableExists = async (db: Kysely<any>, tableName: string): Promise<boolean> => {
  const result = await sql.raw(`
    SELECT name FROM sqlite_master 
    WHERE type='table' AND name='${tableName}';
  `).execute(db).then(r => r.rows);
  return result.length > 0;
};

export const getTableRowCount = async (db: Kysely<any>, tableName: string): Promise<number> => {
  const result = await sql.raw(`SELECT COUNT(*) as count FROM ${tableName};`).execute(db).then(result => result.rows);
  return (result[0] as { count: number }).count;
}; 