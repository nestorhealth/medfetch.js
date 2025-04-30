import { Data } from "effect";
import getPkce from "oauth-pkce";

type AuthErrorCause = 
    | "NO_VERIFIER"
    | "NO_CODE_IN_REDIRECT"
    | "BAD_EXCHANGE_RESPONSE"
    | "UNKNOWN";

interface AuthError {
    readonly cause: AuthErrorCause;
    readonly message?: string;
};

class DataAuthError extends Data.TaggedError("data/AuthError")<AuthError> {
    constructor({ cause, message }: AuthError) {
        super({
            cause,
            message: `[data/AuthError]: ${message ?? "Unknown error :("}`
        });
    }
}

/**
 * The arguments the user is responsible for providing for a
 * full [PKCE launch flow](https://hl7.org/fhir/smart-app-launch/example-app-launch-public.html) with SMART on FHIR.
 */
interface OAuth2ClientArgs {
    /**
     * This is the base_url of the FHIR server
     */
    aud: string;

    /**
     * Standard issued client id
     */
    client_id: string;

    /**
     * Standard registered redirect_uri
     */
    redirect_uri: string;

    /**
     * FHIR scopes, which may be particular to the given server
     */
    scope: string;

    /**
     * PKCE code challenge
     */
    code_challenge: string;
}

function launchParams({ client_id, scope, redirect_uri, aud, code_challenge }: OAuth2ClientArgs) {
    return new URLSearchParams([
        ["response_type", "code"],
        ["client_id", client_id],
        ["scope", scope],
        ["redirect_uri", redirect_uri],
        ["aud", aud],
        ["code_challenge", code_challenge],
        ["code_challenge_method", "S256"],
    ]);
}

function exchangeParams({ client_id, redirect_uri, }: OAuth2ClientArgs, code: string, verifier: string) {
    return new URLSearchParams([
        ["client_id", client_id],
        ["code", code],
        ["grant_type", "authorization_code"],
        ["redirect_uri", redirect_uri],
        ["code_verifier", verifier],
    ]);
}

/**
 * Generates a PKCE challenge + verifier and constructs the sign-in URL from that along with...
 */
export function pkce(
    base_url: string,
    authorize_url: string,
    token_url: string,
    client_id: string,
    redirect_uri: string,
    scope: string | string[],
) {
    const oauth2Args = (challenge?: string): OAuth2ClientArgs => ({
        aud: base_url,
        client_id: client_id,
        redirect_uri: redirect_uri,
        scope: Array.isArray(scope) ? scope.join(" ") : scope,
        code_challenge: challenge ?? "BAD_CHALLENGE",
    });
    async function redirect(): Promise<void> {
        // generate random bytes + verifier
        const { verifier, challenge } = await new Promise<{
            verifier: string;
            challenge: string;
        }>((resolve) => {
            getPkce(43, (error, { verifier, challenge }) => {
                if (error) throw error;
                resolve({ verifier, challenge });
            });
        });
        // save verifier to session storage
        sessionStorage.setItem("pkce_verifier", verifier);

        // launch URLSearchParams
        const query = launchParams(oauth2Args(challenge));
        const redirectTo = `${authorize_url}?${query.toString()}`;
        window.location.href = redirectTo;
        return void 0;
    }
    
    async function exchange() {
        const verifier = sessionStorage.getItem("pkce_verifier");
        if (!verifier)
            throw new DataAuthError({ cause: "NO_VERIFIER", message: "No PKCE verifier to exchange" });
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");
        if (!code)
            throw new DataAuthError({ cause: "NO_CODE_IN_REDIRECT", message: `Invalid query params in redirect from ${base_url}` })
        const query = exchangeParams(oauth2Args(), code, verifier);
        const response = await fetch(token_url, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: query
        });
        if (!response.ok) {
            const text = await response.text();
            console.error(`[medfetch/data.auth]: token exchange failed with status ${response.status}. Response payload ${text}`);
            throw new DataAuthError({ cause: "BAD_EXCHANGE_RESPONSE", message: `Token exchange returned status ${response.status}` });
        }
        const token = await response.json();
        return token;
    }
    
    return { redirect, exchange };
}
