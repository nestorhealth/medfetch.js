import { OpenAI } from "openai";
import { FunctionDefinition } from "openai/resources.mjs";

const openai = new OpenAI();

const get_data_dependencies_sql: FunctionDefinition = {
    name: "get_data_dependencies_sql",
    description: ""
}

const assistant = await openai.beta.assistants.create({
    model: "gpt-4o",
    name: "SQL Emitter",
    tools: [{ type: "function",  }],
});
