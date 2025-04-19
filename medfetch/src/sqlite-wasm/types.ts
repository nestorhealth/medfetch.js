import type {
    Worker1CloseResponse,
    Worker1ConfigGetResponse,
    Worker1ExecResponse,
    Worker1ExportResponse,
    Worker1RequestBase,
    Worker1MessageType,
    Worker1OpenResponse,
    Worker1Request,
    Worker1ResponseBase,
    Worker1ResponseError,
} from "@sqlite.org/sqlite-wasm";
import { Effect } from "effect";

/* This is the types dumping file for "better" worker1 API */

/**
 * better-worker1 message type literals.
 * To help distinguish between the base sqlite wasm package messages
 * and the extension types, prefix the message type with `b1-`
 * ("[B]etter Worker[1]") to indicate this is not an original type of the
 * worker1
 *
 * @enum "b1-load-module" means instantiate a JS virtual table
 */
type _Better1MessageType = "load-module";

/**
 * Combined typed with the base Worker1 Message Types
 */
export type BetterWorker1MessageType =
    | Worker1MessageType
    | _Better1MessageType;

/**
 * Extended message base type
 */
interface BetterWorker1MessageBase extends Worker1RequestBase {
    type: BetterWorker1MessageType;
}

interface BetterWorker1ResponseBase<
    MessageType extends BetterWorker1MessageType = BetterWorker1MessageType,
> extends Worker1ResponseBase {
    type: MessageType;
    result: {
        operation: MessageType;
    };
}

/**
 * Message to indicate you want to load a virtual table module
 */
interface BetterWorker1LoadModuleRequest extends BetterWorker1MessageBase {
    type: "load-module";
    args?: {
        moduleURL: string; // can't pass a URL over threads (it's a class!)
        moduleName: string;
        portKeys?: string[]; // corresponding messageIds
        preloadAux?: any[];
        aux?: Uint8Array; // encode as Uint8Array, so user is in charge of converting it back
        // correctly in their module code
    };
}

interface BetterWorker1LoadModuleResponse extends BetterWorker1ResponseBase {
    type: "load-module";
    result: {
        rc: number;
        moduleName: string;
        operation: "load-module";
    };
}
/**
 * @internal
 */
type _BetterWorker1Request = Worker1Request | BetterWorker1LoadModuleRequest;

/**
 * An outgoing message to the BetterWorker1 thread
 */
export type BetterWorker1Request<
    MessageType extends BetterWorker1MessageType = BetterWorker1MessageType,
> = Extract<_BetterWorker1Request, { type: MessageType }>;

/**
 * @internal
 */
type _BetterWorker1Response =
    | Worker1OpenResponse
    | Worker1CloseResponse
    | Worker1ExecResponse
    | Worker1ExportResponse
    | Worker1ConfigGetResponse
    | BetterWorker1LoadModuleResponse;

/**
 * Response message
 */
export type BetterWorker1Response<
    MessageType extends BetterWorker1MessageType = BetterWorker1MessageType,
> = Extract<_BetterWorker1Response, { type: MessageType }>;

type InferMessageType<TType extends BetterWorker1MessageType> = Extract<
    BetterWorker1Request,
    { type: TType }
>;
type Pascal<S extends string> = S extends `${infer Head}-${infer Tail}`
    ? `${Capitalize<Head>}${Pascal<Capitalize<Tail>>}`
    : Capitalize<S>;
export type MessageHandlers<O> = {
    [key in BetterWorker1Response["type"] as `on${Pascal<key>}`]: (
        msg: InferMessageType<key>,
    ) => O;
};

/**
 * A Worker thread dispatched error message in response
 * to a request message of type `T`
 *
 * @template T If provided, narrows the type to the corresponding error.
 *           Otherwise is a disjoint union on the `result.operation` field.
 */
export type BetterWorker1ResponseError<
    MessageType extends BetterWorker1MessageType = BetterWorker1MessageType,
> = Worker1ResponseError<MessageType, BetterWorker1Request>;

type BetterWorker1MessagePair<Type extends BetterWorker1MessageType> = {
    request: BetterWorker1Request<Type>;
    response: BetterWorker1Response<Type>;
};

/**
 * Type lookup helper
 */
type MessageMap = {
    [Type in BetterWorker1MessageType]: BetterWorker1MessagePair<Type>;
};

/**
 * A request is a message sent from the MAIN thread.
 */
export const MESSAGE_TYPES = [
    "open",
    "close",
    "config-get",
    "exec",
    "export",
    "load-module",
] as const satisfies BetterWorker1MessageType[];

export type MessageTypeObjMap<V> = {
    [Type in BetterWorker1MessageType]: V;
};

/**
 * The base BetterWorker1 Promiser, which extends the promiser messenger
 * with an additional `StructuredSerializeOptions` arg at the end.
 */
export type BetterWorker1PromiserFunc = {
    <T extends BetterWorker1MessageType>(
        type: T,
        args?: MessageMap[T]["request"]["args"],
    ): Promise<MessageMap[T]["response"] | BetterWorker1ResponseError<T>>;

    <T extends BetterWorker1MessageType>(
        messageData: { type: T } & MessageMap[T]["request"],
        transfer?: StructuredSerializeOptions | Transferable[],
    ): Promise<MessageMap[T]["response"] | BetterWorker1ResponseError<T>>;
};

export type BetterWorker1PromiserLazy = {
    <T extends BetterWorker1MessageType>(
        type: T,
        args?: MessageMap[T]["request"]["args"],
    ): Effect.Effect<MessageMap[T]["response"], BetterWorker1ResponseError<T>>;

    <T extends BetterWorker1MessageType>(
        messageData: { type: T } & MessageMap[T]["request"],
        transfer?: StructuredSerializeOptions | Transferable[],
    ): Effect.Effect<MessageMap[T]["response"], BetterWorker1ResponseError<T>>;
};
