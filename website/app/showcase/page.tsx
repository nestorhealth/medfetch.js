"use client";
import { medDB } from "@/lib/client";
import Link from "next/link";
import { useEffect } from "react";

export default function Showcase() {
  useEffect(() => {
    const result = medDB.prepare("select * from \"Patient\"").all();
    Promise.resolve(result).then(
      (result) => console.log("OK", result)
    )
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
