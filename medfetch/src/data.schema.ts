import { Any, Array as $Array, Struct, String, type Schema, tag, declare, optionalWith } from "effect/Schema";
import { decodeUnknown, encodeUnknown } from "effect/ParseResult";

/**
 * The bare minimum schema for a Resource
 * @param id The surrogate key for the Resource
 * @param resourceType The type of the Resource
 */
const Base = Struct(
    {
        id: String,
        resourceType: String,
    },
    { key: String, value: Any },
);
type Base = typeof Base.Type;

/**
 * FHIR Resource generic builder
 * @template ResourceType The allowed values for `resourceType`
 * @template Shape The "rest" of the object shape
 */
export type Resource<
    ResourceType extends string = string,
    Shape extends Record<string, any> = {},
> = {
    id: string;
    resourceType: ResourceType;
} & {
    [K in keyof Shape]: Shape[K];
};

export function Resource(): Schema<{
    readonly id: string;
    readonly resourceType: string;
}>;
export function Resource<
    const ResourceType extends string,
    const Shape extends Record<string, Struct.Field>,
>(
    resourceType: ResourceType,
    shape?: Shape,
): Schema<
    {
        readonly id: string;
        readonly resourceType: ResourceType;
    } & Schema.Type<Struct<Shape>>,
    {
        readonly id: string;
        readonly resourceType: ResourceType;
    } & Schema.Encoded<Struct<Shape>>
>;
export function Resource<
    const ResourceType extends string,
    const Shape extends Record<string, Struct.Field>,
>(resourceType?: ResourceType, shape?: Shape) {
    if (!resourceType) return Base;

    const fullShape = {
        id: String,
        resourceType: tag(resourceType),
        ...shape,
    };

    const struct = Struct(fullShape);

    return declare(
        [struct],
        {
            decode: (s) => (input, options, _ast) => {
                return decodeUnknown(s)(input, options);
            },
            encode: (s) => (input, options, _ast) => {
                return encodeUnknown(s)(input, options);
            },
        },
        {
            description: `Resource<${resourceType}>`,
        },
    );
}

export type Entry<Payload extends Resource = Resource> = {
    link?: readonly string[];
    fullUrl?: string;
    resource?: Payload;
};

export function Entry<
    ResourceType extends string,
    Shape extends Record<string, any> = {},
>(
    resource: Schema<Resource<ResourceType, Shape>>,
): Schema<
    Entry<Schema.Type<typeof resource>>,
    Entry<Schema.Encoded<typeof resource>>
> {
    return Struct({
        link: String.pipe(
            $Array,
            optionalWith({ exact: true }),
        ),
        fullUrl: String.pipe(optionalWith({ exact: true })),
        resource: resource.pipe(optionalWith({ exact: true })),
    });
}

const _Link = Struct({
    relation: String,
    url: String,
});
type _Link = typeof _Link.Type;

export interface Link extends Schema.Type<typeof _Link> {}
export const Link: Schema<Link> = _Link;
