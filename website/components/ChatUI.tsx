"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { api } from '@/lib/api';
import { Send, MessageSquare, Database, AlertCircle, CheckCircle, Copy, Play } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  summary?: string;
  sql?: string;
  error?: string;
}

interface ChatUIProps {
  onQuery: (sql: string) => Promise<void>;
}

export default function ChatUI({ onQuery }: ChatUIProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response2 = await api.POST("/nl2sql", {
        body: {
          query: userMessage.content
        }
      });
      if (response2.error) {
        throw new Error(response2.error.error);
      }
      const data = response2.data;
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.summary || '',
        summary: data.summary,
        sql: data.sql,
        error: data.error
      };

      setMessages(prev => [...prev, assistantMessage]);

      if (data.sql && !data.error) {
        await onQuery(data.sql);
      }
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Error: Failed to process your request',
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const executeSQL = async (sql: string) => {
    try {
      await onQuery(sql);
    } catch (error) {
      console.error('Failed to execute SQL:', error);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-500/20 rounded-lg p-2">
            <MessageSquare className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Data Assistant</h2>
            <p className="text-sm text-slate-400">Ask questions about your data in natural language</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-slate-800/50 rounded-xl p-8 max-w-md mx-auto">
              <Database className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Start a Conversation</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Ask me anything about your data. I'll help you generate SQL queries and analyze your results.
              </p>
              <div className="mt-6 space-y-2 text-xs text-slate-500">
                <p>• "Show me pediatric patients over 18 years old admitted in the US after 2015 with
                tibial shaft fractures"</p>
                <p>• "Add age group breakdowns: 0-5, 6-12, 13-18. Include race, gender, and ethnicity"</p>
                <p>• "Find patients older than 65"</p>
              </div>
            </div>
          </div>
        )}

        {messages.map(message => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800/70 backdrop-blur-sm border border-slate-700'
              }`}
            >
              {message.role === 'user' ? (
                <div className="px-4 py-3">
                  <p className="text-white">{message.content}</p>
                </div>
              ) : (
                <div className="p-4 space-y-4">
                  {message.summary && (
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-white font-medium mb-1">Analysis Complete</p>
                        <p className="text-slate-300 text-sm leading-relaxed">{message.summary}</p>
                      </div>
                    </div>
                  )}

                  {message.sql && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Database className="h-4 w-4 text-blue-400" />
                          <span className="text-sm font-medium text-slate-300">Generated SQL</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => copyToClipboard(message.sql!)}
                            className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors"
                          >
                            <Copy className="h-4 w-4 text-slate-400" />
                          </button>
                          <button
                            onClick={() => executeSQL(message.sql!)}
                            className="p-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors"
                          >
                            <Play className="h-4 w-4 text-white" />
                          </button>
                        </div>
                      </div>
                      <div className="rounded-xl overflow-hidden border border-slate-600">
                        <SyntaxHighlighter
                          language="sql"
                          style={tomorrow}
                          customStyle={{
                            margin: 0,
                            fontSize: '0.875rem',
                            background: '#1e293b',
                            padding: '1rem'
                          }}
                        >
                          {message.sql}
                        </SyntaxHighlighter>
                      </div>
                    </div>
                  )}

                  {message.error && (
                    <div className="flex items-start space-x-3 bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                      <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-red-400 font-medium mb-1">Error Occurred</p>
                        <p className="text-red-300 text-sm">{message.error}</p>
                      </div>
                    </div>
                  )}

                  {!message.summary && !message.sql && !message.error && (
                    <div className="text-slate-300">{message.content}</div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-800/70 backdrop-blur-sm border border-slate-700 rounded-2xl p-4">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-400 border-t-transparent"></div>
                <span className="text-slate-300">Analyzing your question...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-slate-800/50 backdrop-blur-sm border-t border-slate-700 p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question about your data..."
              className="w-full rounded-xl border border-slate-600 bg-slate-900/50 text-white px-4 py-3 pr-12 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 placeholder-slate-400 transition-all"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-all ${
                isLoading || !input.trim()
                  ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-blue-500/25'
              }`}
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
          
          <div className="flex items-center justify-between text-xs text-slate-500">
            <p>Press Enter to send your message</p>
            <p>{input.length} characters</p>
          </div>
        </form>
      </div>
    </div>
  );
}