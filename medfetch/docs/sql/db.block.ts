import unpromisify from "~/unpromisify";

export const [syncFetch, setSyncFetch] = unpromisify(
  "db.worker",
  (...args: Parameters<typeof fetch>) => 
    fetch(...args)
    .then(res => res.text()),
);

setSyncFetch();