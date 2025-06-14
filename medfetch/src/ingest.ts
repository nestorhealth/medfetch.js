import run, { ConnectorResult } from './connector';
import { CleanLog } from './d1';
import { D1DatabaseWrapper } from './d1-wrapper';

interface Env {
  CLEAN_LOG: D1Database;
  FHIR_BASE_URL: string;
  MANIFEST_URL?: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    
    // Handle POST requests for ingestion
    if (request.method === 'POST') {
      try {
        const events = await request.json() as any[];
        const db = new D1DatabaseWrapper(env.CLEAN_LOG);
        const cleanLog = new CleanLog(db);
        
        const result = await run(events, { 
          db,
          env: {
            FHIR_BASE_URL: env.FHIR_BASE_URL,
            MANIFEST_URL: env.MANIFEST_URL
          }
        });
        
        return new Response(JSON.stringify(result), {
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      } catch (error) {
        console.error('Error processing events:', error);
        return new Response(
          JSON.stringify({ error: 'Failed to process events' }),
          { 
            status: 500, 
            headers: { 
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            } 
          }
        );
      }
    }
    
    // Handle GET requests for run history
    if (request.method === 'GET') {
      const db = new D1DatabaseWrapper(env.CLEAN_LOG);
      
      // List all runs
      if (url.pathname === '/runs') {
        try {
          const { results } = await db.prepare(`
            SELECT DISTINCT run_id, 
                   MIN(timestamp) as start_time,
                   COUNT(*) as resource_count,
                   COUNT(CASE WHEN resource_type = 'Patient' THEN 1 END) as patient_count,
                   COUNT(CASE WHEN resource_type = 'Procedure' THEN 1 END) as procedure_count
            FROM clean_log
            GROUP BY run_id
            ORDER BY start_time DESC
          `).all<{
            run_id: string;
            start_time: string;
            resource_count: number;
            patient_count: number;
            procedure_count: number;
          }>();

          return new Response(JSON.stringify(results), {
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            }
          });
        } catch (error) {
          console.error('Error fetching runs:', error);
          return new Response(
            JSON.stringify({ error: 'Failed to fetch runs' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
          );
        }
      }
      
      // Get specific run
      if (url.pathname.startsWith('/runs/')) {
        const runId = url.pathname.split('/')[2];
        if (!runId) {
          return new Response('Missing run ID', { status: 400 });
        }

        try {
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