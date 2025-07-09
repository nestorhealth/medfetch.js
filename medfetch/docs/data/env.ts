/**
 * Medfetch FHIR API URL so we don't have to make it an env var
 */
export const API_URL = import.meta.env.DEV
    ? "http://localhost:8787/fhir"
    : "https://api.medfetch.io/fhir";