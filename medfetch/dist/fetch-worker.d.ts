export interface FetchCallRequest {
    sharedSignal: SharedArrayBuffer;
    url: string;
    init?: RequestInit;
}
