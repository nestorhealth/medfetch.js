import { Array, Data as D, identity, Match, Option, ParseResult, pipe, Schema, } from "effect";
import { FhirType, isFhirType } from "./literal";
import * as Data from "./data";
import * as Primitive from "./primitive";
const _Tag = Schema.Struct({
    name: Schema.Literal("sql"),
    value: Schema.Union(Schema.Literal("NOT NULL"), Schema.TemplateLiteral("REFERENCES ", Schema.String)),
});
export const Tag = _Tag;
export const isTag = Schema.is(Tag);
const _View_ColumnPath = Data.ColumnPath.pipe(Schema.typeSchema, Schema.pick("path", "name", "collection"), Schema.required).pipe(Schema.extend(Schema.Struct({
    type: FhirType,
    tags: Schema.Array(Tag),
})));
const View_ColumnPath = _View_ColumnPath;
/**
 * View.ColumnPath defines the
 * transformation of a column path 'x'
 * FROM 'fhirland' (Data) TO 'viewland' (View)
 */
const _ColumnPath = Schema.transform(Schema.typeSchema(Data.ColumnPath), View_ColumnPath, {
    strict: true,
    decode: ({ tags, type, ...rest }) => pipe(tags, Array.filter((tag) => isTag(tag)), Array.dedupeWith((a, b) => a.value === b.value), (tags) => ({
        ...rest,
        tags,
        type: isFhirType(type) ? type : "System.String",
    })),
    encode: identity,
});
export const ColumnPath = _ColumnPath;
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
export const columnPath = (input) => input;
const decodeColumnPathOption = Schema.decodeOption(ColumnPath);
export const { Select, Column, ForEach, ForEachOrNull, UnionAll, $match } = D.taggedEnum();
const Node = Schema.Union(Schema.TaggedStruct("Column", {
    column: Schema.Array(Schema.typeSchema(ColumnPath)),
}), Schema.TaggedStruct("Select", {
    select: Schema.Array(Schema.suspend(() => Node)),
}), Schema.TaggedStruct("ForEach", {
    forEach: Schema.String,
    select: Schema.Array(Schema.suspend(() => Node)),
}), Schema.TaggedStruct("ForEachOrNull", {
    forEachOrNull: Schema.String,
    select: Schema.Array(Schema.suspend(() => Node)),
}), Schema.TaggedStruct("UnionAll", {
    unionAll: Schema.Array(Schema.suspend(() => Node)),
}));
/**
 * [[ decodeSelect nd ]] is the normalized select node
 * which uses the logic from the sql-on-fhir-v2 reference implementation
 * but returns a COPY of the SelectNode rather than mutating it in place.
 * (If it's too slow then I'll just make it imperative... lmao)
 * @param nd - The incoming Select node from the JSON
 * @returns the normalized SelectNode
 */
