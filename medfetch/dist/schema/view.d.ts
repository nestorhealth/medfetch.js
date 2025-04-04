import { Data as D, ParseResult, Schema } from "effect";
import { FhirType } from "./literal";
import * as Data from "./data";
declare const _Tag: Schema.Struct<{
    name: Schema.Literal<["sql"]>;
    value: Schema.Union<[Schema.Literal<["NOT NULL"]>, Schema.TemplateLiteral<`REFERENCES ${string}`>]>;
}>;
export interface Tag extends Schema.Schema.Type<typeof _Tag> {
}
export declare const Tag: Schema.Schema<Tag>;
export declare const isTag: (u: unknown, overrideOptions?: import("effect/SchemaAST").ParseOptions | number) => u is Tag;
declare const _View_ColumnPath: Schema.extend<Schema.SchemaClass<{
    readonly name: string;
    readonly path: string;
    readonly collection: boolean;
}, {
    readonly name: string;
    readonly path: string;
    readonly collection: boolean;
}, never>, Schema.Struct<{
    type: Schema.Literal<["Resource", "BackboneElement", "Reference", "Extension", "System.String", "positiveInt", "string", "boolean", "Period", "Identifier", "uri", "code", "Meta", "Narrative", "CodeableConcept", "date", "ContactDetail", "markdown", "dateTime", "Dosage", "Expression", "canonical", "Quantity", "RelatedArtifact", "Age", "Duration", "Range", "Timing", "UsageContext", "decimal", "Annotation", "instant", "unsignedInt", "base64Binary", "url", "Coding", "integer", "Attachment", "Signature", "ContactPoint", "Money", "Address", "time", "Element", "ProdCharacteristic", "ProductShelfLife", "Ratio", "id", "Contributor", "Count", "DataRequirement", "Distance", "HumanName", "oid", "ParameterDefinition", "SampledData", "TriggerDefinition", "uuid", "MarketingStatus", "Population", "xhtml", "ElementDefinition", "SubstanceAmount", "System.Boolean", "System.Date", "System.DateTime", "System.Decimal", "System.Integer", "System.Time"]>;
    tags: Schema.Array$<Schema.Schema<Tag, Tag, never>>;
}>>;
/**
 * The ColumnPath schema that the View
 * layer expects to work with
 *
 * *Optionally* takes in a `TName` string
 * literal to denote the name of the column
 */
