import { Schema } from "effect";
import type { TaggedEnum } from "effect/Data";
export declare const Where: Schema.Struct<{
    path: typeof Schema.String;
    description: Schema.optionalWith<typeof Schema.String, {
        exact: true;
    }>;
}>;
export type Where = Schema.Schema.Type<typeof Where>;
declare const _Constant: Schema.Struct<{
    name: typeof Schema.String;
    valueBase64Binary: Schema.optionalWith<typeof Schema.String, {
        exact: true;
    }>;
    valueBoolean: Schema.optionalWith<typeof Schema.String, {
        exact: true;
    }>;
    valueCanonical: Schema.optionalWith<typeof Schema.String, {
        exact: true;
    }>;
    valueCode: Schema.optionalWith<typeof Schema.String, {
        exact: true;
    }>;
    valueDate: Schema.optionalWith<typeof Schema.String, {
        exact: true;
    }>;
    valueDateTime: Schema.optionalWith<typeof Schema.String, {
        exact: true;
    }>;
    valueDecimal: Schema.optionalWith<typeof Schema.String, {
        exact: true;
    }>;
    valueId: Schema.optionalWith<typeof Schema.String, {
        exact: true;
    }>;
    valueInstant: Schema.optionalWith<typeof Schema.Number, {
        exact: true;
    }>;
    valueInteger: Schema.optionalWith<typeof Schema.Number, {
        exact: true;
    }>;
    valueOid: Schema.optionalWith<typeof Schema.String, {
        exact: true;
    }>;
    valuePositiveInt: Schema.optionalWith<typeof Schema.Number, {
        exact: true;
    }>;
    valueString: Schema.optionalWith<typeof Schema.String, {
        exact: true;
    }>;
    valueTime: Schema.optionalWith<typeof Schema.String, {
        exact: true;
    }>;
    valueUnsignedInt: Schema.optionalWith<typeof Schema.Number, {
        exact: true;
    }>;
    valueUri: Schema.optionalWith<typeof Schema.String, {
        exact: true;
    }>;
    valueUrl: Schema.optionalWith<typeof Schema.String, {
        exact: true;
    }>;
    valueUuid: Schema.optionalWith<typeof Schema.String, {
        exact: true;
    }>;
}>;
export interface Constant extends Schema.Schema.Type<typeof _Constant> {
}
export declare const Constant: Schema.Schema<Constant>;
declare const _Tag: Schema.Struct<{
    name: typeof Schema.String;
    value: typeof Schema.String;
}>;
export interface Tag extends Schema.Schema.Type<typeof _Tag> {
}
export declare const Tag: Schema.Schema<Tag>;
export declare const isTag: (u: unknown, overrideOptions?: import("effect/SchemaAST").ParseOptions | number) => u is Tag;
declare const _ColumnPath: Schema.Struct<{
    path: typeof Schema.String;
    name: typeof Schema.String;
    description: Schema.optionalWith<typeof Schema.String, {
        exact: true;
    }>;
    collection: Schema.optionalWith<typeof Schema.Boolean, {
        exact: true;
    }>;
    type: Schema.optionalWith<typeof Schema.String, {
        exact: true;
    }>;
    tags: Schema.optionalWith<Schema.Array$<Schema.Schema<Tag, Tag, never>>, {
        exact: true;
    }>;
}>;
/**
 * The ColumnPath schema that the View
 * layer expects to work with
 *
 * *Optionally* takes in a `TName` string
 * literal to denote the name of the column
 */
