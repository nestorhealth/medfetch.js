import { appendAll, filterMap } from "effect/Array";
import { when, value, orElse, defined } from "effect/Match";
import {
    Array as $Array,
    Boolean,
    Schema,
    Struct,
    String,
    Number,
    Union,
    is,
    decodeOption,
    suspend,
    optionalWith,
    TaggedStruct,
    typeSchema,
    transform,
    decodeSync,
    Literal,
    NonEmptyArray,
} from "effect/Schema";
import type { TaggedEnum } from "effect/Data";
import { tagged, taggedEnum, case as createCase } from "effect/Data";

/// ALIAS
const ow = optionalWith;

export const Where = Struct({
    path: String,
    description: ow(String, { exact: true }),
});
export type Where = Schema.Type<typeof Where>;

const _Constant = Struct({
    name: String,
    valueBase64Binary: ow(String, { exact: true }),
    valueBoolean: ow(String, { exact: true }),
    valueCanonical: ow(String, { exact: true }),
    valueCode: ow(String, { exact: true }),
    valueDate: ow(String, { exact: true }),
    valueDateTime: ow(String, { exact: true }),
    valueDecimal: ow(String, { exact: true }),
    valueId: ow(String, { exact: true }),
    valueInstant: ow(Number, { exact: true }),
    valueInteger: ow(Number, { exact: true }),
    valueOid: ow(String, { exact: true }),
    valuePositiveInt: ow(Number, { exact: true }),
    valueString: ow(String, { exact: true }),
    valueTime: ow(String, { exact: true }),
    valueUnsignedInt: ow(Number, { exact: true }),
    valueUri: ow(String, { exact: true }),
    valueUrl: ow(String, { exact: true }),
    valueUuid: ow(String, { exact: true }),
});
export interface Constant extends Schema.Type<typeof _Constant> {}
export const Constant: Schema<Constant> = _Constant;

const _Tag = Struct({
    name: String,
    value: String,
});

export interface Tag extends Schema.Type<typeof _Tag> {}
export const Tag: Schema<Tag> = _Tag;
export const isTag = is(Tag);

const _ColumnPath = Struct({
    path: String,
    name: String,
    description: ow(String, { exact: true }),
    collection: ow(Boolean, { exact: true }),
    type: ow(String, { exact: true }),
    tags: ow($Array(Tag), { exact: true }),
});

/**
 * The ColumnPath schema that the View
 * layer expects to work with
 *
 * *Optionally* takes in a `TName` string
 * literal to denote the name of the column
 */
export interface ColumnPath<TName extends string = string>
    extends Schema.Type<typeof _ColumnPath> {
    name: TName;
    type?: string;
}
export const ColumnPath = createCase<ColumnPath>();

/**
 * "Typesafe" `ColumnPath` constructor function that binds
 * `ColumnPath.name` and `ColumnPath.type` to the string literals
 * you type in. So really it's just a Generic wrapper over the identity function.
 *
 * JS runtime type is just a plain `ColumnPath` object, so `name` and `type`
 * are just strings in the end. This function just saves you from manually
 * having to write the type for any assignment of type `ColumnPath`
 * @param input - the column path
 * @returns input args
 */
const decodeColumnPathOption = decodeOption(_ColumnPath);
type BaseSelect = {
    readonly column?: readonly ColumnPath[];
    readonly select?: readonly BaseSelect[];
    readonly forEach?: string;
    readonly forEachOrNull?: string;
    readonly unionAll?: readonly BaseSelect[];
};

const SelectJSON = Struct({
    column: ow($Array(_ColumnPath), {
        exact: true,
    }),
    select: ow($Array(suspend((): Schema<BaseSelect> => SelectJSON)), {
        exact: true,
    }),
    forEach: ow(String, { exact: true }),
    forEachOrNull: ow(String, { exact: true }),
    unionAll: ow($Array(suspend((): Schema<BaseSelect> => SelectJSON)), {
        exact: true,
    }),
});
type SelectJSON = typeof SelectJSON.Type;

