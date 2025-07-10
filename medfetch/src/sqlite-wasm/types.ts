import type {
    Sqlite3Static,
    sqlite3_index_info,
    sqlite3_module,
    StructPtrMapper,
    WasmPointer,
    sqlite3_index_constraint_usage,
    sqlite3_index_constraint,
    sqlite3_vtab_cursor,
    sqlite3_vtab,
    ExecOptions,
} from "@sqlite.org/sqlite-wasm";

type CStructify<T> = {
    [K in keyof T as `$${string & K}`]: T[K];
};

interface FixedStructPtrMapper<T> extends StructPtrMapper<T> {
    unget: (ptr: WasmPointer, val?: T) => void; // make arg1 optional
}

type PointerLikeMethods<T> = {
    [K in keyof T]?: T[K] extends (...args: any[]) => any
        ? T[K] | 0 | true
        : T[K];
};

type Sqlite3IndexConstraintUsage = CStructify<sqlite3_index_constraint_usage>;
type Sqlite3IndexConstraint = CStructify<sqlite3_index_constraint>;

interface Sqlite3IndexInfo extends sqlite3_index_info {
    $nConstraint: number;
    nthConstraintUsage: (index: number) => Sqlite3IndexConstraintUsage;
    nthConstraint: (index: number) => Sqlite3IndexConstraint;
}

/**
 * Overriden vtab type so tsc stops screaming at me
 */
type Sqlite3Vtab = Omit<Sqlite3Static["vtab"], "xVtab" | "xIndexInfo"> & {
    xVtab: FixedStructPtrMapper<sqlite3_vtab>;
    xCursor: FixedStructPtrMapper<sqlite3_vtab_cursor>;
    xIndexInfo: (ptr: WasmPointer) => Sqlite3IndexInfo;
};

/**
 * Enum string types -- the discriminator
 *
 * Since both incoming and outgoing messages to worker1
 */
export type Worker1MessageType =
    | "open"
    | "close"
    | "exec"
    | "config-get"
    | "export";

/**
 * Let a "Request" be main thread --> worker thread
 */
export type Worker1RequestBase<
    Aux extends Record<any, any> = Record<string, any>,
> = {
    type: string;
    messageId?: string;
    dbId?: string;
    args?: any;
    aux?: Aux;
};

/**
 * Let a "Response" be main thread <-- worker thread
 */
export type Worker1ResponseBase = {
    type: string;
    messageId?: string;
    dbId?: string;
    result: any;
};

export interface Worker1CloseRequest extends Worker1RequestBase {
    type: "close";
    args?: { unlink: boolean };
}
export interface Worker1ConfigGetRequest extends Worker1RequestBase {
    type: "config-get";
    args?: any;
}

export interface Worker1ExecRequest extends Worker1RequestBase {
    type: "exec";
    args: ExecOptions & {
        sql: string;
        rowMode?: "array" | "object" | "stmt" | `$${string}` | number;
    };
}
export interface Worker1ExportRequest extends Worker1RequestBase {
    type: "export";
    args?: any;
}
export interface Worker1OpenRequest extends Worker1RequestBase {
    type: "open";
    args?: {
        filename?: string;
        vfs?: string;
    };
}

/**
 * @internal
 */
type _Worker1Request =
    | Worker1CloseRequest
    | Worker1ConfigGetRequest
    | Worker1ExecRequest
    | Worker1ExportRequest
    | Worker1OpenRequest;

/**
 * An outgoing message from main thread to the worker1 thread
 */
export type Worker1Request<
    MessageType extends Worker1MessageType = Worker1MessageType,
> = Extract<_Worker1Request, { type: MessageType }>;

