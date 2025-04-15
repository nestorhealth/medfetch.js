// Export select 'leaf' builder

import { pages } from "./data";

import { flat } from "./sof";
export { flat };

import { viewDefinition } from "./view";
export { viewDefinition };

import { columnPath, Column as column } from "./view";
export { columnPath, column };


export { 
    normalize,
    Select as select,
    ForEach as forEach,
    ForEachOrNull as forEachOrNull,
    UnionAll as unionAll,
} from "./view";

export type { 
    ViewDefinition, 
    ColumnPath, 
    Node,
    Column,
    Select,
    ForEach,
    ForEachOrNull,
    UnionAll,
    Constant
} from "./view";

import { Chunk, Effect, pipe, Stream } from "effect";

type Last<Path extends string> = 
    Path extends `${infer _}.${infer Rest}`
    ? Last<Rest>
    : Path;

type Flattened<Fields extends readonly string[]> = {
    [K in Fields[number] as Last<K>]: unknown;
};

function last<Path extends string>(path: string): Last<Path> {
    return pipe(
        path.split("."),
        split => split[split.length - 1]
    ) as Last<Path>;
}

function keysToViewDefinition<Keys extends readonly string[]>(resourceType: string, keys: readonly [...Keys]) {
    return viewDefinition({
        resource: resourceType,
        status: "active",
        select: [
            column({
                column: keys.map((key) => columnPath({
                    path: key,
                    name: last(key)
                }))
            })
        ]
    })
}

export default function medfetch(baseURL: string) {
    return async function sof<
        ResourceType extends string,
        Keys extends readonly string[],
    >(resourceType: ResourceType, keys: readonly [...Keys]): Promise<Flattened<Keys>[]> {
        return pages(baseURL, resourceType).pipe(
            // Bundle.entry.resource
            Stream.map(
                (bundle) => bundle.entry.map((entry) => entry.resource)
            ),
            Stream.flattenIterables,
            Stream.filter(
                (resource) => !!resource
            ),
            Stream.runCollect,
            Effect.andThen(
                Chunk.toArray
            ),
            // Flatten it
            Effect.andThen((data) => flat(data, keysToViewDefinition(resourceType, keys)) as Flattened<Keys>[]),
            // Run through Promise
            Effect.runPromise
        );
    }
}

const sof = medfetch("https://r4.smarthealthit.org");
const results = await sof("Patient", [
    "id",
    "name",
    "birthDate"
]);

console.log("got", results);