export type Node = TaggedEnum<{
    Column: {
        column: ReadonlyArray<ColumnPath>;
    };
    Select: {
        select: ReadonlyArray<Node>;
    };
    ForEach: {
        forEach: string;
        select: ReadonlyArray<Node>;
    };
    ForEachOrNull: {
        forEachOrNull: string;
        select: ReadonlyArray<Node>;
    };
    UnionAll: {
        unionAll: ReadonlyArray<Node>;
    };
}>;

export const { Select, Column, ForEach, ForEachOrNull, UnionAll, $match } =
    taggedEnum<Node>();

/**
 * Discriminated union schema for a View Definition 'node'.
 */
const Node = Union(
    TaggedStruct("Column", {
        column: $Array(typeSchema(_ColumnPath)),
    }),
    TaggedStruct("Select", {
        select: $Array(suspend((): Schema<Node> => Node)),
    }),
    TaggedStruct("ForEach", {
        forEach: String,
        select: $Array(suspend((): Schema<Node> => Node)),
    }),
    TaggedStruct("ForEachOrNull", {
        forEachOrNull: String,
        select: $Array(suspend((): Schema<Node> => Node)),
    }),
    TaggedStruct("UnionAll", {
        unionAll: $Array(suspend((): Schema<Node> => Node)),
    }),
);

/**
 * `decodeSelect(nd)` is the normalized select node uses the logic from the sql-on-fhir-v2 reference implementation
 * but returns a COPY of the SelectNode rather than mutating it in place.
 * (If it's too slow then I'll just mutate...)
 * @param nd - The incoming Select node from the JSON
 * @returns the normalized SelectNode
 */
export function decodeSelect(nd: SelectJSON): Node {
    return value(nd).pipe(
        when(
            {
                forEach: defined,
                forEachOrNull: defined,
            },
            () => {
                throw new TypeError(
                    `Invalid SELECT node. Cannot have both a forEach and a forEachOrNull at the same level. Bad node is: ${JSON.stringify(nd, null, 2)}`,
                );
            },
        ),

        when(
            {
                forEach: defined,
            },
            ({ forEach, select = [], unionAll, column }) => {
                return ForEach({
                    forEach,
                    select: [
                        ...(unionAll
                            ? [
                                  UnionAll({
                                      unionAll: unionAll.map((nd) =>
                                          decodeSelect(nd),
                                      ),
                                  }),
                              ]
                            : []),
                        ...(column
                            ? [
                                  Column({
                                      column: filterMap(column, (columnPath) =>
                                          decodeColumnPathOption(columnPath),
                                      ),
                                  }),
                              ]
                            : []),
                        ...select.map(decodeSelect),
                    ],
                });
            },
        ),

        when(
            {
                forEachOrNull: defined,
            },
            ({ forEachOrNull, select = [], unionAll, column }) => {
                return ForEachOrNull({
                    forEachOrNull,
                    select: [
                        ...(unionAll
                            ? [
                                  UnionAll({
                                      unionAll: unionAll.map((nd) =>
                                          decodeSelect(nd),
                                      ),
                                  }),
                              ]
                            : []),
                        ...(column
                            ? [
                                  Column({
                                      column: filterMap(column, (columnPath) =>
                                          decodeColumnPathOption(columnPath),
                                      ),
                                  }),
                              ]
                            : []),
                        ...select.map(decodeSelect),
                    ],
                });
            },
        ),

        when(
            {
                column: Array.isArray,
                select: Array.isArray,
                unionAll: Array.isArray,
            },
            ({ column = [], select = [], unionAll = [] }) => {
                return Select({
                    select: [
                        UnionAll({
                            unionAll: unionAll.map(decodeSelect),
                        }),
                        Column({
                            column: filterMap(column, (columnPath) =>
                                decodeColumnPathOption(columnPath),
                            ),
                        }),
                        ...select.map(decodeSelect),
                    ],
                });
            },
        ),

        when(
            {
                unionAll: Array.isArray,
                select: Array.isArray,
            },
            ({ unionAll = [], select = [] }) => {
                return Select({
                    select: [
                        UnionAll({
                            unionAll: unionAll.map(decodeSelect),
                        }),
                        ...select.map(decodeSelect),
                    ],
                });
            },
        ),

        when(
            {
                select: Array.isArray,
                column: Array.isArray,
            },
            ({ select = [], column = [] }) => {
                return Select({
                    select: [
                        Column({
                            column: filterMap(column, (columnPath) =>
                                decodeColumnPathOption(columnPath),
                            ),
                        }),
                        ...select.map(decodeSelect),
                    ],
                });
            },
        ),

        when(
            {
                column: Array.isArray,
                unionAll: Array.isArray,
            },
            ({ column = [], unionAll = [], select = [] }) => {
                return Select({
                    select: [
                        Column({
                            column: filterMap(column, (columnPath) =>
                                decodeColumnPathOption(columnPath),
                            ),
                        }),
                        UnionAll({
                            unionAll: unionAll.map(decodeSelect),
                        }),
                        ...select.map(decodeSelect),
                    ],
                });
            },
        ),

        when(
            {
                select: Array.isArray,
            },
            ({ select = [] }) => {
                return Select({
                    select: select.map(decodeSelect),
                });
            },
        ),

        orElse((nd) => {
            if (nd.unionAll) {
                return UnionAll({
                    unionAll: nd.unionAll.map(decodeSelect),
                });
            } else if (nd.column) {
                return Column({
                    column: filterMap(nd.column, (column) =>
                        decodeColumnPathOption(column),
                    ),
                });
            } else if (nd.forEach) {
                return ForEach({
                    forEach: nd.forEach,
                    select: nd.select?.map(decodeSelect) ?? [],
                });
            } else if (nd.forEachOrNull) {
                return ForEachOrNull({
                    forEachOrNull: nd.forEachOrNull,
                    select: nd.select?.map(decodeSelect) ?? [],
                });
            } else if (nd.select) {
                return Select({
                    select: nd.select.map(decodeSelect),
                });
            }
            return Select({
                select: [],
            });
        }),
    );
}
const SelectFromData = transform(SelectJSON, Node, {
    strict: true,
    encode: ({ _tag, ...rest }) => rest,
    decode: (dataNode) => decodeSelect(dataNode),
});