export interface Worker1CloseResponse extends Worker1ResponseBase {
    type: "close";
    result: {
        filename: string | undefined;
    };
}
export interface Worker1ConfigGetResponse extends Worker1ResponseBase {
    type: "config-get";
    result: {
        version: Sqlite3Static["version"];
        bigIntEnabled: boolean;
        vfsList: ReturnType<Sqlite3Static["capi"]["sqlite3_js_vfs_list"]>;
    };
}
export interface Worker1ExecResponse extends Worker1ResponseBase {
    type: "exec";
    result: {
        resultRows?: any[];
    };
}
export interface Worker1ExportResponse extends Worker1ResponseBase {
    type: "export";
    result: {
        byteArray: Uint8Array;
        filename: string;
        mimetype: "application/x-sqlite3";
    };
}
export interface Worker1OpenResponse extends Worker1ResponseBase {
    type: "open";
    result: {
        filename: string;
        dbId: string;
        persistent: boolean;
        vfs: string;
    };
}

type Worker1ErrorBase = {
    type: "error";
    messageId?: any;
    dbId?: string;
    result: {
        operation: string;
        message: string;
        errorClass: string;
        input: any;
        stack?: string[];
    };
};

type Worker1ErrorResult<
    TMessageType extends string,
    TMessageUnion extends { type: string },
> = {
    operation: TMessageType;
    input: Extract<TMessageUnion, { type: TMessageType }>;
} & Omit<Worker1ErrorBase["result"], "operation" | "input">;

export interface _Worker1ResponseError<
    TMessageType extends string,
    TMessageUnion extends { type: string },
> extends Worker1ErrorBase {
    result: Worker1ErrorResult<TMessageType, TMessageUnion>;
}

/**
 * To encode a recoverable failure that the Worker1 thread
 * is able to send back to the main thread (so it doesn't hang awaiting forever)
 */
export type Worker1ResponseError<T extends string> = _Worker1ResponseError<
    T,
    Worker1Request
>;

/**
 * @internal
 */
type _Worker1Response =
    | Worker1CloseResponse
    | Worker1ConfigGetResponse
    | Worker1ExecResponse
    | Worker1ExportResponse
    | Worker1OpenResponse;

export type Worker1Response<
    MessageType extends Worker1MessageType = Worker1MessageType,
> = Extract<_Worker1Response, { type: MessageType }>;
    
export type PromiserResult<
    Type extends string,
    OK extends {type: string;} = Worker1Request,
> = Extract<OK, {type: Type}> | Worker1ResponseError<Type>;

type TPromiser<
    AllRequest extends { type: string; args?: any },
    AllResponse extends { type: string; result: any },
> = {
    <T extends AllRequest["type"]>(
        message: Extract<AllRequest, { type: T }>,
        transfer?: StructuredSerializeOptions | Transferable[],
    ): Promise<PromiserResult<T, AllResponse>>

    <T extends AllRequest["type"]>(
        type: T,
        args?: Extract<AllRequest, { type: T }>["args"],
    ): Promise<Extract<AllResponse, { type: T }> | Worker1ResponseError<T>>;
};

export type Worker1Promiser = TPromiser<Worker1Request, Worker1Response>;

/**
 * This is the name of the CTOR that brings in Sqlite3's
 * worker1 promiser function into main thread.
 *
 * This is, just to get that type, the Worker1 function type is [Worker1PromiserFunc]()
 */
export type Sqlite3CreateWorker1Promiser<TWorker = Worker> = {
    v2: (opts: { worker: TWorker }) => Promise<Worker1Promiser>;
};

export interface Sqlite3Module extends PointerLikeMethods<sqlite3_module> {
    pointer: number;
}

/**
 * "Fixed" Sqlite3Static type, which only modifies the `.vtab` type
 */
export interface Sqlite3 extends Omit<Sqlite3Static, "vtab"> {
    vtab: Sqlite3Vtab;
}

/**
 * Error on either worker or main thread side.
 * The only value exported by this "types" module
 */
export class Worker1Error extends Error {
    readonly _tag = "medfetch/sqlite-wasm.worker1";
    readonly thread: "main" | "worker";

    constructor(
        thread: "main" | "worker",
        ...args: ConstructorParameters<typeof Error>
    ) {
        super(...args);
        this.thread = thread;
    }
}
