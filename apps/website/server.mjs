import handler from "serve-handler";
import http from "http";

const server = http.createServer((request, response) => {
  // Set global headers
  response.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  response.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  response.setHeader('Access-Control-Allow-Origin', '*');

  // Delegate to serve-handler
  return handler(request, response, {
    public: './out' // or your directory
  });
});

server.listen(3000, () => {
  console.log('Running at http://localhost:3000');
});