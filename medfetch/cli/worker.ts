/// <reference types="@cloudflare/workers-types" />
import { CleanLog } from './d1';
import { D1DatabaseWrapper } from './d1-wrapper';

interface Env {
  DB: D1Database;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    
    // Handle /runs/:runId endpoint
    if (url.pathname.startsWith('/runs/')) {
      const runId = url.pathname.split('/')[2];
      if (!runId) {
        return new Response('Missing run ID', { status: 400 });
      }

      try {
        const db = new D1DatabaseWrapper(env.DB);
        const cleanLog = new CleanLog(db);
        const resources = await cleanLog.getRunResources(runId);
        
        return new Response(JSON.stringify(resources), {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      } catch (error) {
        console.error('Error fetching run resources:', error);
        return new Response(
          JSON.stringify({ error: 'Failed to fetch run resources' }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    // Handle root endpoint
    if (url.pathname === '/') {
      return new Response('MedFetch API', {
        headers: { 'Content-Type': 'text/plain' }
      });
    }

    // Handle 404
    return new Response('Not Found', { status: 404 });
  }
}; 