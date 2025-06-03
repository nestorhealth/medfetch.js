"use client";

import React, { useState, useCallback, useRef } from 'react';
import { MedfetchClient, initMedfetchDB } from 'medfetch';
import ChatUI from '@/components/ChatUI';
import dynamic from 'next/dynamic';
import type { ColDef, GridReadyEvent } from 'ag-grid-community';

// Dynamically import AG Grid to avoid SSR issues
const AgGridReact = dynamic(() => import('ag-grid-react').then(mod => mod.AgGridReact), {
  ssr: false
});

// Import AG Grid styles
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

interface QueryResult {
  id: string;
  timestamp: number;
  sql: string;
  data: any[];
  error?: string;
}

export default function ChatPage() {
  const [db, setDb] = useState<MedfetchClient | null>(null);
  const [queryHistory, setQueryHistory] = useState<QueryResult[]>([]);
  const [currentResult, setCurrentResult] = useState<QueryResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const gridRef = useRef<any>(null);

  // Initialize database on component mount
  React.useEffect(() => {
    const initDb = async () => {
      try {
        const database = await initMedfetchDB();
        setDb(database);
      } catch (error) {
        console.error('Failed to initialize database:', error);
      }
    };
    initDb();
  }, []);

  // Handle SQL query execution
  const handleQuery = useCallback(async (sql: string) => {
    if (!db) return;

    const queryId = Date.now().toString();
    setIsLoading(true);

    try {
      // Execute the query
      const result = await db.db.prepare(sql).all();
      
      // Create new query result
      const queryResult: QueryResult = {
        id: queryId,
        timestamp: Date.now(),
        sql,
        data: result
      };

      // Update state
      setQueryHistory(prev => [...prev, queryResult]);
      setCurrentResult(queryResult);

      // Auto-size columns after data is loaded
      if (gridRef.current?.api) {
        setTimeout(() => {
          gridRef.current.api.sizeColumnsToFit();
        }, 0);
      }
    } catch (error) {
      const errorResult: QueryResult = {
        id: queryId,
        timestamp: Date.now(),
        sql,
        data: [],
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
      setQueryHistory(prev => [...prev, errorResult]);
      setCurrentResult(errorResult);
    } finally {
      setIsLoading(false);
    }
  }, [db]);

  // Generate column definitions based on data
  const getColumnDefs = useCallback(() => {
    if (!currentResult?.data.length) return [];

    const firstRow = currentResult.data[0];
    return Object.keys(firstRow).map(key => ({
      field: key,
      sortable: true,
      filter: true,
      resizable: true
    })) as ColDef[];
  }, [currentResult]);

  // Handle grid ready event
  const onGridReady = useCallback((params: GridReadyEvent) => {
    gridRef.current = params;
    if (currentResult?.data.length) {
      params.api.sizeColumnsToFit();
    }
  }, [currentResult]);

  // Handle window resize
  React.useEffect(() => {
    const handleResize = () => {
      if (gridRef.current?.api) {
        gridRef.current.api.sizeColumnsToFit();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!db) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Initializing database...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm p-4">
        <h1 className="text-2xl font-semibold text-gray-800">Medfetch Chat</h1>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat Panel */}
        <div className="w-1/2 border-r border-gray-200 flex flex-col">
          <ChatUI 
            db={db} 
            onQuery={handleQuery}
          />
        </div>

        {/* Results Panel */}
        <div className="w-1/2 flex flex-col">
          {/* Query History */}
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold mb-2">Query History</h2>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {queryHistory.map(result => (
                <div
                  key={result.id}
                  className={`p-2 rounded cursor-pointer ${
                    currentResult?.id === result.id
                      ? 'bg-blue-100 border-blue-500'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                  onClick={() => setCurrentResult(result)}
                >
                  <div className="text-sm font-mono truncate">{result.sql}</div>
                  <div className="text-xs text-gray-500">
                    {new Date(result.timestamp).toLocaleTimeString()}
                    {result.error && (
                      <span className="text-red-500 ml-2">Error: {result.error}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Data Grid */}
          <div className="flex-1 p-4">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Executing query...</p>
                </div>
              </div>
            ) : currentResult ? (
              <div className="h-full ag-theme-alpine">
                <AgGridReact
                  rowData={currentResult.data}
                  columnDefs={getColumnDefs()}
                  onGridReady={onGridReady}
                  defaultColDef={{
                    flex: 1,
                    minWidth: 100,
                    filter: true,
                    sortable: true,
                    resizable: true
                  }}
                  animateRows={true}
                  enableCellTextSelection={true}
                  suppressRowClickSelection={true}
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                No query results to display
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 