export interface ColumnPath<TName extends string = string> extends Schema.Schema.Type<typeof _ColumnPath> {
    name: TName;
    type?: string;
}
export declare const ColumnPath: Schema.Schema<ColumnPath>;
export declare const columnPath: (...args: Parameters<typeof _ColumnPath.make>) => ColumnPath;
type BaseSelect = {
    readonly column?: readonly ColumnPath[];
    readonly select?: readonly BaseSelect[];
    readonly forEach?: string;
    readonly forEachOrNull?: string;
    readonly unionAll?: readonly BaseSelect[];
};
declare const SelectJSON: Schema.Struct<{
    column: Schema.optionalWith<Schema.Array$<Schema.Schema<ColumnPath<string>, ColumnPath<string>, never>>, {
        exact: true;
    }>;
    select: Schema.optionalWith<Schema.Array$<Schema.suspend<BaseSelect, BaseSelect, never>>, {
        exact: true;
    }>;
    forEach: Schema.optionalWith<typeof Schema.String, {
        exact: true;
    }>;
    forEachOrNull: Schema.optionalWith<typeof Schema.String, {
        exact: true;
    }>;
    unionAll: Schema.optionalWith<Schema.Array$<Schema.suspend<BaseSelect, BaseSelect, never>>, {
        exact: true;
    }>;
}>;
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
export declare const Select: import("effect/Data").Case.Constructor<{
    readonly _tag: "Select";
    readonly select: ReadonlyArray<Node>;
}, "_tag">, Column: import("effect/Data").Case.Constructor<{
    readonly _tag: "Column";
    readonly column: ReadonlyArray<ColumnPath>;
}, "_tag">, ForEach: import("effect/Data").Case.Constructor<{
    readonly _tag: "ForEach";
    readonly forEach: string;
    readonly select: ReadonlyArray<Node>;
}, "_tag">, ForEachOrNull: import("effect/Data").Case.Constructor<{
    readonly _tag: "ForEachOrNull";
    readonly forEachOrNull: string;
    readonly select: ReadonlyArray<Node>;
}, "_tag">, UnionAll: import("effect/Data").Case.Constructor<{
    readonly _tag: "UnionAll";
    readonly unionAll: ReadonlyArray<Node>;
}, "_tag">, $match: {
    <Cases extends {
        readonly Column: (args: {
            readonly _tag: "Column";
            readonly column: ReadonlyArray<ColumnPath>;
        }) => any;
        readonly Select: (args: {
            readonly _tag: "Select";
            readonly select: ReadonlyArray<Node>;
        }) => any;
        readonly ForEach: (args: {
            readonly _tag: "ForEach";
            readonly forEach: string;
            readonly select: ReadonlyArray<Node>;
        }) => any;
        readonly ForEachOrNull: (args: {
            readonly _tag: "ForEachOrNull";
            readonly forEachOrNull: string;
            readonly select: ReadonlyArray<Node>;
        }) => any;
        readonly UnionAll: (args: {
            readonly _tag: "UnionAll";
            readonly unionAll: ReadonlyArray<Node>;
        }) => any;
    }>(cases: Cases): (value: {
        readonly _tag: "Column";
        readonly column: ReadonlyArray<ColumnPath>;
    } | {
        readonly _tag: "Select";
        readonly select: ReadonlyArray<Node>;
    } | {
        readonly _tag: "ForEach";
        readonly forEach: string;
        readonly select: ReadonlyArray<Node>;
    } | {
        readonly _tag: "ForEachOrNull";
        readonly forEachOrNull: string;
        readonly select: ReadonlyArray<Node>;
    } | {
        readonly _tag: "UnionAll";
        readonly unionAll: ReadonlyArray<Node>;
    }) => import("effect/Unify").Unify<ReturnType<Cases["Column" | "Select" | "ForEach" | "ForEachOrNull" | "UnionAll"]>>;
    <Cases extends {
        readonly Column: (args: {
            readonly _tag: "Column";
            readonly column: ReadonlyArray<ColumnPath>;
        }) => any;
        readonly Select: (args: {
            readonly _tag: "Select";
            readonly select: ReadonlyArray<Node>;
        }) => any;
        readonly ForEach: (args: {
            readonly _tag: "ForEach";
            readonly forEach: string;
            readonly select: ReadonlyArray<Node>;
        }) => any;
        readonly ForEachOrNull: (args: {
            readonly _tag: "ForEachOrNull";
            readonly forEachOrNull: string;
            readonly select: ReadonlyArray<Node>;
        }) => any;
        readonly UnionAll: (args: {
            readonly _tag: "UnionAll";
            readonly unionAll: ReadonlyArray<Node>;
        }) => any;
    }>(value: {
        readonly _tag: "Column";
        readonly column: ReadonlyArray<ColumnPath>;
    } | {
        readonly _tag: "Select";
        readonly select: ReadonlyArray<Node>;
    } | {
        readonly _tag: "ForEach";
        readonly forEach: string;
        readonly select: ReadonlyArray<Node>;
    } | {
        readonly _tag: "ForEachOrNull";
        readonly forEachOrNull: string;
        readonly select: ReadonlyArray<Node>;
    } | {
        readonly _tag: "UnionAll";
        readonly unionAll: ReadonlyArray<Node>;
    }, cases: Cases): import("effect/Unify").Unify<ReturnType<Cases["Column" | "Select" | "ForEach" | "ForEachOrNull" | "UnionAll"]>>;
};
/**
 * [[ decodeSelect nd ]] is the normalized select node
 * which uses the logic from the sql-on-fhir-v2 reference implementation
 * but returns a COPY of the SelectNode rather than mutating it in place.
 * (If it's too slow then I'll just make it imperative... lmao)
 * @param nd - The incoming Select node from the JSON
 * @returns the normalized SelectNode
 */
