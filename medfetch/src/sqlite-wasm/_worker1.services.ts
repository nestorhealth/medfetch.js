import {
    Array,
    Union,
    String,
    Tuple,
    parseJson,
    decodeSync,
} from "effect/Schema";
import type { SqlValue } from "@sqlite.org/sqlite-wasm";
import { Column, ColumnPath, ViewDefinition } from "~/core/view";
import { taggedEnum, TaggedEnum } from "effect/Data";

/**
 * `fp` hidden column accepted types once it is JSON parsed
 */
const UserFp = Array(
    Union(
        /* 'any.path.string()'; name becomes 'path' (last non-function subpath) */
        String,
        /* json_array('column_name', 'column_path') */
        Tuple(String, String),
        /* json_array('forEach' | 'forEachOrNull', 'parent_path', 'child_column_path')'
       'child_column_path' column name defaults to last non-function subpath */
        Tuple(String, String, String),
        /* json_array('forEach' | 'forEachOrNull', 'parent_path', 'child_column_name', 'child_column_name') */
        Tuple(String, String, String, String),
    ),
);

/**
 * Decodes the hidden fp column constraint into a 1-3 string tuple element array
 * @param u The fp column string
 * @param options Effect options
 * @returns The validated JSON parsed object (array).
 */
export const decodeJsonFp = parseJson(UserFp).pipe(decodeSync);

function getColumnName(path: string | [string, any]) {
    if (typeof path !== "string") return path[0]; // default to the 'key' element in the 2-tuple

    let cleaned = path;
    while (cleaned.match(/\.\w+\([^)]*\)$/)) {
        cleaned = cleaned.replace(/\.\w+\([^)]*\)$/, "");
    }

    // split on '.' and return tail
    const parts = cleaned.split(".");
    return parts[parts.length - 1];
}

/**
 * Generates a ViewDefinition from a `WHERE "fp" = json_array(...)` query clause
 * @param args The vtable function args
 * @returns The ViewDefinition
 */
export function generateViewDefinition(args: SqlValue[]) {
    const [resourceType, fp] = args;
    if (!resourceType || typeof resourceType !== "string")
        throw new Worker1Error(
            "worker",
            `unexpected invalid "type" column value (args[0])`,
        );

    if (!fp || typeof fp !== "string") {
        // no fhirpath map, then just return null and default to the whole object
        return null;
    }
    const paths = decodeJsonFp(fp);
    const columns = paths.reduce((acc, pathArg) => {
        if (typeof pathArg === "string") {
            acc.push(
                ColumnPath({
                    path: pathArg,
                    name: getColumnName(pathArg),
                    collection: true,
                }),
            );
        } else if (pathArg.length === 2) {
            const [name, path] = pathArg;
            acc.push(
                ColumnPath({
                    path,
                    name,
                    collection: true,
                }),
            );
        }
        return acc;
    }, [] as ColumnPath[]);
    return ViewDefinition({
        status: "active",
        name: resourceType,
        resource: resourceType,
        constant: [],
        select: [
            Column({
                column: columns,
            }),
        ],
        where: [],
    });
}

export type TokenMessage = TaggedEnum<{
    /**
     * @category Both
     */
    error: {
        readonly id: string;
        readonly message: string;
    };

    /**
     * @category Incoming
     */
    tokenExpired: {
        readonly sab: SharedArrayBuffer;
    };
}>;
export const TokenMessage = taggedEnum<TokenMessage>();

export class TokenFetcher {
    #port: MessagePort | undefined;
    #accessToken: string | undefined;

    // 4B for signal + 4B for status code + 512B for token string (UTF-8 encoded)
    static readonly BUFFER_SIZE = 4 + 4 + 512;

    constructor(port: MessagePort | undefined) {
        this.#port = port;
        this.#port?.start();
    }

    get(expired = false): string | undefined {
        if (this.#accessToken && !expired) return this.#accessToken;
        if (!this.#port) {
            console.error(
                `[medfetch/sqlite-wasm/vtab::Tokenizer]: No MessagePort to get the access token from, returning undefined...`,
            );
            return undefined;
        }

        const sab = new SharedArrayBuffer(TokenFetcher.BUFFER_SIZE);
        const signal = new Int32Array(sab, 0, 1); // signal[0] = wake flag
        const status = new Int32Array(sab, 4, 1); // status[0] = success (1) or error (-1)
        const buffer = new Uint8Array(sab, 8); // token string as bytes

        this.#port.postMessage(TokenMessage.tokenExpired({ sab }));

        Atomics.wait(signal, 0, 0); // wait for main thread to wake us

        const code = status[0];
        if (code !== 1) return undefined;

        const token = new TextDecoder()
            .decode(buffer.slice())
            .replace(/\0.*$/, ""); // strip null padding
        return (this.#accessToken = token);
    }

    clear(): void {
        this.#accessToken = undefined;
    }
}

// @ts-ignore TODO reintegrate
function createTokenChannel(
    getAccessToken: () => Promise<{
        access_token: string;
        expiresIn?: number;
    }>,
): Promise<MessagePort> {
    return new Promise<MessagePort>((resolve, reject) => {
        const { port1, port2 } = new MessageChannel();

        port1.onmessage = (event) => {
            return TokenMessage.$match(event.data, {
                async tokenExpired({ sab }) {
                    const signal = new Int32Array(sab, 0, 1); // 4B at offset 0
                    const status = new Int32Array(sab, 4, 1); // 4B at offset 4
                    const buffer = new Uint8Array(sab, 8); // remainder is token bytes

                    try {
                        const { access_token } = await getAccessToken();
                        // Write token to SAB
                        const encoded = new TextEncoder().encode(access_token);
                        buffer.fill(0);
                        buffer.set(encoded.slice(0, buffer.length));
                        status[0] = 1;
                    } catch (e) {
                        status[0] = -1;
                    }

                    Atomics.store(signal, 0, 1); // mark ready
                    Atomics.notify(signal, 0); // wake the waiting thread
                },

                error(data) {
                    reject(data);
                },
            });
        };

        resolve(port2); // port2 is for the sqlite3 worker
    });
}

/**
 * Error on either worker or main thread side
 */
export class Worker1Error extends Error {
    readonly _tag = "Worker1Error";
    readonly thread: "main" | "worker";

    constructor(
        thread: "main" | "worker",
        ...args: ConstructorParameters<typeof Error>
    ) {
        super(...args);
        this.thread = thread;
    }
}
