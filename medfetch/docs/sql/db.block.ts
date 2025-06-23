import block from "~/block-promise/block";

export const [syncFetch, setSyncFetch] = block(
  ["db.worker", "db.block"],
  (...args: Parameters<typeof fetch>) => 
    fetch(...args)
    .then(res => res.json())
    .then(JSON.stringify)
)