export function decodeSelect(nd) {
    return Match.value(nd).pipe(Match.when({
        forEach: Match.defined,
        forEachOrNull: Match.defined,
    }, () => {
        throw new TypeError(`Invalid SELECT node. Cannot have both a forEach and a forEachOrNull at the same level. Bad node is: ${JSON.stringify(nd, null, 2)}`);
    }), Match.when({
        forEach: Match.defined,
    }, ({ forEach, select = [], unionAll, column }) => {
        return ForEach({
            forEach,
            select: [
                ...(unionAll
                    ? [
                        UnionAll({
                            unionAll: unionAll.map((nd) => decodeSelect(nd)),
                        }),
                    ]
                    : []),
                ...(column
                    ? [
                        Column({
                            column: Array.filterMap(column, (columnPath) => decodeColumnPathOption(columnPath)),
                        }),
                    ]
                    : []),
                ...select.map(decodeSelect),
            ],
        });
    }), Match.when({
        forEachOrNull: Match.defined,
    }, ({ forEachOrNull, select = [], unionAll, column }) => {
        return ForEachOrNull({
            forEachOrNull,
            select: [
                ...(unionAll
                    ? [
                        UnionAll({
                            unionAll: unionAll.map((nd) => decodeSelect(nd)),
                        }),
                    ]
                    : []),
                ...(column
                    ? [
                        Column({
                            column: Array.filterMap(column, (columnPath) => decodeColumnPathOption(columnPath)),
                        }),
                    ]
                    : []),
                ...select.map(decodeSelect),
            ],
        });
    }), Match.when({
        column: Array.isArray,
        select: Array.isArray,
        unionAll: Array.isArray,
    }, ({ column = [], select = [], unionAll = [] }) => {
        return Select({
            select: [
                UnionAll({
                    unionAll: unionAll.map(decodeSelect),
                }),
                Column({
                    column: Array.filterMap(column, (columnPath) => decodeColumnPathOption(columnPath)),
                }),
                ...select.map(decodeSelect),
            ],
        });
    }), Match.when({
        unionAll: Array.isArray,
        select: Array.isArray,
    }, ({ unionAll = [], select = [] }) => {
        return Select({
            select: [
                UnionAll({
                    unionAll: unionAll.map(decodeSelect),
                }),
                ...select.map(decodeSelect),
            ],
        });
    }), Match.when({
        select: Array.isArray,
        column: Array.isArray,
    }, ({ select = [], column = [] }) => {
        return Select({
            select: [
                Column({
                    column: Array.filterMap(column, (columnPath) => decodeColumnPathOption(columnPath)),
                }),
                ...select.map(decodeSelect),
            ],
        });
    }), Match.when({
        column: Array.isArray,
        unionAll: Array.isArray,
    }, ({ column = [], unionAll = [], select = [] }) => {
        return Select({
            select: [
                Column({
                    column: Array.filterMap(column, (columnPath) => decodeColumnPathOption(columnPath)),
                }),
                UnionAll({
                    unionAll: unionAll.map(decodeSelect),
                }),
                ...select.map(decodeSelect),
            ],
        });
    }), Match.when({
        select: Array.isArray,
    }, ({ select = [] }) => {
        return Select({
            select: select.map(decodeSelect),
        });
    }), Match.orElse((nd) => {
        if (nd.unionAll) {
            return UnionAll({
                unionAll: nd.unionAll.map(decodeSelect),
            });
        }
        else if (nd.column) {
            return Column({
                column: Array.filterMap(nd.column, (column) => decodeColumnPathOption(column)),
            });
        }
        else if (nd.forEach) {
            return ForEach({
                forEach: nd.forEach,
                select: nd.select?.map(decodeSelect) ?? [],
            });
        }
        else if (nd.forEachOrNull) {
            return ForEachOrNull({
                forEachOrNull: nd.forEachOrNull,
                select: nd.select?.map(decodeSelect) ?? [],
            });
        }
        else if (nd.select) {
            return Select({
                select: nd.select.map(decodeSelect),
            });
        }
        return Select({
            select: [],
        });
    }));
}
const SelectFromData = Schema.transform(Data.Select, Node, {
    strict: true,
    encode: ({ _tag, ...rest }) => rest,
    decode: (dataNode) => decodeSelect(dataNode),
});
const normalize = Schema.decodeSync(SelectFromData);
const discriminateConstant = (t) => Data.Constant.pipe(Schema.pick(Primitive.createValueKey(t), "name"), Schema.required, Schema.attachPropertySignature("_tag", t));
const _Constant = Schema.Union(discriminateConstant("boolean"), discriminateConstant("base64Binary"), discriminateConstant("canonical"), discriminateConstant("code"), discriminateConstant("date"), discriminateConstant("dateTime"), discriminateConstant("decimal"), discriminateConstant("id"), discriminateConstant("instant"), discriminateConstant("integer"), discriminateConstant("oid"), discriminateConstant("string"), discriminateConstant("positiveInt"), discriminateConstant("time"), discriminateConstant("unsignedInt"), discriminateConstant("uri"), discriminateConstant("url"), discriminateConstant("uuid"));
const ConstantFromData = Data.Constant.pipe((dataSchema) => Schema.transformOrFail(Schema.typeSchema(dataSchema), Schema.typeSchema(_Constant), {
    strict: true,
    decode: (data, _options, ast) => {
        return pipe(data, Primitive.getValueKey, Option.match({
            onNone: () => ParseResult.fail(new ParseResult.Type(ast, data, `Failed to extract at least 1 value[x] key`)),
            onSome: (key) => {
                if (data[key] === undefined) {
                    return ParseResult.fail(new ParseResult.Type(ast, data, `data[value[x]] present with undefined value`));
                }
                const parsed = {
                    _tag: Primitive.fromValueKey(key),
                    name: data.name,
                    [key]: data[key],
                };
                return ParseResult.succeed(parsed);
            },
        }));
    },
    encode: ({ _tag, ...rest }) => ParseResult.succeed(rest),
}));
export const Constant = ConstantFromData;
export const getConstantValue = (constant) => {
    switch (constant._tag) {
        case "string":
            return constant.valueString;
        case "boolean":
            return constant.valueBoolean;
        case "base64Binary":
            return constant.valueBase64Binary;
        case "canonical":
            return constant.valueCanonical;
        case "code":
            return constant.valueCode;
        case "date":
            return constant.valueDate;
        case "dateTime":
            return constant.valueDateTime;
        case "decimal":
            return constant.valueDecimal;
        case "id":
            return constant.valueId;
        case "instant":
            return constant.valueInstant;
        case "integer":
            return constant.valueInteger;
        case "oid":
            return constant.valueOid;
        case "positiveInt":
            return constant.valuePositiveInt;
        case "time":
            return constant.valueTime;
        case "unsignedInt":
            return constant.valueUnsignedInt;
        case "uri":
            return constant.valueUri;
        case "url":
            return constant.valueUrl;
        case "uuid":
            return constant.valueUuid;
    }
};
const decodeConstantOption = Schema.decodeOption(ConstantFromData);
export const decodeConstant = Schema.decode(ConstantFromData);
const _ViewDefinition = Data.ViewDefinition.pipe(
// strip the fields we are transforming from the Data type
Schema.omit("constant", "select", "where", "name"), 
// A ViewDefinition is every a Node is and more.
// namely it has a NonEmpty Select + is the only node
// allowed to have a 'where' clause
Schema.extend(Schema.Struct({
    _tag: Schema.tag("Select"),
    select: Schema.NonEmptyArray(Node),
    constant: Schema.Array(ConstantFromData),
    where: Schema.Array(Data.Where),
    name: Schema.String,
})));
const ViewDefinitionFromData = Schema.transform(Schema.typeSchema(Data.ViewDefinition), Schema.typeSchema(_ViewDefinition), {
    strict: true,
    decode: ({ name, where, constant, select, ...rest }) => ({
        ...rest,
        _tag: "Select",
        name: name ?? rest.resource,
        select: Array.map(select, (nd) => normalize(nd)),
        constant: Array.filterMap(constant ?? [], (constant) => decodeConstantOption(constant)),
        where: where ?? [],
    }),
    encode: ({ _tag, ...rest }) => rest,
});
export const ViewDefinition = ViewDefinitionFromData;
export const decode = Schema.decode(ViewDefinition);
export const decodeSync = Schema.decodeSync(ViewDefinition);
/**
 * Struct constructor for View Layer `ViewDefinition`.
 *
 * Note this requires exactly 1 View `Node`
 * per level in the `select` tree.
 * If you want to make a ViewDefinition without this
 * level restriction, use the make ctor in the Data
 * schema layer.
 * @param args the ViewDefinition fields
 * @returns a tagged ViewDefinition
 */
