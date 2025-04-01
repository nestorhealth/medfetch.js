import { OpenAI } from "openai";
import fs from "fs";

const openai = new OpenAI();
const TVF_SCHEMA = "CREATE TABLE x(id TEXT NOT NULL, json TEXT NOT NULL)";

const SQL_ASSISTANT_ID = "asst_iHAHkpCWPIA8v5tqrrypx7p7";
const SCHEMA_VECTOR_STORE_ID = "vs_67eb8d8d66f88191b9a355c2a0c70fd8";

const fileStreams = ["fhir.schema.json"].map((path) => fs.createReadStream(path));
let sqlAssistant = await openai.beta.assistants.retrieve(SQL_ASSISTANT_ID);
const vectorStore = await openai.vectorStores.retrieve(SCHEMA_VECTOR_STORE_ID);

await openai.vectorStores.fileBatches.uploadAndPoll(vectorStore.id, fileStreams as any);
console.log('rout');
// sqlAssistant = await openai.beta.assistants.update(sqlAssistant.id, {
//   tool_resources: { file_search: { vector_store_ids: [vectorStore.id] } },
// });

//
// const userExampleCTAS = await openai.files.create({
//     file: fs.createReadStream("sql/example-ctas.sql"),
//     purpose: "assistants"
// });
//
// const thread = await openai.beta.threads.create({
//     messages: [
//         {
//             role: "user",
//             content: "Get me all patients that are female",
//             attachments: [{ file_id: userExampleCTAS.id, tools: [{ type: "file_search" }] }]
//         }
//     ]
// });
//
// const stream = openai.beta.threads.runs
//     .stream(thread.id, {
//         assistant_id: sqlAssistant.id,
//     })
//     .on("textCreated", () => console.log("assistant >"))
//     .on("toolCallCreated", (event) => console.log("assistant " + event.type))
//     .on("messageDone", async (event) => {
//         console.log(JSON.stringify(event, null, 2))
//     })
