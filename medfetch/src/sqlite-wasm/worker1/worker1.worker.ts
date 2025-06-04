import {
    Worker1MessageType,
    Worker1Request,
    type Sqlite3Static,
} from "@sqlite.org/sqlite-wasm";
import { Sqlite3Module } from "~/sqlite-wasm/worker1/worker1.types";

type RequestHandler<MessageType extends Worker1MessageType> = (
    message: MessageEvent<Worker1Request<MessageType>>,
    next: () => void,
) => void;
interface RequestHandlers {
    onOpen: RequestHandler<"open">;
    onClose: RequestHandler<"close">;
    onConfigGet: RequestHandler<"config-get">;
    onExec: RequestHandler<"exec">;
    onExport: RequestHandler<"export">;
}

export interface Worker1Options {
    hooks?: Partial<RequestHandlers>;
    extensions?: readonly Sqlite3Module[];
};

export function worker1(
    sqlite3: Sqlite3Static,
    before?: Partial<RequestHandlers>,
) {
    sqlite3.initWorker1API();
    const previousHandler = self.onmessage;
    const originalOnMessage = (event: MessageEvent<Worker1Request>): void =>
        previousHandler?.call(self, event);
    self.onmessage = (event: MessageEvent<Worker1Request>) => {
        const next = () => originalOnMessage(event);
        switch (event.data.type) {
            case "open": {
                if (before?.onOpen) {
                    before.onOpen(event as any, next);
                } else {
                    next();
                }
                break;
            }
            case "close": {
                if (before?.onClose) {
                    before.onClose(event as any, next);
                } else {
                    next();
                }
                break;
            }
            case "config-get": {
                if (before?.onConfigGet) {
                    before.onConfigGet(event as any, next);
                } else {
                    next();
                }
                break;
            }
            case "exec": {
                if (before?.onExec) {
                    before.onExec(event as any, next);
                } else {
                    next();
                }
                break;
            }
            case "export": {
                if (before?.onExport) {
                    before.onExport(event as any, next);
                } else {
                    next();
                }
                break;
            }
        }
    };

    return 0;
}
