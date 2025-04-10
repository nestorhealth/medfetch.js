import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Effect, Stream } from 'effect';
import { sqliteow } from "sqliteow";
import { Sqlite3PromiserLazy } from "sqliteow/services";

async function sqlite3(queryIterator: () => Generator<string>) {
  const a = sqliteow();
  const b = await a({ type: "exec", args: { sql: "" } });
  const c = await a("exec")
  return Effect.gen(function* () {
    const lazy = yield* Sqlite3PromiserLazy;
    lazy({ type: "exec" });
    const b = yield* lazy({ type: 'exec'});
    const stream: Stream.Stream = Stream.fromIterable(queryIterator()).pipe(
      Stream.mapEffect(
        (query) => lazy({
          type: "exec",
          args: {
            sql: query,
            rowMode: "object"
          }
        })
      )
    );
    return stream;
  })
}

function App() {
  const [count, setCount] = useState(0)
  const session = sqlite3(function *() {
    yield "create table foo (id TEXT);";
    yield "insert into foo values ('id1');";
  });

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
