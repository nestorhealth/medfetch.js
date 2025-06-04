import type { sqlite3_module } from "@sqlite.org/sqlite-wasm";

type PointerLikeMethods<T> = {
    [K in keyof T]?: T[K] extends (...args: any[]) => any
        ? T[K] | 0 | true
        : T[K];
};

export interface Sqlite3Module extends PointerLikeMethods<sqlite3_module> {}