import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
export function getFetchPath() {
    const platform = os.platform();
    const arch = os.arch();
    if (platform === "linux") {
        if (arch === "x64") {
            return path.resolve(__dirname, "..", "bin", "linux-x86", "medfetch");
        }
        throw new Error(`${arch} on linux not supported right now`);
    }
    else if (platform === "darwin") {
        if (arch === "x64") {
            return path.resolve(__dirname, "..", "bin", "mac-x86", "medfetch");
        }
        throw new Error(`${arch} on mac not supported right now`);
    }
    throw new Error(`Couldn't resolve the platform ${platform}`);
}
