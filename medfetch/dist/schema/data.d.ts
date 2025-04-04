import { Schema, Data as D } from "effect";
export declare const Tag: Schema.Struct<{
    name: typeof Schema.String;
    value: typeof Schema.String;
}>;
export type Tag = typeof Tag.Type;
declare const _ColumnPath: Schema.Struct<{
    path: typeof Schema.String;
    name: typeof Schema.String;
    description: Schema.optionalWith<typeof Schema.String, {
        exact: true;
    }>;
    collection: Schema.optionalWith<typeof Schema.Boolean, {
        exact: true;
        default: () => false;
    }>;
    type: Schema.optionalWith<typeof Schema.String, {
        exact: true;
    }>;
    tags: Schema.optionalWith<Schema.Array$<Schema.Struct<{
        name: typeof Schema.String;
        value: typeof Schema.String;
    }>>, {
        exact: true;
        default: () => never[];
    }>;
}>;
export interface ColumnPath extends Schema.Schema.Type<typeof _ColumnPath> {
}
interface NullableColumnPath extends Schema.Schema.Encoded<typeof _ColumnPath> {
}
/**
 * Defaults on the following nullable fields:
 * ```ts
 * {
 *   [collection] := false, // from reference implementation tests
 *   [tags] := []
 * }
 * ```
 */
export declare const ColumnPath: Schema.Schema<ColumnPath, NullableColumnPath>;
export declare const Where: Schema.Struct<{
    path: typeof Schema.String;
    description: Schema.optionalWith<typeof Schema.String, {
        exact: true;
    }>;
}>;
export type Where = Schema.Schema.Type<typeof Where>;
/**
 * Only difference with `DefaultedSelect`
 * is that `DefaultedSelect.column` is the schema
 * after it hits a leaf and applies the default empty
 * values
 * @field column the Nullable (Encoded) ColumnPath object
 */
type BaseSelect = {
    readonly column?: readonly NullableColumnPath[];
    readonly select?: readonly BaseSelect[];
    readonly forEach?: string;
    readonly forEachOrNull?: string;
    readonly unionAll?: readonly BaseSelect[];
};
/**
 * Implementation of type `Data.Select`
 * @field column the defaulted ColumnPath object, if any apply
 */
