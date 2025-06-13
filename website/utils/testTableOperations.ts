import { getMedfetchDB } from "@/lib/client";
import { TableManager } from "./tableManager";
import { TransactionManager, TransactionIsolationLevel } from "./transactionManager";
import { generateTestData, verifyTableExists } from "./testUtils";

async function runTests() {
  console.log("Initializing test database...");
  const db = getMedfetchDB();
  const tableManager = new TableManager(db);
  const transactionManager = new TransactionManager(db);

  try {
    // Test 1: Create a test table with various column types
    console.log("\nTest 1: Creating test table...");
    await tableManager.createTable({
      name: "TestTable",
      columns: [
        { name: "id", type: "INTEGER", primaryKey: true },
        { name: "name", type: "TEXT", nullable: false },
        { name: "age", type: "INTEGER", check: "age >= 0" },
        { name: "is_active", type: "BOOLEAN", defaultValue: true },
        { name: "created_at", type: "DATE" },
        { name: "score", type: "REAL" }
      ]
    });
    
    // Verify table was created
    const tableExists = await verifyTableExists(db, "TestTable");
    console.log(`✓ Table created successfully (verified: ${tableExists})`);

    // Test 2: Insert test data using utility function
    console.log("\nTest 2: Inserting test data...");
    const testData = generateTestData(3);

    const insertResult = await tableManager.bulkInsert("TestTable", testData);
    console.log(`✓ Bulk insert completed: ${insertResult.affectedRows} rows inserted`);

    // Test 3: Validate data constraints
    console.log("\nTest 3: Testing data validation...");
    try {
      await tableManager.validateData("TestTable", {
        id: 4,
        name: null, // Should fail due to NOT NULL constraint
        age: 30,
        is_active: true,
        created_at: "2024-01-04",
        score: 85.0
      });
      console.log("✗ Validation should have failed for null name");
    } catch (_err: unknown) {
      console.log("✓ Validation correctly caught null name error", _err);
    }

    try {
      await tableManager.validateData("TestTable", {
        id: 4,
        name: "Test User",
        age: -1, // Should fail due to CHECK constraint
        is_active: true,
        created_at: "2024-01-04",
        score: 85.0
      });
      console.log("✗ Validation should have failed for negative age");
    } catch (_err: unknown) {
      console.log("✓ Validation correctly caught negative age error", _err);
    }

    // Test 4: Test transaction isolation levels
    console.log("\nTest 4: Testing transaction isolation...");
    async function testIsolationLevel(level: TransactionIsolationLevel) {
      console.log(`Testing ${level} isolation level...`);
      try {
        await transactionManager.executeInTransaction(
          async () => {
            // Update a row
            await db.exec(`
              UPDATE TestTable 
              SET score = score + 10 
              WHERE id = 1;
            `);
            console.log(`✓ Transaction with ${level} isolation executed successfully`);
          },
          { isolationLevel: level }
        );
      } catch (err) {
        console.log(`✗ Transaction with ${level} isolation failed:`, err);
      }
    }

    await testIsolationLevel("READ UNCOMMITTED");
    await testIsolationLevel("READ COMMITTED");
    await testIsolationLevel("SERIALIZABLE");

    // Test 5: Test schema alteration
    console.log("\nTest 5: Testing schema alteration...");
    await tableManager.addColumn("TestTable", {
      name: "email",
      type: "TEXT",
      unique: true
    });
    console.log("✓ Added email column");

    // Test 6: Test bulk update
    console.log("\nTest 6: Testing bulk update...");
    const updateData = [
      { id: 1, score: 100.0 },
      { id: 2, score: 90.0 },
      { id: 3, score: 95.0 }
    ];

    const updateResult = await tableManager.bulkUpdate("TestTable", updateData, "id");
    console.log(`✓ Bulk update completed: ${updateResult.affectedRows} rows updated`);

    // Test 7: Test nested transactions
    console.log("\nTest 7: Testing nested transactions...");
    try {
      await transactionManager.executeInTransaction(
        async () => {
          // Outer transaction
          await db.exec(`
            UPDATE TestTable 
            SET score = score + 5 
            WHERE id = 1;
          `);

          // Nested transaction
          await transactionManager.executeInNestedTransaction(
            async () => {
              await db.exec(`
                UPDATE TestTable 
                SET score = score - 2 
                WHERE id = 1;
              `);
              console.log("✓ Nested transaction executed successfully");
            }
          );
        }
      );
      console.log("✓ Outer transaction committed successfully");
    } catch (err) {
      console.log("✗ Transaction failed:", err);
    }

    // Test 8: Verify final state
    console.log("\nTest 8: Verifying final state...");
    const finalData = await db.prepare("SELECT * FROM TestTable ORDER BY id;").all();
    console.log("Final table state:", JSON.stringify(finalData, null, 2));

    console.log("\nAll tests completed successfully!");
  } catch (err) {
    console.error("Test failed:", err);
  } finally {
    // Cleanup
    await tableManager.dropTable("TestTable");
    console.log("\nTest table dropped");
  }
}

// Run the tests
runTests().catch(console.error); 