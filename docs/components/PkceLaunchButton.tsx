"use client";
import { Button } from "@/components/ui/button"
import { useSearchParams } from "next/navigation";
import { pkce } from "medfetch"
import { useEffect } from "react";

const SANDBOX_CONFIG = {
    base_url: "https://launch.smarthealthit.org/v/r4/sim/WzIsIiIsIiIsIkFVVE8iLDAsMCwwLCIiLCIiLCJ3aGF0ZXZlciIsIiIsIiIsIiIsIiIsMCwyLCIiXQ/fhir",
    authorize_url: "https://launch.smarthealthit.org/v/r4/sim/WzIsIiIsIiIsIkFVVE8iLDAsMCwwLCIiLCIiLCJ3aGF0ZXZlciIsIiIsIiIsIiIsIiIsMCwyLCIiXQ/auth/authorize",
    token_url: "https://launch.smarthealthit.org/v/r4/sim/WzIsIiIsIiIsIkFVVE8iLDAsMCwwLCIiLCIiLCJ3aGF0ZXZlciIsIiIsIiIsIiIsIiIsMCwyLCIiXQ/auth/token",
    client_id: "whatever",
    redirect_uri: "http://localhost:3000/cookbook/oauth2",
    scope: ["user/*.cruds"]
}

export function PkceLaunchButton() {
  const { redirect, exchange } = pkce(
    SANDBOX_CONFIG.base_url,
    SANDBOX_CONFIG.authorize_url,
    SANDBOX_CONFIG.token_url,
    SANDBOX_CONFIG.client_id,
    SANDBOX_CONFIG.redirect_uri,
    SANDBOX_CONFIG.scope
  );
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  useEffect(() => {
    if (code) {
      exchange().then((token) => {
        console.log("✅ got token:", token);
      }).catch((err) => {
        console.error("❌ token exchange failed", err);
      })
      .finally(() => {
        window.history.replaceState({}, "", window.location.pathname);
      })
    }
  }, [code, exchange]);
  
  return (<Button onClick={redirect}>Launch redirect</Button>)
}