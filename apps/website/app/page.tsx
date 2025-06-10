import Link from "next/link";

export default function IndexPage() {
  return (
    <main>
      <h1>Data fetching made easy with Medfetch</h1>
      <p>This page is under construction. Here are some working links:</p>
      <ol>
        <li>
          <Link href="/docs">
          Documentation
          </Link>
        </li>
        <li>
          <Link href="/showcase">
          Showcase
          </Link>
        </li>
      </ol>
    </main>
  );
}