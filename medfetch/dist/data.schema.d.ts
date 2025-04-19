import { Schema } from "effect";
export type Resource<ResourceType extends string = string, Shape extends Record<string, any> = {}> = {
    id: string;
    resourceType: ResourceType;
} & {
    [K in keyof Shape]: Shape[K];
};
export declare function Resource(): Schema.Schema<{
    readonly id: string;
    readonly resourceType: string;
}>;
export declare function Resource<const ResourceType extends string, const Shape extends Record<string, Schema.Struct.Field>>(resourceType: ResourceType, shape?: Shape): Schema.Schema<{
    readonly id: string;
    readonly resourceType: ResourceType;
} & Schema.Schema.Type<Schema.Struct<Shape>>, {
    readonly id: string;
    readonly resourceType: ResourceType;
} & Schema.Schema.Encoded<Schema.Struct<Shape>>>;
export type Entry<Payload extends Resource = Resource> = {
    link?: readonly string[];
    fullUrl?: string;
    resource?: Payload;
};
export declare function Entry<ResourceType extends string, Shape extends Record<string, any> = {}>(resource: Schema.Schema<Resource<ResourceType, Shape>>): Schema.Schema<Entry<Schema.Schema.Type<typeof resource>>, Entry<Schema.Schema.Encoded<typeof resource>>>;
declare const _Link: Schema.Struct<{
    relation: typeof Schema.String;
    url: typeof Schema.String;
}>;
type _Link = typeof _Link.Type;
export interface Link extends Schema.Schema.Type<typeof _Link> {
}
export declare const Link: Schema.Schema<Link>;
export {};
