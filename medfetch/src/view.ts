import { Data, Schema } from "effect";

import { appendAll, filterMap } from "effect/Array";
import { when, value, orElse, defined } from "effect/Match";
import type { TaggedEnum } from "effect/Data";
import { tagged, taggedEnum } from "effect/Data";

/// ALIAS
const ow = Schema.optionalWith;

export const Where = Schema.Struct({
    path: Schema.String,
    description: ow(Schema.String, { exact: true }),
});
export type Where = Schema.Schema.Type<typeof Where>;

const _Constant = Schema.Struct({
    name: Schema.String,
    valueBase64Binary: ow(Schema.String, { exact: true }),
    valueBoolean: ow(Schema.String, { exact: true }),
    valueCanonical: ow(Schema.String, { exact: true }),
    valueCode: ow(Schema.String, { exact: true }),
    valueDate: ow(Schema.String, { exact: true }),
    valueDateTime: ow(Schema.String, { exact: true }),
    valueDecimal: ow(Schema.String, { exact: true }),
    valueId: ow(Schema.String, { exact: true }),
    valueInstant: ow(Schema.Number, { exact: true }),
    valueInteger: ow(Schema.Number, { exact: true }),
    valueOid: ow(Schema.String, { exact: true }),
    valuePositiveInt: ow(Schema.Number, { exact: true }),
    valueString: ow(Schema.String, { exact: true }),
    valueTime: ow(Schema.String, { exact: true }),
    valueUnsignedInt: ow(Schema.Number, { exact: true }),
    valueUri: ow(Schema.String, { exact: true }),
    valueUrl: ow(Schema.String, { exact: true }),
    valueUuid: ow(Schema.String, { exact: true }),
});
export interface Constant extends Schema.Schema.Type<typeof _Constant> {}
export const Constant: Schema.Schema<Constant> = _Constant;

const _Tag = Schema.Struct({
    name: Schema.String,
    value: Schema.String,
});

export interface Tag extends Schema.Schema.Type<typeof _Tag> {}
export const Tag: Schema.Schema<Tag> = _Tag;
export const isTag = Schema.is(Tag);

const _ColumnPath = Schema.Struct({
    path: Schema.String,
    name: Schema.String,
    description: ow(Schema.String, { exact: true }),
    collection: ow(Schema.Boolean, { exact: true }),
    type: ow(Schema.String, { exact: true }),
    tags: ow(Schema.Array(Tag), { exact: true }),
});

/**
 * The ColumnPath schema that the View
 * layer expects to work with
 *
 * *Optionally* takes in a `TName` string
 * literal to denote the name of the column
 */
export interface ColumnPath<TName extends string = string>
    extends Schema.Schema.Type<typeof _ColumnPath> {
    name: TName;
    type?: string;
}
export const ColumnPath = Data.case<ColumnPath>();


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
const decodeColumnPathOption = Schema.decodeOption(_ColumnPath);
type BaseSelect = {
    readonly column?: readonly ColumnPath[];
    readonly select?: readonly BaseSelect[];
    readonly forEach?: string;
    readonly forEachOrNull?: string;
    readonly unionAll?: readonly BaseSelect[];
};

const SelectJSON = Schema.Struct({
    column: ow(Schema.Array(_ColumnPath), {
        exact: true,
    }),
    select: ow(
        Schema.Array(
            Schema.suspend((): Schema.Schema<BaseSelect> => SelectJSON),
        ),
        { exact: true },
    ),
    forEach: ow(Schema.String, { exact: true }),
    forEachOrNull: ow(Schema.String, { exact: true }),
    unionAll: ow(
        Schema.Array(
            Schema.suspend((): Schema.Schema<BaseSelect> => SelectJSON),
        ),
        { exact: true },
    ),
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

const Node = Schema.Union(
    Schema.TaggedStruct("Column", {
        column: Schema.Array(Schema.typeSchema(_ColumnPath)),
    }),
    Schema.TaggedStruct("Select", {
        select: Schema.Array(Schema.suspend((): Schema.Schema<Node> => Node)),
    }),
    Schema.TaggedStruct("ForEach", {
        forEach: Schema.String,
        select: Schema.Array(Schema.suspend((): Schema.Schema<Node> => Node)),
    }),
    Schema.TaggedStruct("ForEachOrNull", {
        forEachOrNull: Schema.String,
        select: Schema.Array(Schema.suspend((): Schema.Schema<Node> => Node)),
    }),
    Schema.TaggedStruct("UnionAll", {
        unionAll: Schema.Array(Schema.suspend((): Schema.Schema<Node> => Node)),
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
const SelectFromData = Schema.transform(SelectJSON, Node, {
    strict: true,
    encode: ({ _tag, ...rest }) => rest,
    decode: (dataNode) => decodeSelect(dataNode),
});

export const normalize = Schema.decodeSync(SelectFromData);

const _ViewDefinition = Schema.TaggedStruct("Select", {
    status: Schema.Literal("draft", "active", "retired", "unknown"),
    url: ow(Schema.String, { exact: true }),
    name: ow(Schema.String, { exact: true }),
    title: ow(Schema.String, { exact: true }),
    experimental: ow(Schema.Boolean, { exact: true }),
    publisher: ow(Schema.String, { exact: true }),
    description: ow(Schema.String, { exact: true }),
    copyright: ow(Schema.String, { exact: true }),
    resource: Schema.String,
    constant: ow(Schema.Array(Constant), {
        exact: true,
    }),
    where: ow(Schema.Array(Where), { exact: true }),
    select: Schema.NonEmptyArray(Node),
});

export interface ViewDefinition<ResourceType extends string = string>
    extends Schema.Schema.Type<typeof _ViewDefinition> {
    resource: ResourceType;
}
export const ViewDefinition = tagged<ViewDefinition>("Select");

export function getColumns(
    vd: ViewDefinition,
    f: (columnPath: ColumnPath) => boolean = (_columnPath) => true,
) {
    const aux = (acc: ColumnPath[], node: Node): ColumnPath[] => {
        return $match(node, {
            ForEach: ({ select }) => select.flatMap((selectNode) => aux(acc, selectNode)),
            ForEachOrNull: ({ select }) => select.flatMap((selectNode) => aux(acc, selectNode)),
            Select: ({ select }) => select.flatMap((selectNode) => aux(acc, selectNode)),
            UnionAll: ({ unionAll }) => unionAll.flatMap((selectNode) => aux(acc, selectNode)),
            Column: ({ column }) => appendAll(acc, column)
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