export declare function decodeSelect(nd: SelectJSON): Node;
export declare const normalize: (i: {
    readonly forEach?: string | undefined;
    readonly column?: readonly ColumnPath<string>[] | undefined;
    readonly select?: readonly BaseSelect[] | undefined;
    readonly forEachOrNull?: string | undefined;
    readonly unionAll?: readonly BaseSelect[] | undefined;
}, overrideOptions?: import("effect/SchemaAST").ParseOptions) => {
    readonly _tag: "Column";
    readonly column: readonly ColumnPath<string>[];
} | {
    readonly _tag: "Select";
    readonly select: readonly ({
        readonly _tag: "Column";
        readonly column: ReadonlyArray<ColumnPath>;
    } | {
        readonly _tag: "Select";
        readonly select: ReadonlyArray<Node>;
    } | {
        readonly _tag: "ForEach";
        readonly forEach: string;
        readonly select: ReadonlyArray<Node>;
    } | {
        readonly _tag: "ForEachOrNull";
        readonly forEachOrNull: string;
        readonly select: ReadonlyArray<Node>;
    } | {
        readonly _tag: "UnionAll";
        readonly unionAll: ReadonlyArray<Node>;
    })[];
} | {
    readonly _tag: "ForEach";
    readonly forEach: string;
    readonly select: readonly ({
        readonly _tag: "Column";
        readonly column: ReadonlyArray<ColumnPath>;
    } | {
        readonly _tag: "Select";
        readonly select: ReadonlyArray<Node>;
    } | {
        readonly _tag: "ForEach";
        readonly forEach: string;
        readonly select: ReadonlyArray<Node>;
    } | {
        readonly _tag: "ForEachOrNull";
        readonly forEachOrNull: string;
        readonly select: ReadonlyArray<Node>;
    } | {
        readonly _tag: "UnionAll";
        readonly unionAll: ReadonlyArray<Node>;
    })[];
} | {
    readonly _tag: "ForEachOrNull";
    readonly select: readonly ({
        readonly _tag: "Column";
        readonly column: ReadonlyArray<ColumnPath>;
    } | {
        readonly _tag: "Select";
        readonly select: ReadonlyArray<Node>;
    } | {
        readonly _tag: "ForEach";
        readonly forEach: string;
        readonly select: ReadonlyArray<Node>;
    } | {
        readonly _tag: "ForEachOrNull";
        readonly forEachOrNull: string;
        readonly select: ReadonlyArray<Node>;
    } | {
        readonly _tag: "UnionAll";
        readonly unionAll: ReadonlyArray<Node>;
    })[];
    readonly forEachOrNull: string;
} | {
    readonly _tag: "UnionAll";
    readonly unionAll: readonly ({
        readonly _tag: "Column";
        readonly column: ReadonlyArray<ColumnPath>;
    } | {
        readonly _tag: "Select";
        readonly select: ReadonlyArray<Node>;
    } | {
        readonly _tag: "ForEach";
        readonly forEach: string;
        readonly select: ReadonlyArray<Node>;
    } | {
        readonly _tag: "ForEachOrNull";
        readonly forEachOrNull: string;
        readonly select: ReadonlyArray<Node>;
    } | {
        readonly _tag: "UnionAll";
        readonly unionAll: ReadonlyArray<Node>;
    })[];
};
declare const _ViewDefinition: Schema.TaggedStruct<"Select", {
    status: Schema.Literal<["draft", "active", "retired", "unknown"]>;
    url: Schema.optionalWith<typeof Schema.String, {
        exact: true;
    }>;
    name: Schema.optionalWith<typeof Schema.String, {
        exact: true;
    }>;
    title: Schema.optionalWith<typeof Schema.String, {
        exact: true;
    }>;
    experimental: Schema.optionalWith<typeof Schema.Boolean, {
        exact: true;
    }>;
    publisher: Schema.optionalWith<typeof Schema.String, {
        exact: true;
    }>;
    description: Schema.optionalWith<typeof Schema.String, {
        exact: true;
    }>;
    copyright: Schema.optionalWith<typeof Schema.String, {
        exact: true;
    }>;
    resource: typeof Schema.String;
    constant: Schema.optionalWith<Schema.Array$<Schema.Schema<Constant, Constant, never>>, {
        exact: true;
    }>;
    where: Schema.optionalWith<Schema.Array$<Schema.Struct<{
        path: typeof Schema.String;
        description: Schema.optionalWith<typeof Schema.String, {
            exact: true;
        }>;
    }>>, {
        exact: true;
    }>;
    select: Schema.NonEmptyArray<Schema.Union<[Schema.TaggedStruct<"Column", {
        column: Schema.Array$<Schema.SchemaClass<ColumnPath<string>, ColumnPath<string>, never>>;
    }>, Schema.TaggedStruct<"Select", {
        select: Schema.Array$<Schema.suspend<{
            readonly _tag: "Column";
            readonly column: ReadonlyArray<ColumnPath>;
        } | {
            readonly _tag: "Select";
            readonly select: ReadonlyArray<Node>;
        } | {
            readonly _tag: "ForEach";
            readonly forEach: string;
            readonly select: ReadonlyArray<Node>;
        } | {
            readonly _tag: "ForEachOrNull";
            readonly forEachOrNull: string;
            readonly select: ReadonlyArray<Node>;
        } | {
            readonly _tag: "UnionAll";
            readonly unionAll: ReadonlyArray<Node>;
        }, {
            readonly _tag: "Column";
            readonly column: ReadonlyArray<ColumnPath>;
        } | {
            readonly _tag: "Select";
            readonly select: ReadonlyArray<Node>;
        } | {
            readonly _tag: "ForEach";
            readonly forEach: string;
            readonly select: ReadonlyArray<Node>;
        } | {
            readonly _tag: "ForEachOrNull";
            readonly forEachOrNull: string;
            readonly select: ReadonlyArray<Node>;
        } | {
            readonly _tag: "UnionAll";
            readonly unionAll: ReadonlyArray<Node>;
        }, never>>;
    }>, Schema.TaggedStruct<"ForEach", {
        forEach: typeof Schema.String;
        select: Schema.Array$<Schema.suspend<{
            readonly _tag: "Column";
            readonly column: ReadonlyArray<ColumnPath>;
        } | {
            readonly _tag: "Select";
            readonly select: ReadonlyArray<Node>;
        } | {
            readonly _tag: "ForEach";
            readonly forEach: string;
            readonly select: ReadonlyArray<Node>;
        } | {
            readonly _tag: "ForEachOrNull";
            readonly forEachOrNull: string;
            readonly select: ReadonlyArray<Node>;
        } | {
            readonly _tag: "UnionAll";
            readonly unionAll: ReadonlyArray<Node>;
        }, {
            readonly _tag: "Column";
            readonly column: ReadonlyArray<ColumnPath>;
        } | {
            readonly _tag: "Select";
            readonly select: ReadonlyArray<Node>;
        } | {
            readonly _tag: "ForEach";
            readonly forEach: string;
            readonly select: ReadonlyArray<Node>;
        } | {
            readonly _tag: "ForEachOrNull";
            readonly forEachOrNull: string;
            readonly select: ReadonlyArray<Node>;
        } | {
            readonly _tag: "UnionAll";
            readonly unionAll: ReadonlyArray<Node>;
        }, never>>;
    }>, Schema.TaggedStruct<"ForEachOrNull", {
        forEachOrNull: typeof Schema.String;
        select: Schema.Array$<Schema.suspend<{
            readonly _tag: "Column";
            readonly column: ReadonlyArray<ColumnPath>;
        } | {
            readonly _tag: "Select";
            readonly select: ReadonlyArray<Node>;
        } | {
            readonly _tag: "ForEach";
            readonly forEach: string;
            readonly select: ReadonlyArray<Node>;
        } | {
            readonly _tag: "ForEachOrNull";
            readonly forEachOrNull: string;
            readonly select: ReadonlyArray<Node>;
        } | {
            readonly _tag: "UnionAll";
            readonly unionAll: ReadonlyArray<Node>;
        }, {
            readonly _tag: "Column";
            readonly column: ReadonlyArray<ColumnPath>;
        } | {
            readonly _tag: "Select";
            readonly select: ReadonlyArray<Node>;
        } | {
            readonly _tag: "ForEach";
            readonly forEach: string;
            readonly select: ReadonlyArray<Node>;
        } | {
            readonly _tag: "ForEachOrNull";
            readonly forEachOrNull: string;
            readonly select: ReadonlyArray<Node>;
        } | {
            readonly _tag: "UnionAll";
            readonly unionAll: ReadonlyArray<Node>;
        }, never>>;
    }>, Schema.TaggedStruct<"UnionAll", {
        unionAll: Schema.Array$<Schema.suspend<{
            readonly _tag: "Column";
            readonly column: ReadonlyArray<ColumnPath>;
        } | {
            readonly _tag: "Select";
            readonly select: ReadonlyArray<Node>;
        } | {
            readonly _tag: "ForEach";
            readonly forEach: string;
            readonly select: ReadonlyArray<Node>;
        } | {
            readonly _tag: "ForEachOrNull";
            readonly forEachOrNull: string;
            readonly select: ReadonlyArray<Node>;
        } | {
            readonly _tag: "UnionAll";
            readonly unionAll: ReadonlyArray<Node>;
        }, {
            readonly _tag: "Column";
            readonly column: ReadonlyArray<ColumnPath>;
        } | {
            readonly _tag: "Select";
            readonly select: ReadonlyArray<Node>;
        } | {
            readonly _tag: "ForEach";
            readonly forEach: string;
            readonly select: ReadonlyArray<Node>;
        } | {
            readonly _tag: "ForEachOrNull";
            readonly forEachOrNull: string;
            readonly select: ReadonlyArray<Node>;
        } | {
            readonly _tag: "UnionAll";
            readonly unionAll: ReadonlyArray<Node>;
        }, never>>;
    }>]>>;
}>;
export interface ViewDefinition<ResourceType extends string = string> extends Schema.Schema.Type<typeof _ViewDefinition> {
    resource: ResourceType;
}
export declare const viewDefinition: import("effect/Data").Case.Constructor<ViewDefinition<string>, "_tag">;
export declare function getColumns(vd: ViewDefinition, f?: (columnPath: ColumnPath) => boolean): ColumnPath<string>[];
export type Select = ReturnType<typeof Select>;
export type Column = ReturnType<typeof Column>;
export type ForEach = ReturnType<typeof ForEach>;
export type ForEachOrNull = ReturnType<typeof ForEachOrNull>;
export type UnionAll = ReturnType<typeof UnionAll>;
export {};
