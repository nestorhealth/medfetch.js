import { Data, Effect, Schema } from "effect";
import getPkce from "oauth-pkce";

type AuthErrorCause = 
    | "BAD_SMART_CONFIG_RESPONSE"
    | "BAD_SMART_CONFIG_BODY"
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

const SmartConfiguration = Schema.Struct({
    authorization_endpoint: Schema.String.annotations({ 
        documentation: "Where to direct users to authenticate."
    }),
    token_endpoint: Schema.String.annotations({
        documentation: "Where to POST back the `code` search param from the redirect query params."
    })
});
type SmartConfiguration = typeof SmartConfiguration.Type;
const decodeSmartConfiguration = SmartConfiguration.pipe(Schema.decodeUnknown);

const TokenResponseBody = Schema.Struct({
    access_token: Schema.String,
    expires_in: Schema.Number,
    scope: Schema.String
});
export type TokenResponseBody = typeof TokenResponseBody.Type;
const decodeTokenResponseBodySync = TokenResponseBody.pipe(Schema.decodeUnknownSync);

/**
 * GET `{@link base_url}/.well-known/smart-configuration`
 * @param base_url The FHIR server base URL
 * @returns The {@link SmartConfiguration}
 */
function smartConfig(base_url: string) {
    const url = `${base_url}/.well-known/smart-configuration`;
    const req = () => fetch(url);
    return Effect.tryPromise(req).pipe(
        Effect.andThen(
            Effect.liftPredicate(
                (response) => response.ok,
                (response) => new DataAuthError({
                    cause: "BAD_EXCHANGE_RESPONSE",
                    message: `Fetch request to ${url} responded with status ${response.status}`
                })
            )
        ),
        Effect.andThen(
            response => Effect.promise(() => response.json())
        ),
        Effect.andThen(decodeSmartConfiguration)
    )
}

/**
 * Run the {@link smartConfig} effect as a Promise
 * @param args The args for {@link smartConfig}
 * @returns The SMART configuration of the fhir server
 */
async function getSmartConfig(...args: Parameters<typeof smartConfig>): Promise<SmartConfiguration> {
    return smartConfig(...args).pipe(Effect.runPromise);
}

/**
 * Generates a PKCE challenge + verifier and constructs the sign-in URL from that along with...
 * @param base_url The base URL of the FHIR server
 * @param client_id Your issued client id
 * @param redirect_uri Whatever redirect url you registered
 * @param scope Either the scope string or the scope tokens in an array
 */
export function pkce(
    base_url: string,
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

    async function getRedirectURL(): Promise<string> {
        const { authorization_endpoint } = await getSmartConfig(base_url);
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
        const url = `${authorization_endpoint}?${query.toString()}`;
        return url;
    }
    
    async function exchange(code: string) {
        const { token_endpoint } = await getSmartConfig(base_url);
        const verifier = sessionStorage.getItem("pkce_verifier");
        if (!verifier)
            throw new DataAuthError({ cause: "NO_VERIFIER", message: "No PKCE verifier to exchange" });
        const query = exchangeParams(oauth2Args(), code, verifier);
        const response = await fetch(token_endpoint, {
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
        return decodeTokenResponseBodySync(token);
    }
    
    return { getRedirectURL, exchange };
}
