import createClient from "openapi-fetch";
import type { paths } from "@medfetch.js/api/types";

export const api = createClient<paths>({
  baseUrl: process.env.NEXT_PUBLIC_API_URL!
})