import { MedfetchClient } from "@/lib/client";

export type TransactionIsolationLevel = 
  | 'READ UNCOMMITTED'
  | 'READ COMMITTED'
  | 'SERIALIZABLE';

export interface TransactionOptions {
  isolationLevel?: TransactionIsolationLevel;
  onError?: (error: Error) => void;
  onRollback?: () => void;
  onCommit?: () => void;
}

interface TransactionState {
  name: string;
  isolationLevel: TransactionIsolationLevel;
  savepoints: string[];
}

export class TransactionManager {
  private transactionStack: TransactionState[] = [];
  private savepointCounter = 0;

  constructor(private db: MedfetchClient) {}

  /**
   * Starts a new transaction with optional isolation level
   */
  async begin(options: TransactionOptions = {}): Promise<void> {
    const { isolationLevel = 'SERIALIZABLE' } = options;
    const transactionName = `transaction_${Date.now()}_${this.transactionStack.length}`;

    try {
      // SQLite only supports SERIALIZABLE and READ UNCOMMITTED
      // READ COMMITTED is emulated using savepoints
      if (isolationLevel === 'READ COMMITTED') {
        await this.db.db.exec('BEGIN TRANSACTION;');
        await this.createSavepoint(transactionName);
      } else {
        await this.db.db.exec(`BEGIN ${isolationLevel} TRANSACTION;`);
      }

      this.transactionStack.push({
        name: transactionName,
        isolationLevel,
        savepoints: []
      });
    } catch (err: unknown) {
      const error = err as Error;
      options.onError?.(error);
      throw new Error(`Failed to begin transaction: ${error.message}`);
    }
  }

  /**
   * Creates a savepoint within the current transaction
   */
  async createSavepoint(name?: string): Promise<string> {
    if (this.transactionStack.length === 0) {
      throw new Error('No transaction in progress');
    }

    const currentTransaction = this.transactionStack[this.transactionStack.length - 1];
    const savepointName = name || `savepoint_${currentTransaction.name}_${this.savepointCounter++}`;
    
    try {
      await this.db.db.exec(`SAVEPOINT ${savepointName};`);
      currentTransaction.savepoints.push(savepointName);
      return savepointName;
    } catch (err: unknown) {
      const error = err as Error;
      throw new Error(`Failed to create savepoint: ${error.message}`);
    }
  }

  /**
   * Rolls back to a specific savepoint
   */
  async rollbackToSavepoint(savepointName: string, options: TransactionOptions = {}): Promise<void> {
    if (this.transactionStack.length === 0) {
      throw new Error('No transaction in progress');
    }

    const currentTransaction = this.transactionStack[this.transactionStack.length - 1];
    if (!currentTransaction.savepoints.includes(savepointName)) {
      throw new Error(`Savepoint ${savepointName} not found in current transaction`);
    }

    try {
      await this.db.db.exec(`ROLLBACK TO SAVEPOINT ${savepointName};`);
      // Remove all savepoints after this one
      const index = currentTransaction.savepoints.indexOf(savepointName);
      currentTransaction.savepoints = currentTransaction.savepoints.slice(0, index + 1);
      options.onRollback?.();
    } catch (err: unknown) {
      const error = err as Error;
      options.onError?.(error);
      throw new Error(`Failed to rollback to savepoint: ${error.message}`);
    }
  }

  /**
   * Commits the current transaction
   */
  async commit(options: TransactionOptions = {}): Promise<void> {
    if (this.transactionStack.length === 0) {
      throw new Error('No transaction in progress');
    }

    const currentTransaction = this.transactionStack.pop();
    if (!currentTransaction) {
      throw new Error('Transaction state is inconsistent');
    }

    try {
      if (currentTransaction.isolationLevel === 'READ COMMITTED') {
        // For READ COMMITTED, we need to release the savepoint
        await this.db.db.exec(`RELEASE SAVEPOINT ${currentTransaction.name};`);
      }
      await this.db.db.exec('COMMIT;');
      options.onCommit?.();
    } catch (err: unknown) {
      const error = err as Error;
      // If commit fails, we need to rollback
      await this.rollback(options);
      options.onError?.(error);
      throw new Error(`Failed to commit transaction: ${error.message}`);
    }
  }

  /**
   * Rolls back the current transaction
   */
  async rollback(options: TransactionOptions = {}): Promise<void> {
    if (this.transactionStack.length === 0) {
      throw new Error('No transaction in progress');
    }

    const currentTransaction = this.transactionStack.pop();
    if (!currentTransaction) {
      throw new Error('Transaction state is inconsistent');
    }

    try {
      await this.db.db.exec('ROLLBACK;');
      options.onRollback?.();
    } catch (err: unknown) {
      const error = err as Error;
      options.onError?.(error);
      throw new Error(`Failed to rollback transaction: ${error.message}`);
    }
  }

  /**
   * Executes a function within a transaction with specified isolation level
   */
  async executeInTransaction<T>(
    operation: () => Promise<T>,
    options: TransactionOptions = {}
  ): Promise<T> {
    await this.begin(options);
    try {
      const result = await operation();
      await this.commit(options);
      return result;
    } catch (err: unknown) {
      const error = err as Error;
      await this.rollback(options);
      throw error;
    }
  }

  /**
   * Executes a function within a nested transaction
   * Note: SQLite doesn't support true nested transactions, so we use savepoints
   */
  async executeInNestedTransaction<T>(
    operation: () => Promise<T>,
    options: TransactionOptions = {}
  ): Promise<T> {
    if (this.transactionStack.length === 0) {
      return this.executeInTransaction(operation, options);
    }

    const savepointName = await this.createSavepoint();
    try {
      const result = await operation();
      // For nested transactions, we don't commit, just release the savepoint
      await this.db.db.exec(`RELEASE SAVEPOINT ${savepointName};`);
      return result;
    } catch (err: unknown) {
      const error = err as Error;
      await this.rollbackToSavepoint(savepointName, options);
      throw error;
    }
  }

  /**
   * Checks if a transaction is currently in progress
   */
  isInTransaction(): boolean {
    return this.transactionStack.length > 0;
  }

  /**
   * Gets the current transaction state
   */
  getCurrentTransaction(): TransactionState | null {
    return this.transactionStack.length > 0 
      ? this.transactionStack[this.transactionStack.length - 1] 
      : null;
  }

  /**
   * Gets the current isolation level
   */
  getCurrentIsolationLevel(): TransactionIsolationLevel | null {
    const currentTransaction = this.getCurrentTransaction();
    return currentTransaction?.isolationLevel || null;
  }
} 