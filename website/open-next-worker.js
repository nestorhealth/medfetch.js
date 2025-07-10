import handler from "./.open-next/worker.js";

export default {
  async fetch(request, env, ctx) {
    const response = await handler.fetch(request, env, ctx);
    const newResponse = new Response(response.body, response);
    newResponse.headers.set("Cross-Origin-Embedder-Policy", "require-corp");
    newResponse.headers.set("Cross-Origin-Opener-Policy", "same-origin");
    
    return newResponse;
  },
};