type DefaultedSelect = {
    readonly column?: readonly ColumnPath[];
    readonly select?: readonly DefaultedSelect[];
    readonly forEach?: string;
    readonly forEachOrNull?: string;
    readonly unionAll?: readonly DefaultedSelect[];
};
declare const _Select: Schema.Struct<{
    column: Schema.optionalWith<Schema.Array$<Schema.Schema<ColumnPath, NullableColumnPath, never>>, {
        exact: true;
    }>;
    select: Schema.optionalWith<Schema.Array$<Schema.suspend<DefaultedSelect, BaseSelect, never>>, {
        exact: true;
    }>;
    forEach: Schema.optionalWith<typeof Schema.String, {
        exact: true;
    }>;
    forEachOrNull: Schema.optionalWith<typeof Schema.String, {
        exact: true;
    }>;
    unionAll: Schema.optionalWith<Schema.Array$<Schema.suspend<DefaultedSelect, BaseSelect, never>>, {
        exact: true;
    }>;
}>;
export interface Select extends Schema.Schema.Type<typeof _Select> {
}
export declare const Select: Schema.Schema<Select, BaseSelect>;
import { Identifier } from "./data.element";
export { ContactDetail, Identifier, Meta, UsageContext } from "./data.element";
declare const _Constant: Schema.Struct<{
    name: typeof Schema.String;
    valueBase64Binary: Schema.optionalWith<typeof Schema.String, {
        exact: true;
    }>;
    valueBoolean: Schema.optionalWith<typeof Schema.Boolean, {
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
    valueDecimal: Schema.optionalWith<typeof Schema.Number, {
        exact: true;
    }>;
    valueId: Schema.optionalWith<typeof Schema.String, {
        exact: true;
    }>;
    valueInstant: Schema.optionalWith<typeof Schema.String, {
        exact: true;
    }>;
    valueInteger: Schema.optionalWith<typeof Schema.Int, {
        exact: true;
    }>;
    valueOid: Schema.optionalWith<typeof Schema.String, {
        exact: true;
    }>;
    valuePositiveInt: Schema.optionalWith<Schema.filter<Schema.Schema<number, number, never>>, {
        exact: true;
    }>;
    valueString: Schema.optionalWith<typeof Schema.String, {
        exact: true;
    }>;
    valueTime: Schema.optionalWith<typeof Schema.String, {
        exact: true;
    }>;
    valueUnsignedInt: Schema.optionalWith<Schema.refine<number, Schema.Schema<number, number, never>>, {
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
declare const _ViewDefinition: Schema.Struct<{
    status: Schema.Literal<["draft", "active", "retired", "unknown"]>;
    url: Schema.optionalWith<typeof Schema.String, {
        exact: true;
    }>;
    identifier: Schema.optionalWith<Schema.Array$<Schema.Schema<Identifier, Identifier, never>>, {
        exact: true;
    }>;
    name: Schema.optionalWith<typeof Schema.String, {
        exact: true;
    }>;
    title: Schema.optionalWith<typeof Schema.String, {
        exact: true;
    }>;
    meta: Schema.optionalWith<Schema.Struct<{
        versionId: Schema.optionalWith<typeof Schema.String, {
            exact: true;
        }>;
        lastUpdated: Schema.optionalWith<typeof Schema.String, {
            exact: true;
        }>;
        source: Schema.optionalWith<typeof Schema.String, {
            exact: true;
        }>;
        profile: Schema.optionalWith<Schema.Array$<typeof Schema.String>, {
            exact: true;
        }>;
        security: Schema.optionalWith<Schema.Array$<Schema.Struct<{
            system: Schema.optionalWith<typeof Schema.String, {
                exact: true;
            }>;
            version: Schema.optionalWith<typeof Schema.String, {
                exact: true;
            }>;
            code: Schema.optionalWith<typeof Schema.String, {
                exact: true;
            }>;
            display: Schema.optionalWith<typeof Schema.String, {
                exact: true;
            }>;
            userSelected: Schema.optionalWith<typeof Schema.Boolean, {
                exact: true;
            }>;
        }>>, {
            exact: true;
        }>;
        tag: Schema.optionalWith<Schema.Array$<Schema.Struct<{
            system: Schema.optionalWith<typeof Schema.String, {
                exact: true;
            }>;
            version: Schema.optionalWith<typeof Schema.String, {
                exact: true;
            }>;
            code: Schema.optionalWith<typeof Schema.String, {
                exact: true;
            }>;
            display: Schema.optionalWith<typeof Schema.String, {
                exact: true;
            }>;
            userSelected: Schema.optionalWith<typeof Schema.Boolean, {
                exact: true;
            }>;
        }>>, {
            exact: true;
        }>;
    }>, {
        exact: true;
    }>;
    experimental: Schema.optionalWith<typeof Schema.Boolean, {
        exact: true;
    }>;
    publisher: Schema.optionalWith<typeof Schema.String, {
        exact: true;
    }>;
    contact: Schema.optionalWith<Schema.Array$<Schema.Struct<{
        name: Schema.optionalWith<typeof Schema.String, {
            exact: true;
        }>;
        telecom: Schema.optionalWith<Schema.Array$<Schema.Struct<{
            system: Schema.optionalWith<Schema.Literal<["phone", "fax", "email", "pager", "url", "sms", "other"]>, {
                exact: true;
            }>;
            value: Schema.optionalWith<typeof Schema.String, {
                exact: true;
            }>;
            use: Schema.optionalWith<Schema.Literal<["home", "work", "temp", "old", "mobile"]>, {
                exact: true;
            }>;
            rank: Schema.optionalWith<Schema.filter<Schema.Schema<number, number, never>>, {
                exact: true;
            }>;
            period: Schema.optionalWith<Schema.Struct<{
                start: Schema.optionalWith<typeof Schema.String, {
                    exact: true;
                }>;
                end: Schema.optionalWith<typeof Schema.String, {
                    exact: true;
                }>;
            }>, {
                exact: true;
            }>;
        }>>, {
            exact: true;
        }>;
    }>>, {
        exact: true;
    }>;
    description: Schema.optionalWith<typeof Schema.String, {
        exact: true;
    }>;
    useContext: Schema.optionalWith<Schema.Struct<{
        code: Schema.Struct<{
            system: Schema.optionalWith<typeof Schema.String, {
                exact: true;
            }>;
            version: Schema.optionalWith<typeof Schema.String, {
                exact: true;
            }>;
            code: Schema.optionalWith<typeof Schema.String, {
                exact: true;
            }>;
            display: Schema.optionalWith<typeof Schema.String, {
                exact: true;
            }>;
            userSelected: Schema.optionalWith<typeof Schema.Boolean, {
                exact: true;
            }>;
        }>;
        valueCodeableConcept: Schema.optionalWith<Schema.Struct<{
            text: Schema.optionalWith<typeof Schema.String, {
                exact: true;
            }>;
            coding: Schema.optionalWith<Schema.Array$<Schema.Struct<{
                system: Schema.optionalWith<typeof Schema.String, {
                    exact: true;
                }>;
                version: Schema.optionalWith<typeof Schema.String, {
                    exact: true;
                }>;
                code: Schema.optionalWith<typeof Schema.String, {
                    exact: true;
                }>;
                display: Schema.optionalWith<typeof Schema.String, {
                    exact: true;
                }>;
                userSelected: Schema.optionalWith<typeof Schema.Boolean, {
                    exact: true;
                }>;
            }>>, {
                exact: true;
            }>;
        }>, {
            exact: true;
        }>;
        valueQuantity: Schema.optionalWith<Schema.Struct<{
            value: Schema.optionalWith<typeof Schema.Number, {
                exact: true;
            }>;
            comparator: Schema.optionalWith<Schema.Literal<[">", "<=", ">=", ">"]>, {
                exact: true;
            }>;
            unit: Schema.optionalWith<typeof Schema.String, {
                exact: true;
            }>;
            system: Schema.optionalWith<typeof Schema.String, {
                exact: true;
            }>;
            code: Schema.optionalWith<typeof Schema.String, {
                exact: true;
            }>;
        }>, {
            exact: true;
        }>;
        valueRange: Schema.optionalWith<Schema.Struct<{
            low: Schema.optionalWith<Schema.Struct<{
                value: Schema.optionalWith<typeof Schema.Number, {
                    exact: true;
                }>;
                unit: Schema.optionalWith<typeof Schema.String, {
                    exact: true;
                }>;
            }>, {
                exact: true;
            }>;
            high: Schema.optionalWith<Schema.Struct<{
                value: Schema.optionalWith<typeof Schema.Number, {
                    exact: true;
                }>;
                unit: Schema.optionalWith<typeof Schema.String, {
                    exact: true;
                }>;
            }>, {
                exact: true;
            }>;
        }>, {
            exact: true;
        }>;
        valueReference: Schema.optionalWith<Schema.Struct<{
            reference: Schema.optionalWith<typeof Schema.String, {
                exact: true;
            }>;
            type: Schema.optionalWith<typeof Schema.String, {
                exact: true;
            }>;
            identifier: Schema.optionalWith<Schema.suspend<{
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
            }, {
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
            }, never>, {
                exact: true;
            }>;
            display: Schema.optionalWith<typeof Schema.String, {
                exact: true;
            }>;
        }>, {
            exact: true;
        }>;
    }>, {
        exact: true;
    }>;
    copyright: Schema.optionalWith<typeof Schema.String, {
        exact: true;
    }>;
    resource: typeof Schema.String;
    fhirVersion: Schema.optionalWith<Schema.Literal<["0.01", "0.05", "0.06", "0.11", "0.0", "0.0.80", "0.0.81", "0.0.82", "0.4", "0.4.0", "0.5", "0.5.0", "1.0", "1.0.0", "1.0.1", "1.0.2", "1.1", "1.1.0", "1.4", "1.4.0", "1.6", "1.6.0", "1.8", "1.8.0", "3.0", "3.0.0", "3.0.1", "3.0.2", "3.3", "3.3.0", "3.5", "3.5.0", "4.0", "4.0.0", "4.0.1", "4.1", "4.1.0", "4.2", "4.2.0", "4.3", "4.3.0", "4.3.0-cibuild", "4.3.0-snapshot1", "4.4", "4.4.0", "4.5", "4.5.0", "4.6", "4.6.0", "5.0", "5.0.0", "5.0.0-cibuild", "5.0.0-snapshot1", "5.0.0-snapshot2", "5.0.0-ballot", "5.0.0-snapshot3", "5.0.0-draft-final"]>, {
        exact: true;
    }>;
    constant: Schema.optionalWith<Schema.Array$<Schema.Struct<{
        name: typeof Schema.String;
        valueBase64Binary: Schema.optionalWith<typeof Schema.String, {
            exact: true;
        }>;
        valueBoolean: Schema.optionalWith<typeof Schema.Boolean, {
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
        valueDecimal: Schema.optionalWith<typeof Schema.Number, {
            exact: true;
        }>;
        valueId: Schema.optionalWith<typeof Schema.String, {
            exact: true;
        }>;
        valueInstant: Schema.optionalWith<typeof Schema.String, {
            exact: true;
        }>;
        valueInteger: Schema.optionalWith<typeof Schema.Int, {
            exact: true;
        }>;
        valueOid: Schema.optionalWith<typeof Schema.String, {
            exact: true;
        }>;
        valuePositiveInt: Schema.optionalWith<Schema.filter<Schema.Schema<number, number, never>>, {
            exact: true;
        }>;
        valueString: Schema.optionalWith<typeof Schema.String, {
            exact: true;
        }>;
        valueTime: Schema.optionalWith<typeof Schema.String, {
            exact: true;
        }>;
        valueUnsignedInt: Schema.optionalWith<Schema.refine<number, Schema.Schema<number, number, never>>, {
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
    }>>, {
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
    select: Schema.NonEmptyArray<Schema.Schema<Select, BaseSelect, never>>;
}>;
export interface ViewDefinition extends Schema.Schema.Type<typeof _ViewDefinition> {
}
interface FHIRViewDefinition extends Schema.Schema.Encoded<typeof _ViewDefinition> {
}
export declare const ViewDefinition: Schema.Schema<ViewDefinition, FHIRViewDefinition>;
/**
 * Constructor case function to create a  'native' `View Definition`
 *
 * Idea is that the output is portable with other sql-on-fhir
 * implementations.
 *
 * @param args the base view definition [fields](https://build.fhir.org/ig/FHIR/sql-on-fhir-v2/StructureDefinition-ViewDefinition.html)
 * @returns the portable ViewDefinition
 */
export declare const make: D.Case.Constructor<FHIRViewDefinition, never>;
export declare const parseSync: (u: unknown, overrideOptions?: import("effect/SchemaAST").ParseOptions) => ViewDefinition;
/**
 * 1st pass of decoding a `FHIRViewDefinition`
 * (the [schema](https://build.fhir.org/ig/FHIR/sql-on-fhir-v2/StructureDefinition-ViewDefinition.html) defined from the specs)
 * into an object where the `ViewDefinition.select` fields are filled with defaults as needed for
 * the View Runner.
 *
 * @param i - The FHIR ViewDefinition
 * @param overrideOptions - the `ParseOptions` from effect
 * @returns a decoded Data 'land' ViewDefinition
 */
export declare const decodeSync: (i: FHIRViewDefinition, overrideOptions?: import("effect/SchemaAST").ParseOptions) => ViewDefinition;
export declare const ok: (u: unknown, overrideOptions?: import("effect/SchemaAST").ParseOptions | number) => u is FHIRViewDefinition;
/**
 * Super set Resource Schema ctor
 * that only checks for a resource's resourceType
 * field existing. Treats the rest of the JSON object
 * as an arbitrary (key, value) record.
 */
declare const _Resource: Schema.TypeLiteral<{
    resourceType: typeof Schema.String;
}, readonly [{
    readonly key: typeof Schema.String;
    readonly value: typeof Schema.Any;
}]>;
export interface Resource extends Schema.Schema.Type<typeof _Resource> {
}
export declare const Resource: Schema.Schema<Resource>;
