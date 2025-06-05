import { looseObject, string, type infer as zinfer } from "zod/v4";

export const AnyResource = looseObject({
    id: string(),
    resourceType: string(),
});
export type AnyResource = zinfer<typeof AnyResource>;
