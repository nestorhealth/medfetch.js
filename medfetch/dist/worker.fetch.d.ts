export interface FetchMessageInit {
    type: "init";
}
export interface FetchMessageRequest {
    type: "request";
    sharedSignal: SharedArrayBuffer;
    url: string;
    init?: RequestInit;
}
declare const Fetch_base: new <A extends Record<string, any> = {}>(args: import("effect/Types").Equals<A, {}> extends true ? void : { readonly [P in keyof A as P extends "_tag" ? never : P]: A[P]; }) => Readonly<A> & {
    readonly _tag: "medfetch.worker.fetch";
};
/**
 */
export declare class Fetch extends Fetch_base<{
    readonly port: MessagePort;
}> {
    constructor(port: MessagePort);
}
export {};