export interface ColumnPath<TName extends string = string, TFhirType extends FhirType = FhirType> extends Schema.Schema.Type<typeof _View_ColumnPath> {
    name: TName;
    type: TFhirType;
}
export declare const ColumnPath: Schema.Schema<ColumnPath, Data.ColumnPath>;
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
export declare const columnPath: <TName extends string, TFhirType extends FhirType>(input: ColumnPath<TName, TFhirType>) => ColumnPath<TName, TFhirType>;
export type Node = D.TaggedEnum<{
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
export declare const Select: D.Case.Constructor<{
    readonly _tag: "Select";
    readonly select: ReadonlyArray<Node>;
}, "_tag">, Column: D.Case.Constructor<{
    readonly _tag: "Column";
    readonly column: ReadonlyArray<ColumnPath>;
}, "_tag">, ForEach: D.Case.Constructor<{
    readonly _tag: "ForEach";
    readonly forEach: string;
    readonly select: ReadonlyArray<Node>;
}, "_tag">, ForEachOrNull: D.Case.Constructor<{
    readonly _tag: "ForEachOrNull";
    readonly forEachOrNull: string;
    readonly select: ReadonlyArray<Node>;
}, "_tag">, UnionAll: D.Case.Constructor<{
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
export declare function decodeSelect(nd: Data.Select): Node;
declare const ConstantFromData: Schema.transformOrFail<Schema.SchemaClass<Data.Constant, Data.Constant, never>, Schema.SchemaClass<{
    readonly valueBoolean: boolean;
    readonly name: string;
    readonly _tag: "boolean";
} | {
    readonly valueBase64Binary: string;
    readonly name: string;
    readonly _tag: "base64Binary";
} | {
    readonly valueCanonical: string;
    readonly name: string;
    readonly _tag: "canonical";
} | {
    readonly valueCode: string;
    readonly name: string;
    readonly _tag: "code";
} | {
    readonly valueDate: string;
    readonly name: string;
    readonly _tag: "date";
} | {
    readonly valueDateTime: string;
    readonly name: string;
    readonly _tag: "dateTime";
} | {
    readonly valueDecimal: number;
    readonly name: string;
    readonly _tag: "decimal";
} | {
    readonly valueId: string;
    readonly name: string;
    readonly _tag: "id";
} | {
    readonly valueInstant: string;
    readonly name: string;
    readonly _tag: "instant";
} | {
    readonly valueInteger: number;
    readonly name: string;
    readonly _tag: "integer";
} | {
    readonly valueOid: string;
    readonly name: string;
    readonly _tag: "oid";
} | {
    readonly valueString: string;
    readonly name: string;
    readonly _tag: "string";
} | {
    readonly valuePositiveInt: number;
    readonly name: string;
    readonly _tag: "positiveInt";
} | {
    readonly valueTime: string;
    readonly name: string;
    readonly _tag: "time";
} | {
    readonly valueUnsignedInt: number;
    readonly name: string;
    readonly _tag: "unsignedInt";
} | {
    readonly valueUri: string;
    readonly name: string;
    readonly _tag: "uri";
} | {
    readonly valueUrl: string;
    readonly name: string;
    readonly _tag: "url";
} | {
    readonly valueUuid: string;
    readonly name: string;
    readonly _tag: "uuid";
}, {
    readonly valueBoolean: boolean;
    readonly name: string;
    readonly _tag: "boolean";
} | {
    readonly valueBase64Binary: string;
    readonly name: string;
    readonly _tag: "base64Binary";
} | {
    readonly valueCanonical: string;
    readonly name: string;
    readonly _tag: "canonical";
} | {
    readonly valueCode: string;
    readonly name: string;
    readonly _tag: "code";
} | {
    readonly valueDate: string;
    readonly name: string;
    readonly _tag: "date";
} | {
    readonly valueDateTime: string;
    readonly name: string;
    readonly _tag: "dateTime";
} | {
    readonly valueDecimal: number;
    readonly name: string;
    readonly _tag: "decimal";
} | {
    readonly valueId: string;
    readonly name: string;
    readonly _tag: "id";
} | {
    readonly valueInstant: string;
    readonly name: string;
    readonly _tag: "instant";
} | {
    readonly valueInteger: number;
    readonly name: string;
    readonly _tag: "integer";
} | {
    readonly valueOid: string;
    readonly name: string;
    readonly _tag: "oid";
} | {
    readonly valueString: string;
    readonly name: string;
    readonly _tag: "string";
} | {
    readonly valuePositiveInt: number;
    readonly name: string;
    readonly _tag: "positiveInt";
} | {
    readonly valueTime: string;
    readonly name: string;
    readonly _tag: "time";
} | {
    readonly valueUnsignedInt: number;
    readonly name: string;
    readonly _tag: "unsignedInt";
} | {
    readonly valueUri: string;
    readonly name: string;
    readonly _tag: "uri";
} | {
    readonly valueUrl: string;
    readonly name: string;
    readonly _tag: "url";
} | {
    readonly valueUuid: string;
    readonly name: string;
    readonly _tag: "uuid";
}, never>, never>;
export type Constant = typeof ConstantFromData.Type;
export declare const Constant: Schema.Schema<Constant, Data.Constant>;
export declare const getConstantValue: <TConstant extends Constant>(constant: TConstant) => string | number | boolean;
export declare const decodeConstant: (i: Data.Constant, overrideOptions?: import("effect/SchemaAST").ParseOptions) => import("effect/Effect").Effect<{
    readonly valueBoolean: boolean;
    readonly name: string;
    readonly _tag: "boolean";
} | {
    readonly valueBase64Binary: string;
    readonly name: string;
    readonly _tag: "base64Binary";
} | {
    readonly valueCanonical: string;
    readonly name: string;
    readonly _tag: "canonical";
} | {
    readonly valueCode: string;
    readonly name: string;
    readonly _tag: "code";
} | {
    readonly valueDate: string;
    readonly name: string;
    readonly _tag: "date";
} | {
    readonly valueDateTime: string;
    readonly name: string;
    readonly _tag: "dateTime";
} | {
    readonly valueDecimal: number;
    readonly name: string;
    readonly _tag: "decimal";
} | {
    readonly valueId: string;
    readonly name: string;
    readonly _tag: "id";
} | {
    readonly valueInstant: string;
    readonly name: string;
    readonly _tag: "instant";
} | {
    readonly valueInteger: number;
    readonly name: string;
    readonly _tag: "integer";
} | {
    readonly valueOid: string;
    readonly name: string;
    readonly _tag: "oid";
} | {
    readonly valueString: string;
    readonly name: string;
    readonly _tag: "string";
} | {
    readonly valuePositiveInt: number;
    readonly name: string;
    readonly _tag: "positiveInt";
} | {
    readonly valueTime: string;
    readonly name: string;
    readonly _tag: "time";
} | {
    readonly valueUnsignedInt: number;
    readonly name: string;
    readonly _tag: "unsignedInt";
} | {
    readonly valueUri: string;
    readonly name: string;
    readonly _tag: "uri";
} | {
    readonly valueUrl: string;
    readonly name: string;
    readonly _tag: "url";
} | {
    readonly valueUuid: string;
    readonly name: string;
    readonly _tag: "uuid";
}, ParseResult.ParseError, never>;
declare const ViewDefinitionFromData: Schema.transform<Schema.SchemaClass<Data.ViewDefinition, Data.ViewDefinition, never>, Schema.SchemaClass<{
    readonly url?: string;
    readonly identifier?: readonly Data.Identifier[];
    readonly description?: string;
    readonly status: "draft" | "active" | "retired" | "unknown";
    readonly title?: string;
    readonly meta?: {
        readonly versionId?: string;
        readonly lastUpdated?: string;
        readonly source?: string;
        readonly profile?: readonly string[];
        readonly security?: readonly {
            readonly code?: string;
            readonly system?: string;
            readonly version?: string;
            readonly display?: string;
            readonly userSelected?: boolean;
        }[];
        readonly tag?: readonly {
            readonly code?: string;
            readonly system?: string;
            readonly version?: string;
            readonly display?: string;
            readonly userSelected?: boolean;
        }[];
    };
    readonly experimental?: boolean;
    readonly publisher?: string;
    readonly contact?: readonly {
        readonly name?: string;
        readonly telecom?: readonly {
            readonly value?: string;
            readonly system?: "url" | "phone" | "fax" | "email" | "pager" | "sms" | "other";
            readonly use?: "temp" | "old" | "home" | "work" | "mobile";
            readonly rank?: number;
            readonly period?: {
                readonly start?: string;
                readonly end?: string;
            };
        }[];
    }[];
    readonly useContext?: {
        readonly code: {
            readonly code?: string;
            readonly system?: string;
            readonly version?: string;
            readonly display?: string;
            readonly userSelected?: boolean;
        };
        readonly valueCodeableConcept?: {
            readonly text?: string;
            readonly coding?: readonly {
                readonly code?: string;
                readonly system?: string;
                readonly version?: string;
                readonly display?: string;
                readonly userSelected?: boolean;
            }[];
        };
        readonly valueQuantity?: {
            readonly code?: string;
            readonly value?: number;
            readonly system?: string;
            readonly comparator?: ">" | "<=" | ">=";
            readonly unit?: string;
        };
        readonly valueRange?: {
            readonly low?: {
                readonly value?: number;
                readonly unit?: string;
            };
            readonly high?: {
                readonly value?: number;
                readonly unit?: string;
            };
        };
        readonly valueReference?: {
            readonly display?: string;
            readonly type?: string;
            readonly reference?: string;
            readonly identifier?: {
                readonly value?: string;
                readonly system?: string;
                readonly use?: "usual" | "official" | "temp" | "secondary" | "old";
                readonly period?: {
                    readonly start?: string;
                    readonly end?: string;
                };
                readonly type?: {
                    readonly text?: string;
                    readonly coding?: readonly {
                        readonly code?: string;
                        readonly system?: string;
                        readonly version?: string;
                        readonly display?: string;
                        readonly userSelected?: boolean;
                    }[];
                };
                readonly assigner?: import("./data.element").Reference;
            };
        };
    };
    readonly copyright?: string;
    readonly resource: string;
    readonly fhirVersion?: "0.01" | "0.05" | "0.06" | "0.11" | "0.0" | "0.0.80" | "0.0.81" | "0.0.82" | "0.4" | "0.4.0" | "0.5" | "0.5.0" | "1.0" | "1.0.0" | "1.0.1" | "1.0.2" | "1.1" | "1.1.0" | "1.4" | "1.4.0" | "1.6" | "1.6.0" | "1.8" | "1.8.0" | "3.0" | "3.0.0" | "3.0.1" | "3.0.2" | "3.3" | "3.3.0" | "3.5" | "3.5.0" | "4.0" | "4.0.0" | "4.0.1" | "4.1" | "4.1.0" | "4.2" | "4.2.0" | "4.3" | "4.3.0" | "4.3.0-cibuild" | "4.3.0-snapshot1" | "4.4" | "4.4.0" | "4.5" | "4.5.0" | "4.6" | "4.6.0" | "5.0" | "5.0.0" | "5.0.0-cibuild" | "5.0.0-snapshot1" | "5.0.0-snapshot2" | "5.0.0-ballot" | "5.0.0-snapshot3" | "5.0.0-draft-final";
} & {
    readonly name: string;
    readonly select: readonly [{
        readonly column: readonly ColumnPath<string, FhirType>[];
        readonly _tag: "Column";
    } | {
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
        readonly _tag: "Select";
    } | {
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
        readonly _tag: "ForEach";
    } | {
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
        readonly _tag: "ForEachOrNull";
    } | {
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
        readonly _tag: "UnionAll";
    }, ...({
        readonly column: readonly ColumnPath<string, FhirType>[];
        readonly _tag: "Column";
    } | {
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
        readonly _tag: "Select";
    } | {
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
        readonly _tag: "ForEach";
    } | {
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
        readonly _tag: "ForEachOrNull";
    } | {
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
        readonly _tag: "UnionAll";
    })[]];
    readonly constant: readonly ({
        readonly valueBoolean: boolean;
        readonly name: string;
        readonly _tag: "boolean";
    } | {
        readonly valueBase64Binary: string;
        readonly name: string;
        readonly _tag: "base64Binary";
    } | {
        readonly valueCanonical: string;
        readonly name: string;
        readonly _tag: "canonical";
    } | {
        readonly valueCode: string;
        readonly name: string;
        readonly _tag: "code";
    } | {
        readonly valueDate: string;
        readonly name: string;
        readonly _tag: "date";
    } | {
        readonly valueDateTime: string;
        readonly name: string;
        readonly _tag: "dateTime";
    } | {
        readonly valueDecimal: number;
        readonly name: string;
        readonly _tag: "decimal";
    } | {
        readonly valueId: string;
        readonly name: string;
        readonly _tag: "id";
    } | {
        readonly valueInstant: string;
        readonly name: string;
        readonly _tag: "instant";
    } | {
        readonly valueInteger: number;
        readonly name: string;
        readonly _tag: "integer";
    } | {
        readonly valueOid: string;
        readonly name: string;
        readonly _tag: "oid";
    } | {
        readonly valueString: string;
        readonly name: string;
        readonly _tag: "string";
    } | {
        readonly valuePositiveInt: number;
        readonly name: string;
        readonly _tag: "positiveInt";
    } | {
        readonly valueTime: string;
        readonly name: string;
        readonly _tag: "time";
    } | {
        readonly valueUnsignedInt: number;
        readonly name: string;
        readonly _tag: "unsignedInt";
    } | {
        readonly valueUri: string;
        readonly name: string;
        readonly _tag: "uri";
    } | {
        readonly valueUrl: string;
        readonly name: string;
        readonly _tag: "url";
    } | {
        readonly valueUuid: string;
        readonly name: string;
        readonly _tag: "uuid";
    })[];
    readonly where: readonly {
        readonly path: string;
        readonly description?: string;
    }[];
    readonly _tag: "Select";
}, {
    readonly url?: string;
    readonly identifier?: readonly Data.Identifier[];
    readonly description?: string;
    readonly status: "draft" | "active" | "retired" | "unknown";
    readonly title?: string;
    readonly meta?: {
        readonly versionId?: string;
        readonly lastUpdated?: string;
        readonly source?: string;
        readonly profile?: readonly string[];
        readonly security?: readonly {
            readonly code?: string;
            readonly system?: string;
            readonly version?: string;
            readonly display?: string;
            readonly userSelected?: boolean;
        }[];
        readonly tag?: readonly {
            readonly code?: string;
            readonly system?: string;
            readonly version?: string;
            readonly display?: string;
            readonly userSelected?: boolean;
        }[];
    };
    readonly experimental?: boolean;
    readonly publisher?: string;
    readonly contact?: readonly {
        readonly name?: string;
        readonly telecom?: readonly {
            readonly value?: string;
            readonly system?: "url" | "phone" | "fax" | "email" | "pager" | "sms" | "other";
            readonly use?: "temp" | "old" | "home" | "work" | "mobile";
            readonly rank?: number;
            readonly period?: {
                readonly start?: string;
                readonly end?: string;
            };
        }[];
    }[];
    readonly useContext?: {
        readonly code: {
            readonly code?: string;
            readonly system?: string;
            readonly version?: string;
            readonly display?: string;
            readonly userSelected?: boolean;
        };
        readonly valueCodeableConcept?: {
            readonly text?: string;
            readonly coding?: readonly {
                readonly code?: string;
                readonly system?: string;
                readonly version?: string;
                readonly display?: string;
                readonly userSelected?: boolean;
            }[];
        };
        readonly valueQuantity?: {
            readonly code?: string;
            readonly value?: number;
            readonly system?: string;
            readonly comparator?: ">" | "<=" | ">=";
            readonly unit?: string;
        };
        readonly valueRange?: {
            readonly low?: {
                readonly value?: number;
                readonly unit?: string;
            };
            readonly high?: {
                readonly value?: number;
                readonly unit?: string;
            };
        };
        readonly valueReference?: {
            readonly display?: string;
            readonly type?: string;
            readonly reference?: string;
            readonly identifier?: {
                readonly value?: string;
                readonly system?: string;
                readonly use?: "usual" | "official" | "temp" | "secondary" | "old";
                readonly period?: {
                    readonly start?: string;
                    readonly end?: string;
                };
                readonly type?: {
                    readonly text?: string;
                    readonly coding?: readonly {
                        readonly code?: string;
                        readonly system?: string;
                        readonly version?: string;
                        readonly display?: string;
                        readonly userSelected?: boolean;
                    }[];
                };
                readonly assigner?: import("./data.element").Reference;
            };
        };
    };
    readonly copyright?: string;
    readonly resource: string;
    readonly fhirVersion?: "0.01" | "0.05" | "0.06" | "0.11" | "0.0" | "0.0.80" | "0.0.81" | "0.0.82" | "0.4" | "0.4.0" | "0.5" | "0.5.0" | "1.0" | "1.0.0" | "1.0.1" | "1.0.2" | "1.1" | "1.1.0" | "1.4" | "1.4.0" | "1.6" | "1.6.0" | "1.8" | "1.8.0" | "3.0" | "3.0.0" | "3.0.1" | "3.0.2" | "3.3" | "3.3.0" | "3.5" | "3.5.0" | "4.0" | "4.0.0" | "4.0.1" | "4.1" | "4.1.0" | "4.2" | "4.2.0" | "4.3" | "4.3.0" | "4.3.0-cibuild" | "4.3.0-snapshot1" | "4.4" | "4.4.0" | "4.5" | "4.5.0" | "4.6" | "4.6.0" | "5.0" | "5.0.0" | "5.0.0-cibuild" | "5.0.0-snapshot1" | "5.0.0-snapshot2" | "5.0.0-ballot" | "5.0.0-snapshot3" | "5.0.0-draft-final";
} & {
    readonly name: string;
    readonly select: readonly [{
        readonly column: readonly ColumnPath<string, FhirType>[];
        readonly _tag: "Column";
    } | {
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
        readonly _tag: "Select";
    } | {
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
        readonly _tag: "ForEach";
    } | {
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
        readonly _tag: "ForEachOrNull";
    } | {
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
        readonly _tag: "UnionAll";
    }, ...({
        readonly column: readonly ColumnPath<string, FhirType>[];
        readonly _tag: "Column";
    } | {
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
        readonly _tag: "Select";
    } | {
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
        readonly _tag: "ForEach";
    } | {
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
        readonly _tag: "ForEachOrNull";
    } | {
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
        readonly _tag: "UnionAll";
    })[]];
    readonly constant: readonly ({
        readonly valueBoolean: boolean;
        readonly name: string;
        readonly _tag: "boolean";
    } | {
        readonly valueBase64Binary: string;
        readonly name: string;
        readonly _tag: "base64Binary";
    } | {
        readonly valueCanonical: string;
        readonly name: string;
        readonly _tag: "canonical";
    } | {
        readonly valueCode: string;
        readonly name: string;
        readonly _tag: "code";
    } | {
        readonly valueDate: string;
        readonly name: string;
        readonly _tag: "date";
    } | {
        readonly valueDateTime: string;
        readonly name: string;
        readonly _tag: "dateTime";
    } | {
        readonly valueDecimal: number;
        readonly name: string;
        readonly _tag: "decimal";
    } | {
        readonly valueId: string;
        readonly name: string;
        readonly _tag: "id";
    } | {
        readonly valueInstant: string;
        readonly name: string;
        readonly _tag: "instant";
    } | {
        readonly valueInteger: number;
        readonly name: string;
        readonly _tag: "integer";
    } | {
        readonly valueOid: string;
        readonly name: string;
        readonly _tag: "oid";
    } | {
        readonly valueString: string;
        readonly name: string;
        readonly _tag: "string";
    } | {
        readonly valuePositiveInt: number;
        readonly name: string;
        readonly _tag: "positiveInt";
    } | {
        readonly valueTime: string;
        readonly name: string;
        readonly _tag: "time";
    } | {
        readonly valueUnsignedInt: number;
        readonly name: string;
        readonly _tag: "unsignedInt";
    } | {
        readonly valueUri: string;
        readonly name: string;
        readonly _tag: "uri";
    } | {
        readonly valueUrl: string;
        readonly name: string;
        readonly _tag: "url";
    } | {
        readonly valueUuid: string;
        readonly name: string;
        readonly _tag: "uuid";
    })[];
    readonly where: readonly {
        readonly path: string;
        readonly description?: string;
    }[];
    readonly _tag: "Select";
}, never>>;
export interface ViewDefinition extends Schema.Schema.Type<typeof ViewDefinitionFromData> {
}
export declare const ViewDefinition: Schema.Schema<ViewDefinition, Data.ViewDefinition>;
export declare const decode: (i: Data.ViewDefinition, overrideOptions?: import("effect/SchemaAST").ParseOptions) => import("effect/Effect").Effect<ViewDefinition, ParseResult.ParseError, never>;
export declare const decodeSync: (i: Data.ViewDefinition, overrideOptions?: import("effect/SchemaAST").ParseOptions) => ViewDefinition;
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
export declare const make: D.Case.Constructor<ViewDefinition, "_tag">;
export declare function getColumns(vd: ViewDefinition, f?: (columnPath: ColumnPath) => boolean): ColumnPath<string, FhirType>[];
export declare function applyTags<TViewDefinition extends ViewDefinition>(vd: TViewDefinition): {
    readonly path: string;
    readonly description?: string;
}[] | [{
    readonly path: string;
    readonly description?: string;
} | {
    path: string;
}, ...({
    readonly path: string;
    readonly description?: string;
} | {
    path: string;
})[]];
export declare function mapColumns<TViewDefinition extends ViewDefinition>(viewDefinition: TViewDefinition, f: (column: ColumnPath) => ColumnPath): TViewDefinition & {
    select: {
        readonly _tag: "Column";
        readonly column: ReadonlyArray<ColumnPath>;
    }[];
};
export type Select = ReturnType<typeof Select>;
export type Column = ReturnType<typeof Column>;
export type ForEach = ReturnType<typeof ForEach>;
export type ForEachOrNull = ReturnType<typeof ForEachOrNull>;
export type UnionAll = ReturnType<typeof UnionAll>;
export {};
