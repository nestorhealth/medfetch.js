/**
 * Creates ~/medfetch/workspaces/<workspaceName>/meta.json and writes
 *  name, createdAt into it.
 */
export async function saveWorkspaceName(name: string) {
    const root = await (navigator as any).storage.getDirectory() as FileSystemDirectoryHandle;
  
    const medfetch = await root.getDirectoryHandle("medfetch", { create: true });
    const workspaces = await medfetch.getDirectoryHandle("workspaces", { create: true });
    const wsDir = await workspaces.getDirectoryHandle(name, { create: true });
  
    const metaHandle = await wsDir.getFileHandle("meta.json", { create: true });
    const writable = await metaHandle.createWritable();
    await writable.write(
      JSON.stringify({ name, createdAt: Date.now() }, null, 2)
    );
    await writable.close();
  }
  
  export async function listWorkspaceNames(): Promise<{name:string;createdAt:number}[]> {
    const root = await (navigator as any).storage.getDirectory();
    try {
      const workspaces = await root
        .getDirectoryHandle("medfetch")
        .then(d => d.getDirectoryHandle("workspaces"));
  
      const results: { name: string; createdAt: number }[] = [];
      for await (const entry of workspaces.values()) {
        if (entry.kind === "directory") {
          const meta = await entry.getFileHandle("meta.json").then(fh => fh.getFile());
          results.push(JSON.parse(await meta.text()));
        }
      }
      return results;
    } catch {
      return [];
    }
  }
  