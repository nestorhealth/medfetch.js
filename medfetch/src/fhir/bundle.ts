import { object, string, infer as zinfer } from "zod/v4";
import { AnyResource } from "~/fhir/base";

const Link = object({
    relation: string(),
    url: string(),
});

const AnyEntry = object({
    resource: AnyResource.optional(),
});

export const AnyBundle = object({
    entry: AnyEntry.array().optional(),
    link: Link.array().optional(),
});
export type AnyBundle = zinfer<typeof AnyBundle>;
