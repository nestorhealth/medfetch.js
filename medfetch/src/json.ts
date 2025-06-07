import { strFromU8, unzipSync } from "fflate";

/**
 * Fetch the JSON schema and get back the parsed version from a zipfile
 * @param zipURL URL of the zip endpoint, defaults to the core fhir schema json zip file from the CI build
 * @param filename Optionally pass in filename
 * @returns The JSON parsed JSON schema object
 */
export async function jsonSchemaFromZip(
    zipURL: string = "https://build.fhir.org/fhir.schema.json.zip",
    filename = "fhir.schema.json"
): Promise<object> {
    const response = await fetch(zipURL).catch((error) => {
        console.error(`Couldn't handle "fetch" request: ${error}`);
        process.exit(1);
    });
    if (!response.ok) {
        console.error(`Bad response from endpoint: ${zipURL}`, response.status);
        process.exit(1);
    }

    const entries = unzipSync(new Uint8Array(
        await response.arrayBuffer()
    ));
    const schemaFile = entries[filename];
    if (!schemaFile) {
        console.error(`Schema file ${filename} not found in unzipped. Keys are: ${Object.keys(entries)}`);
        process.exit(1);
    }
    
    try {
        return JSON.parse(strFromU8(schemaFile));
    } catch (error) {
        console.error(`Couldn't parse the JSON file ${filename}: ${error}`);
        process.exit(1);
    }
}