export const normalize = decodeSync(SelectFromData);

const _ViewDefinition = TaggedStruct("Select", {
    status: Literal("draft", "active", "retired", "unknown"),
    url: ow(String, { exact: true }),
    name: ow(String, { exact: true }),
    title: ow(String, { exact: true }),
    experimental: ow(Boolean, { exact: true }),
    publisher: ow(String, { exact: true }),
    description: ow(String, { exact: true }),
    copyright: ow(String, { exact: true }),
    resource: String,
    constant: ow($Array(Constant), {
        exact: true,
    }),
    where: ow($Array(Where), { exact: true }),
    select: NonEmptyArray(Node),
});

export interface ViewDefinition<ResourceType extends string = string>
    extends Schema.Type<typeof _ViewDefinition> {
    resource: ResourceType;
}
export const ViewDefinition = tagged<ViewDefinition>("Select");

export function getColumns(
    vd: ViewDefinition,
    f: (columnPath: ColumnPath) => boolean = (_columnPath) => true,
) {
    const aux = (acc: ColumnPath[], node: Node): ColumnPath[] => {
        return $match(node, {
            ForEach: ({ select }) =>
                select.flatMap((selectNode) => aux(acc, selectNode)),
            ForEachOrNull: ({ select }) =>
                select.flatMap((selectNode) => aux(acc, selectNode)),
            Select: ({ select }) =>
                select.flatMap((selectNode) => aux(acc, selectNode)),
            UnionAll: ({ unionAll }) =>
                unionAll.flatMap((selectNode) => aux(acc, selectNode)),
            Column: ({ column }) => appendAll(acc, column),
        });
    };

    const collected = aux([], vd);
    const filtered = collected.filter(f);
    return filtered;
}

export type Select = ReturnType<typeof Select>;
export type Column = ReturnType<typeof Column>;
export type ForEach = ReturnType<typeof ForEach>;
export type ForEachOrNull = ReturnType<typeof ForEachOrNull>;
export type UnionAll = ReturnType<typeof UnionAll>;
