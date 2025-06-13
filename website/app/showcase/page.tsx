"use client";
import Link from "next/link";
import { db } from "@/lib/sqlite-wasm";
import { useEffect } from "react";

export default function Showcase() {
  useEffect(() => {
    async function init() {
      const result = await db.selectFrom("Patient").selectAll("Patient").execute();
      console.log("UH", result)
    }
    
    init();
  })
  return (
    <main>
      <div>
        <h1>Welcome to the Showcase page</h1>
        <p>
          Here are some examples of using Medfetch in a web app
        </p>
        <ol>
          <li>
            <Link href="/showcase/researcher">
              Researcher Spreadsheet
            </Link>
          </li>
        </ol>
      </div>
    </main>
  );
}
