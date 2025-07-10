import type { JSONSchema7 } from "json-schema";
import {unzipSync, strFromU8} from "fflate";

/**
 * Fetch the JSON schema and get back the parsed version from a zipfile
 * @param zipURL URL of the zip endpoint, defaults to the core fhir schema json zip file from the CI build
 * @param filename Optionally pass in filename
 * @returns The JSON parsed JSON schema object
 */
export async function unzipJSONSchema(
    zipURL: string = "https://build.fhir.org/fhir.schema.json.zip",
    filename: string = "fhir.schema.json",
): Promise<JSONSchema7> {
    const response = await fetch(zipURL).catch((error) => {
        console.error(`Couldn't handle "fetch" request: ${error}`);
        throw new Error();
    });
    if (!response.ok) {
        console.error(`Bad response from endpoint: ${zipURL}`, response.status);
        throw new Error();
    }

    const entries = unzipSync(new Uint8Array(await response.arrayBuffer()));
    const schemaFile = entries[filename];
    if (!schemaFile) {
        console.error(
            `Schema file ${filename} not found in unzipped. Keys are: ${Object.keys(entries)}`,
        );
        throw new Error();
    }

    try {
        const parsed: JSONSchema7 = JSON.parse(strFromU8(schemaFile));
        return parsed;
    } catch (error) {
        const msg = `Couldn't parse the JSON file ${filename}: ${error}`;
        throw new Error(msg);
    }
}
