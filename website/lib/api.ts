import createClient from "openapi-fetch";
import createReactQueryClient from "openapi-react-query";
import type { paths } from "@medfetch.js/api/types";
import {createAuthClient} from "better-auth/client";

export const api = createClient<paths>({
  baseUrl: process.env.NEXT_PUBLIC_API_URL!,
  credentials: "include"
});

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL!,
  basePath: "/auth",
  fetchOptions: {
    credentials: "include"
  }
})

/**
 * The "typed" react-query client for medfetch-api
 * 
 * @example
 * Mutation
 * ```ts
 * const useCreateWorkspace = $api.useMutation("post", "/workspaces", {
 *   onError: (errorPayload) => {
 *     console.error("Error creating workspace", errorPayload.error);
 *   },
 *   onSuccess: (payload) => {
 *     console.log("Created workspace", payload)
 *   },
 * });
 * 
 * const Form = () => (
 *   <form action={formData => useCreateWorkspace.mutate({
 *     body: {
 *       name: formData.get("workspaceName")
 *     }
 *   })}>
 *   </form>
 * );
 * ```
 * 
 * @example
 * Query
 * ```ts
 * import { $api } from "@/lib/api";
 * export default function WorkspacePage(props: {
 *   id: number;
 * }) {
 *   const workspaceQuery = $api.useQuery("get", `/workspaces/{id}`, {
 *     params: {
 *       path: {
 *         id: props.id
 *      }
 *     }
 *   });
 * 
 *   if (workspaceQuery.isPending) {
 *     return <p>Loading...</p>
 *   }
 * 
 *   if (!workspaceQuery.data) {
 *   return <p>Not found</p>
 *   }
 * 
 *   return (
 *     <main>
 *       <p>Workspace: ${workspaceQuery.data.name}</p>
 *       <p>VFS: ${workspaceQuery.data.vfsType}</p>
 *     </main>
 *   );
 * }
 * ```
 */
export const $api = createReactQueryClient(api);
