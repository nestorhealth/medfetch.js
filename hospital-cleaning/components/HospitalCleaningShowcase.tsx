import React, { useState, useEffect, useCallback } from 'react';
import { detectAnomalies, generateRunSummary } from '../utils/aiProcessing';
import type { Patient, Procedure } from '../utils/fhirProcessing';
import type { AnomalyDetection, RunSummary } from '../utils/aiProcessing';

interface Props {
  initialData: (Patient | Procedure)[];
}

export function HospitalCleaningShowcase({ initialData }: Props) {
  const [originalResources, setOriginalResources] = useState<(Patient | Procedure)[]>(initialData);
  const [cleanedResources, setCleanedResources] = useState<(Patient | Procedure)[]>([]);
  const [anomalies, setAnomalies] = useState<AnomalyDetection[]>([]);
  const [summary, setSummary] = useState<RunSummary | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCleaning, setIsCleaning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'original' | 'cleaned'>('original');

  // Process resources and detect anomalies
  useEffect(() => {
    let isMounted = true;
    async function processResources() {
      if (!isMounted) return;
      setIsProcessing(true);
      setError(null);
      try {
        console.log('Starting to process resources:', originalResources.length);
        // Detect anomalies for each resource
        const allAnomalies: AnomalyDetection[] = [];
        for (const resource of originalResources) {
          if (!isMounted) return;
          try {
            console.log(`Processing resource ${resource.id} (${resource.resourceType})`);
            const resourceAnomalies = await detectAnomalies(resource);
            console.log(`Found ${resourceAnomalies.length} anomalies for resource ${resource.id}`);
            allAnomalies.push(...resourceAnomalies);
          } catch (resourceError) {
            console.error(`Error processing resource ${resource.id}:`, resourceError);
            if (isMounted) {
              setError(prev => 
                prev ? `${prev}\nError processing ${resource.resourceType} ${resource.id}: ${resourceError instanceof Error ? resourceError.message : 'Unknown error'}` 
                : `Error processing ${resource.resourceType} ${resource.id}: ${resourceError instanceof Error ? resourceError.message : 'Unknown error'}`
              );
            }
          }
        }
        if (isMounted) {
          setAnomalies(allAnomalies);
          if (allAnomalies.length > 0) {
            console.log('Generating run summary with anomalies:', allAnomalies.length);
            const runSummary = await generateRunSummary(originalResources, allAnomalies);
            setSummary(runSummary);
          } else {
            console.log('No anomalies found, skipping summary generation');
            setSummary({
              text: 'No anomalies were detected in the data.',
              stats: {
                totalRecords: originalResources.length,
                cleanedRecords: originalResources.length,
                anomaliesFound: 0,
                suggestionsApplied: 0
              }
            });
          }
        }
      } catch (err) {
        console.error('Error in processResources:', err);
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'An error occurred while processing resources');
        }
      } finally {
        if (isMounted) {
          setIsProcessing(false);
        }
      }
    }

    processResources();
    return () => {
      isMounted = false;
    };
  }, [originalResources]);

  // Helper function to set a value at a nested path
  const setNestedValue = (obj: any, path: string, value: any) => {
    const pathParts = path.split('.');
    let current = obj;
    
    for (let i = 0; i < pathParts.length - 1; i++) {
      const part = pathParts[i];
      if (!current[part]) {
        current[part] = {};
      }
      current = current[part];
    }
    
    const lastPart = pathParts[pathParts.length - 1];
    current[lastPart] = value;
    return obj;
  };

  // Helper function to clean the path by removing resource type prefix
  const cleanPath = (path: string) => {
    return path.replace(/^(Patient|Procedure)\./, '');
  };

  // Apply cleaning suggestions
  const applySuggestions = useCallback(() => {
    if (!originalResources || !anomalies.length) return;

    console.log('Applying suggestions for anomalies:', anomalies);
    
    // Create a deep copy of original resources
    const cleaned = JSON.parse(JSON.stringify(originalResources));
    let appliedCount = 0;

    // Process each anomaly
    anomalies.forEach(anomaly => {
      const resourceIndex = cleaned.findIndex((r: Patient | Procedure) => r.id === anomaly.resourceId);
      if (resourceIndex === -1) return;

      const resource = cleaned[resourceIndex];
      const cleanPath = anomaly.path.replace(/^(Patient|Procedure)\./, '');

      try {
        // Handle specific anomaly types
        if (cleanPath === 'performedDateTime' && anomaly.issue.includes('future')) {
          // Set future dates to current date
          const now = new Date().toISOString();
          setNestedValue(resource, cleanPath, now);
          appliedCount++;
          console.log(`Applied suggestion: Set ${cleanPath} to current date`);
        }
        else if (cleanPath === 'telecom') {
          // Add telecom information
          setNestedValue(resource, cleanPath, [{
            system: 'phone',
            value: '(555) 123-4567',
            use: 'home'
          }]);
          appliedCount++;
          console.log('Applied suggestion: Added telecom information');
        }
        else if (cleanPath === 'managingOrganization') {
          // Add managing organization
          setNestedValue(resource, cleanPath, {
            reference: 'Organization/org1',
            display: 'General Hospital'
          });
          appliedCount++;
          console.log('Applied suggestion: Added managing organization');
        }
        else if (cleanPath === 'communication.language') {
          // Add communication preferences
          if (!resource.communication) {
            resource.communication = [];
          }
          resource.communication.push({
            language: {
              coding: [{
                system: 'urn:ietf:bcp:47',
                code: 'en',
                display: 'English'
              }]
            },
            preferred: true
          });
          appliedCount++;
          console.log('Applied suggestion: Added communication preferences');
        }
        else if (cleanPath === 'contact') {
          // Add emergency contact
          setNestedValue(resource, cleanPath, [{
            relationship: [{
              coding: [{
                system: 'http://terminology.hl7.org/CodeSystem/v2-0131',
                code: 'C',
                display: 'Emergency Contact'
              }]
            }],
            name: {
              family: 'Emergency',
              given: ['Contact']
            },
            telecom: [{
              system: 'phone',
              value: '(555) 999-8888',
              use: 'mobile'
            }],
            address: {
              line: ['456 Emergency St'],
              city: 'Boston',
              state: 'MA',
              postalCode: '02108'
            }
          }]);
          appliedCount++;
          console.log('Applied suggestion: Added emergency contact');
        }
      } catch (error) {
        console.error(`Error applying suggestion for ${cleanPath}:`, error);
      }
    });

    console.log(`Applied ${appliedCount} suggestions`);
    console.log('Cleaned resources:', JSON.stringify(cleaned, null, 2));
    
    setCleanedResources(cleaned);
    setSummary(prev => {
      if (!prev) return null;
      return {
        ...prev,
        stats: {
          ...prev.stats,
          suggestionsApplied: appliedCount,
          cleanedRecords: appliedCount
        },
        lastUpdated: new Date().toISOString()
      };
    });
  }, [originalResources, anomalies]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="border-b pb-6">
        <h1 className="text-3xl font-bold text-gray-900">Hospital Data Cleaning Showcase</h1>
        <p className="mt-2 text-gray-600">Review and clean FHIR resources by detecting and fixing anomalies</p>
      </div>

      {/* Status and Summary Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Processing Status */}
        {isProcessing && (
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
              <p className="text-blue-800 font-medium">Processing resources and detecting anomalies...</p>
            </div>
          </div>
        )}

        {/* Run Summary */}
        {summary && (
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Cleaning Run Summary</h2>
            <p className="text-gray-700 italic mb-4">{summary.text}</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded">
                <span className="block text-sm text-gray-500">Total Records</span>
                <span className="text-xl font-semibold text-gray-900">{summary.stats.totalRecords}</span>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <span className="block text-sm text-gray-500">Cleaned Records</span>
                <span className="text-xl font-semibold text-gray-900">{summary.stats.cleanedRecords}</span>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <span className="block text-sm text-gray-500">Anomalies Found</span>
                <span className="text-xl font-semibold text-gray-900">{summary.stats.anomaliesFound}</span>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <span className="block text-sm text-gray-500">Suggestions Applied</span>
                <span className="text-xl font-semibold text-gray-900">{summary.stats.suggestionsApplied}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error Details</h3>
              <pre className="mt-2 text-sm text-red-700 whitespace-pre-wrap">{error}</pre>
            </div>
          </div>
        </div>
      )}

      {/* Anomalies Section */}
      {anomalies.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Detected Anomalies</h2>
                <p className="mt-1 text-sm text-gray-500">Review and apply suggested fixes to clean the data</p>
              </div>
              <button
                onClick={applySuggestions}
                disabled={isCleaning || cleanedResources.length > 0}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center"
              >
                {isCleaning ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Cleaning...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Apply Suggestions
                  </>
                )}
              </button>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {anomalies.map((anomaly, index) => (
              <div key={index} className="p-6 hover:bg-gray-50 transition-colors duration-150">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="p-2 bg-yellow-100 rounded-full">
                      <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-900">{anomaly.path}</h3>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        {(anomaly.confidence * 100).toFixed(1)}% confidence
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">{anomaly.issue}</p>
                    {anomaly.suggestion && (
                      <div className="mt-2 text-sm">
                        <span className="text-gray-500">Suggestion: </span>
                        <span className="text-green-700 font-medium">{anomaly.suggestion}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Resources Comparison Section */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Resource Comparison</h2>
              <p className="mt-1 text-sm text-gray-500">View original and cleaned versions of the resources</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('original')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  activeTab === 'original'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Original Data
              </button>
              <button
                onClick={() => setActiveTab('cleaned')}
                disabled={cleanedResources.length === 0}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  activeTab === 'cleaned'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                Cleaned Data
              </button>
            </div>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {(activeTab === 'original' ? originalResources : cleanedResources).map((resource, index) => (
            <div key={index} className="p-6 hover:bg-gray-50 transition-colors duration-150">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-medium text-gray-900">
                  {resource.resourceType} {resource.id}
                </h3>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  activeTab === 'original' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                }`}>
                  {activeTab === 'original' ? 'Original' : 'Cleaned'}
                </span>
              </div>
              <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-sm text-gray-700">
                {JSON.stringify(resource, null, 2)}
              </pre>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 