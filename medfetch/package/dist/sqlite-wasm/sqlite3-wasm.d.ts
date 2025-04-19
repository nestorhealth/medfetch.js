import "@sqlite.org/sqlite-wasm";
import { Promiser } from "./services";
import type { UnknownException } from "effect/Cause";
import type { Effect } from "effect/Effect";

declare module "@sqlite.org/sqlite-wasm" {
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
    export type Worker1RequestBase = {
        type: string;
        messageId?: string;
        dbId?: string;
        args?: any;
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

    interface Worker1CloseRequest extends Worker1RequestBase {
        type: "close";
        args?: { unlink: boolean };
    }
    interface Worker1ConfigGetRequest extends Worker1RequestBase {
        type: "config-get";
        args?: {};
    }

    interface Worker1ExecRequest extends Worker1RequestBase {
        type: "exec";
        args: ExecOptions & {
            sql: string;
            rowMode?: "array" | "object" | "stmt" | `\$${string}` | number;
        };
    }
    interface Worker1ExportRequest extends Worker1RequestBase {
        type: "export";
        args?: {};
    }
    interface Worker1OpenRequest extends Worker1RequestBase {
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

    interface Worker1CloseResponse extends Worker1ResponseBase {
        type: "close";
        result: {
            filename: string | undefined;
        };
    }
    interface Worker1ConfigGetResponse extends Worker1ResponseBase {
        type: "config-get";
        result: {
            version: Sqlite3Static["version"];
            bigIntEnabled: boolean;
            vfsList: ReturnType<Sqlite3Static["capi"]["sqlite3_js_vfs_list"]>;
        };
    }
    interface Worker1ExecResponse extends Worker1ResponseBase {
        type: "exec";
        result: any;
    }
    interface Worker1ExportResponse extends Worker1ResponseBase {
        type: "export";
        result: {
            byteArray: Uint8Array;
            filename: string;
            mimetype: "application/x-sqlite3";
        };
    }
    interface Worker1OpenResponse extends Worker1ResponseBase {
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

    interface Worker1ErrorResult<
        TMessageType extends string,
        TMessageUnion extends { type: string },
    > extends Worker1ErrorBase {
        operation: TMessageType;
        input: Extract<TMessageUnion, { type: TMessageType }>;
    }

    export interface Worker1ResponseError<
        TMessageType extends string,
        TMessageUnion extends { type: string },
    > extends Worker1ErrorBase {
        result: Worker1ErrorResult<TMessageType, TMessageUnion>;
    }

    /**
     * To encode a recoverable failure that the Worker1 thread
     * is able to send back to the main thread (so it doesn't hang awaiting forever)
     */
    export type Worker1ResponseError<T extends Worker1MessageType> =
        Worker1ResponseError<T, Worker1Request>;

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
        MessageType extends Worker1MessageType = MessageType,
    > = Extract<_Worker1Response, { type: MessageType }>;

    export type TPromiser<
        MsgType extends string,
        MsgRequest extends { type: MessageType; args?: any },
        MsgResponse extends { type: MessageType; result: any },
    > = {
        /**
         * 1-arg overload
         */
        <
            MessageType extends MsgType,
            MessageRequest extends Extract<MsgRequest, { type: MessageType }>,
        >(
            message: MessageRequest,
        ): Promise<
            | Extract<MsgResponse, { type: TMessageType }>
            | Worker1ResponseError<MessageType, MsgRequest>
        >;

        /**
         * 2-arg overload (easy handle)
         */
        <
            MessageType extends MsgType,
            MessageRequest extends Extract<MsgRequest, { type: MessageType }>,
        >(
            messageType: MessageType,
            messageArguments?: MessageRequest["args"],
        ): Promise<
            | Extract<MsgResponse, { type: TMessageType }>
            | Worker1ResponseError<MessageType, TMessage>
        >;
    };

    export type Worker1Promiser = TPromiser<
        Worker1MessageType,
        Worker1Request,
        Worker1Response
    >;

    export const sqlite3Worker1Promiser: {
        v2: (config: any) => Promise<Worker1Promiser>;
    };

    /**
     * This is the name of the CTOR that brings in Sqlite3's
     * worker1 promiser function into main thread.
     *
     * This is just to get that type, the Worker1 function type
     * is [Worker1PromiserFunc]()
     */
    export type Sqlite3Worker1Promiser = typeof sqlite3Worker1Promiser;
}
