import { describe, it } from "vitest";
import medfetch from "./sqlite-wasm.js";
import { Kysely } from "kysely";

const API_URL = "https://jsonplaceholder.typicode.com";
type DB = {
    users: {
        id: number;
        name: string;
        username: string;
        email: string;
        address: string;
        phone: string;
        website: string;
        company: string;
    };
    posts: {
        userId: number;
        id: number;
        title: string;
        body: string;
    }
}

describe("medfetch/sqlite-wasm", () => {
    it("Can ping an API without an explicit schema passed", async () => {
        const dialect = medfetch(API_URL, `
            create table "users" (
                "id" int,
                "name" text,
                "username" text,
                "email" text,
                "address" text,
                "phone" text,
                "website" text,
                "company" text
            );
            create table "posts" (
                "userId" int,
                "id" int,
                "title" text,
                "body" text
            );
        `);
        const db = new Kysely<DB>({ dialect });
        const users = await db
            .selectFrom("users")
            .selectAll()
            .execute();
        expect(users.length).toBeGreaterThan(0);
    });
});
