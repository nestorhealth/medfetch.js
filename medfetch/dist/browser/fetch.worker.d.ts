export interface FetchMessageInit {
    type: "init";
}
export interface FetchMessageRequest {
    type: "request";
    sharedSignal: SharedArrayBuffer;
    url: string;
    init?: RequestInit;
}
