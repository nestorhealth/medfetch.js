import {createEnv} from "@t3-oss/env-core";
import {z} from "zod";

export const env = createEnv({
    server: {},
    clientPrefix: "NEXT_PUBLIC",
    client: {
        NEXT_PUBLIC_API_URL: z.string().optional().default(
            process.env.NODE_ENV === "development"
            ? "http://localhost:8787" : "https://api.medfetch.io",
        ),
        NEXT_PUBLIC_FHIR_API_URL: z.string().optional().default(
            process.env.NODE_ENV === "development"
            ? "http://localhost:8787/fhir" : "https://api.medfetch.io/fhir"
        )
    },
    runtimeEnv: process.env
})