export const make = D.tagged("Select");
export function getColumns(vd, f = (_columnPath) => true) {
    const aux = (acc, node) => {
        return $match(node, {
            ForEach: ({ select }) => {
                return select.flatMap((selectNode) => aux(acc, selectNode));
            },
            ForEachOrNull: ({ select }) => {
                return select.flatMap((selectNode) => aux(acc, selectNode));
            },
            Select: ({ select }) => {
                return select.flatMap((selectNode) => aux(acc, selectNode));
            },
            UnionAll: ({ unionAll }) => {
                return unionAll.flatMap((selectNode) => aux(acc, selectNode));
            },
            Column: ({ column }) => {
                return Array.appendAll(acc, column);
            },
        });
    };
    const collected = aux([], vd);
    const filtered = collected.filter(f);
    return filtered;
}
export function applyTags(vd) {
    return pipe(vd, getColumns, Array.reduce([], (acc, column) => {
        if (column.tags.length > 0) {
            return Array.reduce(column.tags, acc, (acc, tag) => {
                if (tag.value === "NOT NULL") {
                    return Array.append(acc, {
                        path: `${column.path}.exists()`,
                    });
                }
                return acc;
            });
        }
        return acc;
    }));
}
export function mapColumns(viewDefinition, f) {
    return pipe(viewDefinition, getColumns, Array.map(f), (columnPaths) => {
        return {
            ...viewDefinition,
            select: [
                Column({
                    column: columnPaths,
                }),
            ],
        };
    });
}
