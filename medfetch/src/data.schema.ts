import { ParseResult, Schema } from "effect";

/**
 * You could be in the olympics with this level of gymnastics!!
 */
export type Resource<
  ResourceType extends string = string,
  Shape extends Record<string, any> = {},
  Required extends readonly (keyof Shape)[] = []
> =
  {
    id: string;
    resourceType: ResourceType;
  } & (
    {
      [K in keyof Shape as K extends string ? K : never]:
        K extends Required[number]
          ? Schema.Schema.Type<Schema.Schema<NonNullable<Shape[K]>>>
          : Schema.Schema.Type<Schema.Schema<Shape[K]>>
    } extends infer Fields
      ? {
          [K in keyof Fields as K extends Required[number] ? K : never]-?: Fields[K];
        } & {
          [K in keyof Fields as K extends Required[number] ? never : K]+?: Fields[K];
        }
      : never
  );

const Base = Schema.Struct(
    {
        id: Schema.String,
        resourceType: Schema.String,
    },
    { key: Schema.String, value: Schema.Any },
);
type Base = typeof Base.Type;

export function Resource(): Schema.Schema<{
    readonly id: string;
    readonly resourceType: string;
}>;
export function Resource<
    const ResourceType extends string,
    const Shape extends Record<string, Schema.Struct.Field>,
>(
    resourceType: ResourceType,
    shape?: Shape,
): Schema.Schema<
    {
        readonly id: string;
        readonly resourceType: ResourceType;
    } & Schema.Schema.Type<Schema.Struct<Shape>>,
    {
        readonly id: string;
        readonly resourceType: ResourceType;
    } & Schema.Schema.Encoded<Schema.Struct<Shape>>
>;
export function Resource<
    const ResourceType extends string,
    const Shape extends Record<string, Schema.Struct.Field>,
>(resourceType?: ResourceType, shape?: Shape) {
    if (!resourceType) return Base;

    const fullShape = {
        id: Schema.String,
        resourceType: Schema.tag(resourceType),
        ...shape,
    };

    const struct = Schema.Struct(fullShape);

    return Schema.declare(
        [struct],
        {
            decode: (s) => (input, options, _ast) => {
                return ParseResult.decodeUnknown(s)(input, options);
            },
            encode: (s) => (input, options, _ast) => {
                return ParseResult.encodeUnknown(s)(input, options);
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
    resource: Schema.Schema<Resource<ResourceType, Shape>>,
): Schema.Schema<
    Entry<Schema.Schema.Type<typeof resource>>,
    Entry<Schema.Schema.Encoded<typeof resource>>
> {
    return Schema.Struct({
        link: Schema.String.pipe(
            Schema.Array,
            Schema.optionalWith({ exact: true }),
        ),
        fullUrl: Schema.String.pipe(Schema.optionalWith({ exact: true })),
        resource: resource.pipe(Schema.optionalWith({ exact: true })),
    });
}

const _Link = Schema.Struct({
    relation: Schema.String,
    url: Schema.String,
});
type _Link = typeof _Link.Type;

export interface Link extends Schema.Schema.Type<typeof _Link> {}
export const Link: Schema.Schema<Link> = _Link;

