import { object, string, type infer as zinfer } from "zod/v4";

export const AnyResource = object({
    id: string(),
    resourceType: string()
});
export type AnyResource = zinfer<typeof AnyResource>;