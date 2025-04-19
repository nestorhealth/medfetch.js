import { Schema } from "effect";
export declare const ow: {
    <S extends Schema.Schema.All, Options extends Schema.OptionalOptions<Schema.Schema.Type<S>>>(options: Options): (self: S) => Schema.optionalWith<S, Options>;
    <S extends Schema.Schema.All, Options extends Schema.OptionalOptions<Schema.Schema.Type<S>>>(self: S, options: Options): Schema.optionalWith<S, Options>;
};
export declare const Period: Schema.Struct<{
    start: Schema.optionalWith<typeof Schema.String, {
        exact: true;
    }>;
    end: Schema.optionalWith<typeof Schema.String, {
        exact: true;
    }>;
}>;
export type Period = typeof Period.Type;
export declare const Coding: Schema.Struct<{
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
export type Coding = typeof Coding.Type;
export declare const CodeableConcept: Schema.Struct<{
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
}>;
export type CodeableConcept = typeof CodeableConcept.Type;
export interface Identifier {
    use?: "usual" | "official" | "temp" | "secondary" | "old";
    type?: CodeableConcept;
    system?: string;
    value?: string;
    period?: Period;
    assigner?: Reference;
}
export interface Reference {
    reference?: string;
    type?: string;
    identifier?: Identifier;
    display?: string;
}
export declare const Quantity: Schema.Struct<{
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
}>;
export declare const SimpleQuantity: Schema.Struct<{
    value: Schema.optionalWith<typeof Schema.Number, {
        exact: true;
    }>;
    unit: Schema.optionalWith<typeof Schema.String, {
        exact: true;
    }>;
}>;
export type SimpleQuantity = typeof SimpleQuantity;
export declare const Range: Schema.Struct<{
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
}>;
export declare const ContactPoint: Schema.Struct<{
    system: Schema.optionalWith<Schema.Literal<["phone", "fax", "email", "pager", "url", "sms", "other"]>, {
        exact: true;
    }>;
    value: Schema.optionalWith<typeof Schema.String, {
        exact: true;
    }>;
    use: Schema.optionalWith<Schema.Literal<["home", "work", "temp", "old", "mobile"]>, {
        exact: true;
    }>;
    rank: Schema.optionalWith<Schema.filter<typeof Schema.Positive>, {
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
}>;
export declare const ContactDetail: Schema.Struct<{
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
        rank: Schema.optionalWith<Schema.filter<typeof Schema.Positive>, {
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
}>;
export declare const Meta: Schema.Struct<{
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
}>;
export declare const Identifier: Schema.Schema<Identifier>;
export declare const Reference: Schema.Schema<Reference>;
export declare const UsageContext: Schema.Struct<{
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
            readonly value?: string | undefined;
            readonly system?: string | undefined;
            readonly use?: "usual" | "official" | "temp" | "secondary" | "old" | undefined;
            readonly period?: {
                readonly start?: string | undefined;
                readonly end?: string | undefined;
            } | undefined;
            readonly type?: {
                readonly text?: string | undefined;
                readonly coding?: readonly {
                    readonly code?: string | undefined;
                    readonly system?: string | undefined;
                    readonly version?: string | undefined;
                    readonly display?: string | undefined;
                    readonly userSelected?: boolean | undefined;
                }[] | undefined;
            } | undefined;
            readonly assigner?: Reference | undefined;
        }, {
            readonly value?: string | undefined;
            readonly system?: string | undefined;
            readonly use?: "usual" | "official" | "temp" | "secondary" | "old" | undefined;
            readonly period?: {
                readonly start?: string | undefined;
                readonly end?: string | undefined;
            } | undefined;
            readonly type?: {
                readonly text?: string | undefined;
                readonly coding?: readonly {
                    readonly code?: string | undefined;
                    readonly system?: string | undefined;
                    readonly version?: string | undefined;
                    readonly display?: string | undefined;
                    readonly userSelected?: boolean | undefined;
                }[] | undefined;
            } | undefined;
            readonly assigner?: Reference | undefined;
        }, never>, {
            exact: true;
        }>;
        display: Schema.optionalWith<typeof Schema.String, {
            exact: true;
        }>;
    }>, {
        exact: true;
    }>;
}>;
export type UsageContext = typeof UsageContext.Type;
