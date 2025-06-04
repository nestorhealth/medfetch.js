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
} from "./types.patch"
import { runPromise, type Effect } from "effect/Effect";

/**
 * @internal
 */
export type AwaitableEffect<A, E, R> = Effect<A, E, R> & Promise<A>;

/**
 * @internal
 */
export function makeAwaitable<A, E, R>(
    eff: Effect<A, E, R>,
): AwaitableEffect<A, E, R> {
    return Object.assign(eff, {
        then(
            onfulfilled: (val: unknown) => any,
            onrejected?: (err: any) => any,
        ) {
            return runPromise(eff as any).then(onfulfilled, onrejected);
        },
    }) as any;
}


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
export type BetterWorker1MessageType = Worker1MessageType | _Better1MessageType;

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
        
        /**
         * Any user defined auxillary data they want to pass back
         * to their module init export function.
         */
        aux?: Record<string, any>;

        /**
         * The data that {@link sqlite3_module["xCreate"]} will pass in for
         * arg1 `pAux`.
         *
         * Mainly unnecessary since the load-module interface for user-modules
         * wraps {@link aux} in a closure (so you can pass plain JS data through it), but is here anyway as an option if aux doesn't work
         * for some edge case.
         */
        pAuxBytes?: Uint8Array;
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
 * Public Response {@link MessageEvent.data} type
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

export type Worker1MessageHandlers<O> = {
    [key in BetterWorker1Response["type"] as `on${Pascal<key>}`]: (
        next: () => void,
        msg: InferMessageType<key>,
    ) => O;
}

/**
 * A Worker thread dispatched error message in response
 * to a request message of type `T`
 *
 * @template T If provided, narrows the type to the corresponding error.
 *           Otherwise is a disjoint union on the `result.operation` field.
 */
export type BetterWorker1ResponseError<
    MessageType extends BetterWorker1MessageType = BetterWorker1MessageType,
> = Worker1ResponseError<MessageType>;

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

export type MessageTypeRecord<V> = {
    [Type in BetterWorker1MessageType]: V;
};

/**
 * The base BetterWorker1 Promiser, which extends the promiser messenger
 * with an additional StructuredSerializeOptions arg at the end.
 */
export type BetterWorker1PromiserFn = {
  <T extends BetterWorker1MessageType>(
    messageData: BetterWorker1Request<T>,
    transfer?: StructuredSerializeOptions | Transferable[],
  ): Promise<
    BetterWorker1Response<T> | BetterWorker1ResponseError<T>
  >;

  <T extends BetterWorker1MessageType>(
    type: T,
    args?: BetterWorker1Request<T>["args"],
  ): Promise<
    BetterWorker1Response<T> | BetterWorker1ResponseError<T>
  >;
};

export type BetterWorker1PromiserLazy = {
  <T extends BetterWorker1MessageType>(
    messageData: BetterWorker1Request<T>,
    transfer?: StructuredSerializeOptions | Transferable[],
  ): AwaitableEffect<
    BetterWorker1Response<T>,
    BetterWorker1ResponseError<T>,
    never
  >;
    
  <T extends BetterWorker1MessageType>(
    type: T,
    args?: BetterWorker1Request<T>["args"],
  ): AwaitableEffect<
    BetterWorker1Response<T>,
    BetterWorker1ResponseError<T>,
    never
  >;
};

