import sqlite3InitModule from "@sqlite.org/sqlite-wasm";

sqlite3InitModule().then((sqlite3) => {
    console.log("SQLite WASM Loaded!");
    const db = new sqlite3.oo1.DB(":memory:"); // Create in-memory SQLite database

    window.runQuery = function() {
        const query = document.getElementById("query").value;
        const outputField = document.getElementById("output");

        try {
            let result = db.exec(query, { resultRows: "array", columnNames: "array" });

            // If there's a result, format it nicely for the input field
            if (result.length > 0) {
                outputField.value = result.map(row => row.join(", ")).join(" | ");
            } else {
                outputField.value = "No results";
            }
        } catch (err) {
            outputField.value = "Error: " + err.message;
        }
    };
});

