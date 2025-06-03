import { Chunk, Effect, pipe, Stream } from "effect";
import { pages } from "./data";
import { flat } from "./sof";
import { ViewDefinition, Column } from "./view";

export { flat };
export { initMedfetchDB, type MedfetchClient, type MedfetchDB } from "./client";
export { pkce } from "./data";
export {
    normalize,
    Select,
    ForEach,
    ForEachOrNull,
    UnionAll,
    ColumnPath
} from "./view";
export type {
    Node,
    Constant,
} from "./view";
export { ViewDefinition, Column };

type Last<Path extends string> = Path extends `${infer _}.${infer Rest}`
    ? Last<Rest>
    : Path;

type Flattened<Fields extends readonly string[]> = {
    [K in Fields[number] as Last<K>]: unknown;
};

function last<Path extends string>(path: string): Last<Path> {
    return pipe(
        path.split("."),
        (split) => split[split.length - 1],
    ) as Last<Path>;
}

function keysToViewDefinition<Keys extends readonly string[]>(
    resourceType: string,
    keys: readonly [...Keys],
): ViewDefinition {
    return ViewDefinition({
        resource: resourceType,
        status: "active",
        select: [
            Column({
                column: keys.map((key) =>
                    ({
                        path: key,
                        name: last(key),
                    }),
                ),
            }),
        ],
    });
}

export type SofFn = <ResourceType extends string, Keys extends readonly string[]>(
    resourceType: ResourceType,
    keys: readonly [...Keys],
) => Promise<Flattened<Keys>[]>;
/**
 * Get an in-memory sql-on-fhir runner (aka View Runner)
 * @param baseURL The FHIR server base
 * @returns sof The sql-on-fhir runner, which is just a function
 */
export function medfetch(baseURL: string): SofFn {
    return async function sof<
        ResourceType extends string,
        Keys extends readonly string[],
    >(
        resourceType: ResourceType,
        keys: readonly [...Keys],
    ): Promise<Flattened<Keys>[]> {
        return pages(baseURL, resourceType).pipe(
            // Bundle.entry.resource
            Stream.map((bundle) => bundle.entry.map((entry) => entry.resource)),
            Stream.flattenIterables,
            Stream.filter((resource) => !!resource),
            Stream.runCollect,
            Effect.andThen(Chunk.toArray),
            // Flatten it
            Effect.andThen(
                (data) =>
                    flat(
                        data,
                        keysToViewDefinition(resourceType, keys),
                    ) as Flattened<Keys>[],
            ),
            // Run through Promise
            Effect.runPromise,
        );
    };
}
