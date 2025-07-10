import { describe, it } from "vitest";
import { getTableName } from "./table.js";

describe("getTableName", () => {
    it("Succeeds on any plaintext string that contains a \"create table [tblname]\" at the start", () => {
        const start = getTableName("create table foo");
        const end = getTableName("blah create table foo");
        const middle = getTableName("blah create table foo blah blah");
        
        expect(start).toEqual('foo');
        expect(end).toEqual(null);
        expect(end).toEqual(middle);
    })

    it("Succeeds on any \"CREATE TABLE\" statement that ends in a semi colon", () => {
        const createTable =
            `CREATE TABLE foo (
                id text,
                bar real
            );`
        const tableName = getTableName(createTable);
        expect(tableName).toBe("foo")
    });
    
    it("Succeeds on any \"CREATE TABLE\" statement that doesn't end in a semi colon", () => {
        const createTable =
            `CREATE TABLE foo (
                id TEXT,
                bar REAL
            )`;
        expect(
            getTableName(createTable)
        )
        .toBe("foo");
    });
    
    
    it("Returns the FIRST table name if the querytext includes multiple \"CREATE TABLE\" statements", () => {
        const createTable =
            `create table foo (id text); create table bar (id text); create table foobar (foo_id text not null references foo (id), bar_id text not null references bar (id));`;
        expect(
            getTableName(createTable)
        )
        .toBe("foo");
    });
    
    it("Normalizes casing of table names without dquotes", () => {
        const expected =
            getTableName(`create table foobar (id text);`);
        const camel =
            getTableName(`create table fooBar (id text);`);
        const capital =
            getTableName(`create table FooBar (id text);`);
        expect(camel).toEqual(expected);
        expect(capital).toEqual(expected);
    });
    
    it("Retains casing of table names with dquotes", () => {
        const camel =
            getTableName(`create table "fooBar" (id text);`);
        const capital =
            getTableName(`create table "FooBar" (id text);`);
        expect(camel).toEqual("fooBar");
        expect(capital).toEqual("FooBar");
    })
    
    it("Returns NULL on non \"CREATE TABLE\" statements", () => {
        const select = getTableName("select * from foo");
        const insert = getTableName("insert into foo (id) values ('foobar')");
        const update = getTableName("update foo set name = 'bar' where id = 'foobar'");
        const deleteStmt = getTableName("delete from foo where id = 'foobar'");
        
        expect(select).toBe(null);
        expect(select).toEqual(insert);
        expect(select).toEqual(update);
        expect(select).toEqual(deleteStmt);
    });
    
    it("Returns NULL on an incomplete \"CREATE TABLE\" statement", () => {
        const incomplete = getTableName(`create table`);
        const incompleteMadSpaces = getTableName(`create table                                   `);

        expect(incomplete).toEqual(null);
        expect(incomplete).toEqual(incompleteMadSpaces);
    });
});