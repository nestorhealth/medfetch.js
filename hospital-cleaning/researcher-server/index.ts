import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { readFileSync, existsSync } from 'fs';
import { join as pathJoin } from 'path';

// Load environment variables from .env file
function loadEnvFile() {
  const envPath = pathJoin(process.cwd(), '.env');
  if (existsSync(envPath)) {
    const envContent = readFileSync(envPath, 'utf8');
    const lines = envContent.split('\n');
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      if (trimmedLine && !trimmedLine.startsWith('#')) {
        const [key, ...valueParts] = trimmedLine.split('=');
        if (key && valueParts.length > 0) {
          const value = valueParts.join('=').replace(/^["']|["']$/g, ''); // Remove quotes
          process.env[key] = value;
        }
      }
    }
    console.log('📄 Environment variables loaded from .env file');
  } else {
    console.warn('⚠️ No .env file found in project root');
  }
}

// Load environment variables
loadEnvFile();
import { 
  getAllSeedDatasets, 
  getSeedDataset, 
  getSeedCSVPreview, 
  markSeedDownloaded,
  getStorageStats,
  createSeedDataset
} from '../utils/seedDatasetCreator';
import { 
  IRBSubmission, 
  generateIRBId, 
  createIRBSubmission, 
  getIRBSubmission, 
  getAllIRBSubmissions, 
  getIRBSubmissionsByResearcher, 
  updateIRBSubmission, 
  deleteIRBSubmission,
  getSeedDatasetIdForIRB
} from '../utils/sharedStorage';

const app = new Hono();

// Initialize OpenAI client
function getOpenAIClient() {
  const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY || process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.warn('OpenAI API key not set. Using fallback review method.');
    console.warn('Please ensure you have either NEXT_PUBLIC_OPENAI_API_KEY or OPENAI_API_KEY in your .env file.');
    return null;
  }
  
  try {
    const { OpenAI } = require('openai');
    return new OpenAI({ apiKey });
  } catch (error) {
    console.warn('OpenAI package not available. Using fallback review method.');
    return null;
  }
}

// Enhanced AI review function using OpenAI with true comparison
export async function performAIReview(fileContent: string): Promise<{ issues: string[]; suggestions: string[]; complianceScore: number; comparison?: any }> {
  const openai = getOpenAIClient();
  
  if (!openai) {
    // Fallback to basic review if OpenAI is not available
    return performBasicReview(fileContent);
  }

  try {
    // Fetch the template IRB from admin server for true comparison
    let templateIRB = '';
    try {
      const templateResponse = await fetch('http://localhost:3001/api/template-irb');
      if (templateResponse.ok) {
        const templateData = await templateResponse.json();
        templateIRB = templateData.template;
        console.log('📋 Template IRB fetched successfully for comparison');
      } else {
        console.warn('⚠️ Could not fetch template IRB, using fallback');
        templateIRB = getFallbackTemplate();
      }
    } catch (error) {
      console.warn('⚠️ Error fetching template IRB:', error);
      templateIRB = getFallbackTemplate();
    }

    const prompt = `You are an expert institutional review board (IRB) compliance reviewer. Your task is to perform a detailed comparison between a submitted IRB application and a reference template.

IMPORTANT: Be conservative in flagging issues. Only flag CLEARLY missing or problematic elements. If something is implied or can be reasonably inferred, do NOT flag it as missing.

COMPARISON METHODOLOGY:
1. Compare the submitted IRB against the reference template section by section
2. Identify specific differences in content, structure, and completeness
3. Look for explicit mentions of required elements
4. Consider context and implied information
5. Be lenient with formatting and style differences
6. Focus on substance over form

EVALUATION CRITERIA:
1. **Informed Consent**: Must be explicitly mentioned with key elements (purpose, risks, withdrawal rights, confidentiality)
2. **Data Security**: Must describe privacy protections, data handling, and security measures
3. **Risk Assessment**: Must acknowledge potential risks and benefits
4. **Voluntary Participation**: Must explicitly state participation is voluntary and withdrawal rights
5. **Study Purpose**: Must clearly state research objectives
6. **Methodology**: Must describe research procedures and data collection methods
7. **Confidentiality**: Must address privacy and data protection
8. **Monitoring**: Should mention oversight and monitoring procedures

REFERENCE TEMPLATE (Good IRB Example):
${templateIRB}

SUBMITTED IRB DOCUMENT:
${fileContent.substring(0, 6000)}

Provide your analysis in this exact format:

COMPARISON ANALYSIS:
- [List specific differences between the submitted IRB and template, focusing on missing or incomplete sections]

Issues:
- [List specific, clearly missing elements. If none found, write "None."]

Suggestions:
- [Provide specific, actionable improvements based on the comparison. If no issues, write "None."]

Score: [Number between 0-100]

Reasoning: [Detailed explanation of score and key findings from the comparison]`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a conservative IRB reviewer who performs detailed comparisons between submitted IRBs and reference templates. You provide fair, evidence-based assessments and avoid false positives. Focus on substantive differences rather than stylistic variations.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.2, // Lower temperature for more consistent results
      max_tokens: 1200 // Increased for more detailed comparison
    });

    const response = completion.choices[0]?.message?.content || '';
    
    // Parse the structured response with improved logic
    const issues: string[] = [];
    const suggestions: string[] = [];
    let complianceScore = 85; // Base score
    let reasoning = '';
    let comparison = '';
    
    const lines = response.split('\n');
    let currentSection = '';
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      if (trimmedLine.startsWith('COMPARISON ANALYSIS:')) {
        currentSection = 'comparison';
      } else if (trimmedLine.startsWith('Issues:')) {
        currentSection = 'issues';
      } else if (trimmedLine.startsWith('Suggestions:')) {
        currentSection = 'suggestions';
      } else if (trimmedLine.startsWith('Score:')) {
        currentSection = 'score';
        const scoreMatch = trimmedLine.match(/Score:\s*(\d+)/);
        if (scoreMatch) {
          complianceScore = parseInt(scoreMatch[1]);
        }
      } else if (trimmedLine.startsWith('Reasoning:')) {
        currentSection = 'reasoning';
        reasoning = trimmedLine.substring(10).trim();
      } else if (trimmedLine.startsWith('- ') && currentSection === 'comparison') {
        const comparisonItem = trimmedLine.substring(2);
        if (comparisonItem.length > 0 && !comparisonItem.toLowerCase().includes('none')) {
          comparison += comparisonItem + '\n';
        }
      } else if (trimmedLine.startsWith('- ') && currentSection === 'issues') {
        const issue = trimmedLine.substring(2);
        if (issue !== 'None.' && issue.length > 0 && !issue.toLowerCase().includes('none')) {
          issues.push(issue);
        }
      } else if (trimmedLine.startsWith('- ') && currentSection === 'suggestions') {
        const suggestion = trimmedLine.substring(2);
        if (suggestion.length > 0 && !suggestion.toLowerCase().includes('none')) {
          suggestions.push(suggestion);
        }
      }
    }
    
    // Validate and adjust score if needed
    if (complianceScore < 0 || complianceScore > 100) {
      complianceScore = 85; // Default if parsing failed
    }
    
    // Additional validation: if no issues found, ensure score is reasonable
    if (issues.length === 0 && complianceScore < 80) {
      complianceScore = Math.max(complianceScore, 80);
    }
    
    // If many issues found, ensure score reflects that
    if (issues.length > 3 && complianceScore > 70) {
      complianceScore = Math.min(complianceScore, 70);
    }
    
    console.log('🤖 Enhanced AI Review with Comparison completed:', { 
      issues: issues.length, 
      suggestions: suggestions.length, 
      score: complianceScore,
      comparisonLength: comparison.length,
      reasoning: reasoning.substring(0, 100) + '...'
    });
    
    return { 
      issues, 
      suggestions, 
      complianceScore: Math.round(complianceScore),
      comparison: comparison.trim() || undefined
    };
    
  } catch (error) {
    console.error('Error in AI review:', error);
    // Fallback to basic review
    return performBasicReview(fileContent);
  }
}

// Fallback template function
function getFallbackTemplate(): string {
  return `
RESEARCH PROTOCOL: Cardiovascular Health Study

PRINCIPAL INVESTIGATOR: Dr. Sarah Johnson, MD, PhD
Department of Cardiology, University Medical Center

STUDY TITLE: Impact of Lifestyle Interventions on Cardiovascular Health Outcomes

INFORMED CONSENT:
All participants will receive detailed informed consent forms explaining:
- Study purpose and procedures
- Potential risks and benefits
- Right to withdraw at any time
- Confidentiality protections
- Contact information for questions

DATA SECURITY AND PRIVACY PROTECTION:
- All data will be stored in HIPAA-compliant secure systems
- Data encryption for transmission and storage
- Access limited to authorized research personnel
- Regular security audits and updates
- Data retention policy: 7 years post-study completion

RISK ASSESSMENT:
Potential risks include:
- Minor discomfort during blood draws
- Time commitment for study visits
- Potential privacy concerns (mitigated by security measures)
- Minimal risk of data breach (mitigated by encryption)

Benefits include:
- Free health assessments
- Potential health improvements
- Contribution to medical knowledge
- Compensation for time and effort

VOLUNTARY PARTICIPATION:
Participation in this study is completely voluntary. Participants may withdraw from the study at any time without penalty or loss of benefits to which they are otherwise entitled.

CONFIDENTIALITY AND PRIVACY:
All participant data will be kept strictly confidential. Personal identifiers will be removed and replaced with unique study codes.
`;
}

// Enhanced fallback basic review function with improved logic
function performBasicReview(fileContent: string): { issues: string[]; suggestions: string[]; complianceScore: number } {
  const issues: string[] = [];
  const suggestions: string[] = [];
  let complianceScore = 85;

  const content = fileContent.toLowerCase();
  
  // More sophisticated keyword matching with context
  const hasInformedConsent = content.includes('informed consent') || 
                            content.includes('consent form') || 
                            content.includes('participant consent') ||
                            content.includes('consent process') ||
                            content.includes('consent procedure');
  
  const hasRisks = content.includes('risk') || 
                  content.includes('discomfort') || 
                  content.includes('safety') ||
                  content.includes('potential harm') ||
                  content.includes('adverse');
  
  const hasPurpose = content.includes('purpose') || 
                    content.includes('objective') || 
                    content.includes('aim') || 
                    content.includes('goal') ||
                    content.includes('research question') ||
                    content.includes('study design');
  
  const hasRecruitment = content.includes('recruitment') || 
                        content.includes('participant') || 
                        content.includes('subject') || 
                        content.includes('population') ||
                        content.includes('eligibility') ||
                        content.includes('inclusion criteria');
  
  const hasProcedures = content.includes('procedure') || 
                       content.includes('method') || 
                       content.includes('protocol') || 
                       content.includes('data collection') ||
                       content.includes('study protocol') ||
                       content.includes('research design');
  
  const hasDataSecurity = content.includes('data security') || 
                         content.includes('privacy') || 
                         content.includes('confidentiality') || 
                         content.includes('anonymization') ||
                         content.includes('data protection') ||
                         content.includes('hipaa') ||
                         content.includes('encryption');
  
  const hasVoluntary = content.includes('voluntary') || 
                      content.includes('withdraw') || 
                      content.includes('right to withdraw') ||
                      content.includes('participation is voluntary') ||
                      content.includes('may withdraw');

  // More conservative scoring - only flag if clearly missing
  let missingElements = 0;
  
  if (!hasInformedConsent) {
    issues.push('Informed consent process not clearly described');
    suggestions.push('Add a section describing the informed consent process and key elements');
    missingElements++;
  }

  if (!hasRisks) {
    issues.push('Risk assessment not clearly addressed');
    suggestions.push('Include a section on potential risks, benefits, and mitigation strategies');
    missingElements++;
  }

  if (!hasPurpose) {
    issues.push('Study purpose not clearly stated');
    suggestions.push('Clearly articulate the research objectives and study goals');
    missingElements++;
  }

  if (!hasRecruitment) {
    issues.push('Participant recruitment methods not specified');
    suggestions.push('Describe participant recruitment strategy and eligibility criteria');
    missingElements++;
  }

  if (!hasProcedures) {
    issues.push('Research procedures not clearly outlined');
    suggestions.push('Provide detailed description of research procedures and data collection methods');
    missingElements++;
  }

  if (!hasDataSecurity) {
    issues.push('Data security and privacy measures not addressed');
    suggestions.push('Include data security protocols, privacy protections, and data handling procedures');
    missingElements++;
  }

  if (!hasVoluntary) {
    issues.push('Voluntary participation not explicitly stated');
    suggestions.push('Clearly state that participation is voluntary and participants can withdraw at any time');
    missingElements++;
  }

  // Improved scoring logic based on missing elements
  if (missingElements === 0) {
    complianceScore = 90; // Excellent
  } else if (missingElements === 1) {
    complianceScore = 80; // Good
  } else if (missingElements === 2) {
    complianceScore = 75; // Adequate
  } else if (missingElements === 3) {
    complianceScore = 65; // Needs work
  } else if (missingElements === 4) {
    complianceScore = 55; // Major issues
  } else {
    complianceScore = 45; // Critical issues
  }

  // Bonus points for comprehensive documents
  if (fileContent.length > 2000) {
    complianceScore = Math.min(100, complianceScore + 5);
  }

  // Ensure score is within bounds
  complianceScore = Math.max(0, Math.min(100, complianceScore));

  console.log('🔍 Basic Review completed:', { 
    issues: issues.length, 
    suggestions: suggestions.length, 
    score: complianceScore,
    missingElements,
    contentLength: fileContent.length
  });

  return { issues, suggestions, complianceScore: Math.round(complianceScore) };
}

// Researcher Dashboard HTML with IRB Upload
const researcherDashboardHTML = (seeds: any[], stats: any, irbSubmissions: IRBSubmission[]) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Research Data Portal</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 1400px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            border-radius: 12px;
            margin-bottom: 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 2.5em;
            font-weight: 300;
        }
        .header p {
            margin: 10px 0 0 0;
            opacity: 0.9;
            font-size: 1.1em;
        }
        .tabs {
            display: flex;
            background: white;
            border-radius: 12px;
            padding: 8px;
            margin-bottom: 30px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .tab {
            flex: 1;
            padding: 15px 20px;
            text-align: center;
            cursor: pointer;
            border-radius: 8px;
            transition: all 0.2s;
            font-weight: 600;
        }
        .tab.active {
            background: #667eea;
            color: white;
        }
        .tab:hover:not(.active) {
            background: #f8f9fa;
        }
        .tab-content {
            display: none;
        }
        .tab-content.active {
            display: block;
        }
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .stat-card {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            text-align: center;
        }
        .stat-number {
            font-size: 2em;
            font-weight: bold;
            color: #667eea;
            margin-bottom: 5px;
        }
        .stat-label {
            color: #666;
            font-size: 0.9em;
        }
        .upload-section {
            background: white;
            border-radius: 12px;
            padding: 30px;
            margin-bottom: 30px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .upload-area {
            border: 2px dashed #dee2e6;
            border-radius: 8px;
            padding: 40px;
            text-align: center;
            transition: all 0.2s;
            cursor: pointer;
        }
        .upload-area:hover {
            border-color: #667eea;
            background: #f8f9fa;
        }
        .upload-area.dragover {
            border-color: #667eea;
            background: #e3f2fd;
        }
        .upload-icon {
            font-size: 3em;
            color: #667eea;
            margin-bottom: 15px;
        }
        .file-input {
            display: none;
        }
        .btn {
            padding: 12px 24px;
            border: none;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 8px;
        }
        .btn-primary {
            background: #667eea;
            color: white;
        }
        .btn-primary:hover {
            background: #5a6fd8;
        }
        .btn-secondary {
            background: #f8f9fa;
            color: #333;
            border: 1px solid #dee2e6;
        }
        .btn-secondary:hover {
            background: #e9ecef;
        }
        .btn-success {
            background: #28a745;
            color: white;
        }
        .btn-success:hover {
            background: #218838;
        }
        .btn-warning {
            background: #ffc107;
            color: #212529;
        }
        .btn-warning:hover {
            background: #e0a800;
        }
        .btn-danger {
            background: #dc3545;
            color: white;
        }
        .btn-danger:hover {
            background: #c82333;
        }
        .ai-review {
            background: #f8f9fa;
            border-radius: 8px;
            padding: 20px;
            margin-top: 20px;
        }
        .compliance-score {
            display: inline-block;
            padding: 8px 16px;
            border-radius: 20px;
            font-weight: 600;
            font-size: 1.1em;
        }
        .score-high { background: #d4edda; color: #155724; }
        .score-medium { background: #fff3cd; color: #856404; }
        .score-low { background: #f8d7da; color: #721c24; }
        .issues-list, .suggestions-list {
            margin: 15px 0;
        }
        .issues-list h4 { color: #dc3545; }
        .suggestions-list h4 { color: #28a745; }
        .issue-item, .suggestion-item {
            background: white;
            padding: 10px 15px;
            margin: 8px 0;
            border-radius: 6px;
            border-left: 4px solid;
        }
        .issue-item { border-left-color: #dc3545; }
        .suggestion-item { border-left-color: #28a745; }
        .irb-submissions {
            display: grid;
            gap: 20px;
        }
        .irb-card {
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .irb-header {
            padding: 20px;
            border-bottom: 1px solid #dee2e6;
        }
        .irb-title {
            font-size: 1.2em;
            font-weight: 600;
            margin-bottom: 5px;
        }
        .irb-meta {
            color: #666;
            font-size: 0.9em;
        }
        .irb-content {
            padding: 20px;
        }
        .status-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 0.8em;
            font-weight: 600;
            text-transform: uppercase;
        }
        .status-draft { background: #e9ecef; color: #495057; }
        .status-submitted { background: #cce5ff; color: #004085; }
        .status-approved { background: #d4edda; color: #155724; }
        .status-rejected { background: #f8d7da; color: #721c24; }
        .datasets-grid {
            display: grid;
            gap: 20px;
        }
        .dataset-card {
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            overflow: hidden;
            transition: transform 0.2s, box-shadow 0.2s;
        }
        .dataset-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 15px rgba(0,0,0,0.15);
        }
        .dataset-header {
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            color: white;
            padding: 20px;
        }
        .dataset-title {
            font-size: 1.3em;
            font-weight: 600;
            margin: 0 0 5px 0;
        }
        .dataset-meta {
            font-size: 0.9em;
            opacity: 0.9;
        }
        .dataset-content {
            padding: 20px;
        }
        .dataset-info {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 15px;
            margin-bottom: 20px;
        }
        .info-item {
            text-align: center;
        }
        .info-value {
            font-size: 1.2em;
            font-weight: 600;
            color: #333;
        }
        .info-label {
            font-size: 0.8em;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .resource-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-bottom: 20px;
        }
        .resource-tag {
            background: #e3f2fd;
            color: #1976d2;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 0.8em;
            font-weight: 500;
        }
        .action-buttons {
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
        }
        .preview-section {
            margin-top: 20px;
        }
        .preview-toggle {
            background: none;
            border: none;
            color: #667eea;
            cursor: pointer;
            font-size: 14px;
            text-decoration: underline;
            margin-bottom: 15px;
        }
        .preview-content {
            display: none;
            background: #f8f9fa;
            border-radius: 8px;
            padding: 15px;
            overflow-x: auto;
        }
        .preview-content.show {
            display: block;
        }
        .preview-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 12px;
        }
        .preview-table th,
        .preview-table td {
            border: 1px solid #dee2e6;
            padding: 8px;
            text-align: left;
        }
        .preview-table th {
            background: #e9ecef;
            font-weight: 600;
        }
        .preview-table tr:nth-child(even) {
            background: #f8f9fa;
        }
        .metadata-preview {
            background: white;
            border-radius: 8px;
            padding: 20px;
        }
        .metadata-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 15px;
            margin-bottom: 20px;
        }
        .metadata-item {
            background: #f8f9fa;
            padding: 12px;
            border-radius: 6px;
            border-left: 3px solid #667eea;
        }
        .resource-list {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-bottom: 20px;
        }
        .resource-item {
            display: flex;
            align-items: center;
            gap: 8px;
            background: #e3f2fd;
            color: #1976d2;
            padding: 8px 12px;
            border-radius: 20px;
            font-size: 0.9em;
        }
        .resource-icon {
            font-size: 1.1em;
        }
        .irb-info, .fhir-results, .cleaning-results {
            background: #f8f9fa;
            border-radius: 6px;
            padding: 15px;
            margin-bottom: 15px;
        }
        .query-result, .cleaning-result {
            background: white;
            padding: 8px 12px;
            margin: 5px 0;
            border-radius: 4px;
            border-left: 3px solid #28a745;
        }
        .metadata-preview h4 {
            color: #333;
            margin: 20px 0 10px 0;
            padding-bottom: 5px;
            border-bottom: 2px solid #667eea;
        }
        .empty-state {
            text-align: center;
            padding: 60px 20px;
            color: #666;
        }
        .empty-state h3 {
            margin-bottom: 10px;
            color: #333;
        }
        .loading {
            text-align: center;
            padding: 40px;
            color: #666;
        }
        .spinner {
            border: 3px solid #f3f3f3;
            border-top: 3px solid #667eea;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🔬 Research Data Portal</h1>
        <p>Upload IRB documents and access your approved research datasets</p>
    </div>

    <div class="tabs">
        <div class="tab active" onclick="switchTab('irb', event)">📋 IRB Management</div>
        <div class="tab" onclick="switchTab('datasets', event)">📊 Datasets</div>
    </div>

    <div id="irb-tab" class="tab-content active">
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-number">${irbSubmissions.length}</div>
                <div class="stat-label">IRB Submissions</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${irbSubmissions.filter(s => s.status === 'approved').length}</div>
                <div class="stat-label">Approved IRBs</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${irbSubmissions.filter(s => s.status === 'submitted').length}</div>
                <div class="stat-label">Pending Review</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${irbSubmissions.filter(s => s.status === 'rejected').length}</div>
                <div class="stat-label">Rejected IRBs</div>
            </div>
        </div>

        <div class="upload-section">
            <h2>📄 Upload IRB Document</h2>
            <p>Upload your IRB document for AI review and submission to admin approval.</p>
            
            <div class="upload-area" onclick="document.getElementById('irb-file').click()" ondrop="handleDrop(event)" ondragover="handleDragOver(event)" ondragleave="handleDragLeave(event)">
                <div class="upload-icon">📁</div>
                <h3>Drop your IRB document here</h3>
                <p>or click to browse files</p>
                <p style="font-size: 0.9em; color: #666;">Supports PDF, TXT, MD files</p>
            </div>
            
            <input type="file" id="irb-file" class="file-input" accept=".pdf,.txt,.md" onchange="handleFileSelect(event)">
            
            <div id="upload-progress" style="display: none;">
                <div class="loading">
                    <div class="spinner"></div>
                    <p>Uploading and analyzing IRB document...</p>
                </div>
            </div>
        </div>

        <div class="irb-submissions">
            <h2>📋 Your IRB Submissions</h2>
            ${irbSubmissions.length === 0 ? `
                <div class="empty-state">
                    <h3>📭 No IRB Submissions</h3>
                    <p>Upload your first IRB document to get started.</p>
                </div>
            ` : irbSubmissions.map(submission => `
                <div class="irb-card">
                    <div class="irb-header">
                        <div class="irb-title">${submission.fileName}</div>
                        <div class="irb-meta">
                            Uploaded: ${new Date(submission.uploadedAt).toLocaleDateString()} • 
                            Status: <span class="status-badge status-${submission.status}">${submission.status}</span>
                        </div>
                    </div>
                    <div class="irb-content">
                        ${submission.aiReview ? `
                            <div class="ai-review">
                                <h3>🤖 AI Review Results</h3>
                                <div class="compliance-score score-${submission.aiReview.complianceScore >= 80 ? 'high' : submission.aiReview.complianceScore >= 60 ? 'medium' : 'low'}">
                                    Compliance Score: ${submission.aiReview.complianceScore}%
                                </div>
                                
                                ${submission.aiReview.issues.length > 0 ? `
                                    <div class="issues-list">
                                        <h4>⚠️ Issues Found</h4>
                                        ${submission.aiReview.issues.map(issue => `
                                            <div class="issue-item">${issue}</div>
                                        `).join('')}
                                    </div>
                                ` : ''}
                                
                                ${submission.aiReview.suggestions.length > 0 ? `
                                    <div class="suggestions-list">
                                        <h4>💡 Suggestions</h4>
                                        ${submission.aiReview.suggestions.map(suggestion => `
                                            <div class="suggestion-item">${suggestion}</div>
                                        `).join('')}
                                    </div>
                                ` : ''}
                            </div>
                        ` : ''}
                        
                        ${submission.adminReview ? `
                            <div style="margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px;">
                                <h4>👨‍⚖️ Admin Review</h4>
                                <p><strong>Decision:</strong> ${submission.adminReview.approved ? 'Approved' : 'Rejected'}</p>
                                ${submission.adminReview.feedback ? `<p><strong>Feedback:</strong> ${submission.adminReview.feedback}</p>` : ''}
                                ${submission.adminReview.reviewedAt ? `<p><strong>Reviewed:</strong> ${new Date(submission.adminReview.reviewedAt).toLocaleDateString()}</p>` : ''}
                            </div>
                        ` : ''}
                        
                        <div class="action-buttons">
                            ${submission.status === 'draft' ? `
                                <button class="btn btn-success" onclick="submitIRB('${submission.id}')">✅ Submit for Review</button>
                                <button class="btn btn-secondary" onclick="deleteIRB('${submission.id}')">🗑️ Delete</button>
                            ` : submission.status === 'rejected' ? `
                                <button class="btn btn-primary" onclick="resubmitIRB('${submission.id}')">🔄 Resubmit</button>
                                <button class="btn btn-secondary" onclick="deleteIRB('${submission.id}')">🗑️ Delete</button>
                            ` : submission.status === 'approved' ? `
                                <button class="btn btn-primary" onclick="viewDatasets('${submission.id}')">📊 View Datasets</button>
                            ` : `
                                <button class="btn btn-secondary" disabled>⏳ Pending Review</button>
                            `}
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    </div>

    <div id="datasets-tab" class="tab-content">
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-number">${stats.totalDatasets}</div>
                <div class="stat-label">Available Datasets</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${stats.totalRecords.toLocaleString()}</div>
                <div class="stat-label">Total Records</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${stats.totalSizeFormatted}</div>
                <div class="stat-label">Total Storage</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${stats.readyDatasets}</div>
                <div class="stat-label">Ready for Download</div>
            </div>
        </div>

        <div class="datasets-grid">
            ${seeds.length === 0 ? `
                <div class="empty-state">
                    <h3>📭 No Datasets Available</h3>
                    <p>No research datasets have been approved and processed yet.</p>
                    <p>Once your IRB is approved and data is processed, your datasets will appear here.</p>
                </div>
            ` : seeds.map(seed => `
                <div class="dataset-card" data-seed-id="${seed.id}">
                    <div class="dataset-header">
                        <div class="dataset-title">${seed.studyTitle}</div>
                        <div class="dataset-meta">
                            Study ID: ${seed.id} • PI: ${seed.principalInvestigator}
                        </div>
                    </div>
                    <div class="dataset-content">
                        <div class="dataset-info">
                            <div class="info-item">
                                <div class="info-value">${seed.totalRecords.toLocaleString()}</div>
                                <div class="info-label">Records</div>
                            </div>
                            <div class="info-item">
                                <div class="info-value">${seed.resourceTypes.length}</div>
                                <div class="info-label">Resource Types</div>
                            </div>
                            <div class="info-item">
                                <div class="info-value">${(seed.fileSize / 1024 / 1024).toFixed(2)} MB</div>
                                <div class="info-label">File Size</div>
                            </div>
                            <div class="info-item">
                                <div class="info-value">
                                    <span class="status-badge status-${seed.status}">${seed.status}</span>
                                </div>
                                <div class="info-label">Status</div>
                            </div>
                        </div>

                        <div class="resource-tags">
                            ${seed.resourceTypes.map((type: string) => `
                                <span class="resource-tag">${type}</span>
                            `).join('')}
                        </div>

                        <div class="action-buttons">
                            <a href="/download/${seed.id}" class="btn btn-primary" onclick="markDownloaded('${seed.id}')">
                                📥 Download Dataset
                            </a>
                            <button class="btn btn-secondary" onclick="togglePreview('${seed.id}')">
                                📊 View Metadata
                            </button>
                        </div>

                        <div class="preview-section">
                            <button class="preview-toggle" onclick="togglePreview('${seed.id}')">
                                Show/Hide Dataset Metadata
                            </button>
                            <div id="preview-${seed.id}" class="preview-content">
                                <div class="loading">
                                    <div class="spinner"></div>
                                    Loading preview...
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    </div>

    <script>
        function switchTab(tabName, event) {
            // Hide all tab contents
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // Remove active class from all tabs
            document.querySelectorAll('.tab').forEach(tab => {
                tab.classList.remove('active');
            });
            
            // Show selected tab content
            document.getElementById(tabName + '-tab').classList.add('active');
            
            // Add active class to clicked tab
            if (event && event.target) {
                event.target.classList.add('active');
            }
        }

        function handleDragOver(event) {
            event.preventDefault();
            event.currentTarget.classList.add('dragover');
        }

        function handleDragLeave(event) {
            event.preventDefault();
            event.currentTarget.classList.remove('dragover');
        }

        function handleDrop(event) {
            event.preventDefault();
            event.currentTarget.classList.remove('dragover');
            
            const files = event.dataTransfer.files;
            if (files.length > 0) {
                uploadFile(files[0]);
            }
        }

        function handleFileSelect(event) {
            const file = event.target.files[0];
            if (file) {
                uploadFile(file);
            }
        }

        async function uploadFile(file) {
            const formData = new FormData();
            formData.append('irb', file);
            
            document.getElementById('upload-progress').style.display = 'block';
            
            try {
                const response = await fetch('/api/upload-irb', {
                    method: 'POST',
                    body: formData
                });
                
                const result = await response.json();
                
                if (result.success) {
                    alert('IRB uploaded successfully! AI review completed.');
                    location.reload();
                } else {
                    alert('Error uploading IRB: ' + result.error);
                }
            } catch (error) {
                alert('Error uploading file: ' + error.message);
            } finally {
                document.getElementById('upload-progress').style.display = 'none';
            }
        }

        async function submitIRB(irbId) {
            if (confirm('Are you sure you want to submit this IRB for admin review?')) {
                try {
                    const response = await fetch(\`/api/submit-irb/\${irbId}\`, { method: 'POST' });
                    const result = await response.json();
                    
                    if (result.success) {
                        alert('IRB submitted successfully!');
                        location.reload();
                    } else {
                        alert('Error submitting IRB: ' + result.error);
                    }
                } catch (error) {
                    alert('Error submitting IRB: ' + error.message);
                }
            }
        }

        async function deleteIRB(irbId) {
            if (confirm('Are you sure you want to delete this IRB submission?')) {
                try {
                    const response = await fetch(\`/api/delete-irb/\${irbId}\`, { method: 'DELETE' });
                    const result = await response.json();
                    
                    if (result.success) {
                        alert('IRB deleted successfully!');
                        location.reload();
                    } else {
                        alert('Error deleting IRB: ' + result.error);
                    }
                } catch (error) {
                    alert('Error deleting IRB: ' + error.message);
                }
            }
        }

        async function resubmitIRB(irbId) {
            if (confirm('Are you sure you want to resubmit this IRB?')) {
                try {
                    const response = await fetch(\`/api/resubmit-irb/\${irbId}\`, { method: 'POST' });
                    const result = await response.json();
                    
                    if (result.success) {
                        alert('IRB resubmitted successfully!');
                        location.reload();
                    } else {
                        alert('Error resubmitting IRB: ' + result.error);
                    }
                } catch (error) {
                    alert('Error resubmitting IRB: ' + error.message);
                }
            }
        }

        async function viewDatasets(irbId) {
            try {
                const response = await fetch(\`/api/irb-dataset/\${irbId}\`);
                const result = await response.json();
                
                if (result.success && result.seedId) {
                    // Switch to datasets tab and highlight the specific dataset
                    switchTab('datasets');
                    
                    // Scroll to the specific dataset
                    setTimeout(() => {
                        const datasetElement = document.querySelector(\`[data-seed-id="\${result.seedId}"]\`);
                        if (datasetElement) {
                            datasetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            datasetElement.style.border = '2px solid #667eea';
                            datasetElement.style.boxShadow = '0 0 10px rgba(102, 126, 234, 0.3)';
                            
                            // Remove highlight after 3 seconds
                            setTimeout(() => {
                                datasetElement.style.border = '';
                                datasetElement.style.boxShadow = '';
                            }, 3000);
                        }
                    }, 100);
                } else {
                    alert('No dataset found for this IRB. The workflow may still be processing.');
                }
            } catch (error) {
                console.error('Error getting IRB dataset:', error);
                alert('Error retrieving dataset information.');
            }
        }

        async function markDownloaded(seedId) {
            try {
                await fetch(\`/api/mark-downloaded/\${seedId}\`, { method: 'POST' });
            } catch (error) {
                console.error('Error marking as downloaded:', error);
            }
        }

        async function togglePreview(seedId) {
            const previewDiv = document.getElementById('preview-' + seedId);
            const isVisible = previewDiv.classList.contains('show');
            
            if (!isVisible) {
                previewDiv.classList.add('show');
                previewDiv.innerHTML = '<div class="loading"><div class="spinner"></div>Loading dataset metadata...</div>';
                
                try {
                    const response = await fetch('/api/dataset-metadata/' + seedId);
                    const data = await response.json();
                    
                    if (data.success && data.metadata) {
                        const metadata = data.metadata;
                        
                        // Build HTML step by step to avoid template literal issues
                        let previewHTML = '<div class="metadata-preview">';
                        
                        // Dataset Overview
                        previewHTML += '<h4>📊 Dataset Overview</h4>';
                        previewHTML += '<div class="metadata-grid">';
                        previewHTML += '<div class="metadata-item"><strong>Study Title:</strong> ' + (metadata.studyTitle || 'N/A') + '</div>';
                        previewHTML += '<div class="metadata-item"><strong>Principal Investigator:</strong> ' + (metadata.principalInvestigator || 'N/A') + '</div>';
                        previewHTML += '<div class="metadata-item"><strong>Total Records:</strong> ' + (metadata.totalRecords ? metadata.totalRecords.toLocaleString() : 'N/A') + '</div>';
                        previewHTML += '<div class="metadata-item"><strong>File Size:</strong> ' + (metadata.fileSize ? (metadata.fileSize / 1024 / 1024).toFixed(2) + ' MB' : 'N/A') + '</div>';
                        previewHTML += '<div class="metadata-item"><strong>Created:</strong> ' + (metadata.createdAt ? new Date(metadata.createdAt).toLocaleDateString() : 'N/A') + '</div>';
                        previewHTML += '<div class="metadata-item"><strong>Status:</strong> <span class="status-badge status-' + (metadata.status || 'unknown') + '">' + (metadata.status || 'Unknown') + '</span></div>';
                        previewHTML += '</div>';
                        
                        // Resource Types
                        previewHTML += '<h4>📋 Resource Types</h4>';
                        previewHTML += '<div class="resource-list">';
                        if (metadata.resourceTypes && metadata.resourceTypes.length > 0) {
                            metadata.resourceTypes.forEach(function(type) {
                                previewHTML += '<div class="resource-item"><span class="resource-icon">📄</span><span>' + type + '</span></div>';
                            });
                        } else {
                            previewHTML += '<p>No resource types specified</p>';
                        }
                        previewHTML += '</div>';
                        
                        // IRB Information
                        if (metadata.metadata && metadata.metadata.irbData) {
                            previewHTML += '<h4>📋 IRB Information</h4>';
                            previewHTML += '<div class="irb-info">';
                            previewHTML += '<div class="metadata-item"><strong>Study Title:</strong> ' + (metadata.metadata.irbData.study_title || 'N/A') + '</div>';
                            previewHTML += '<div class="metadata-item"><strong>Target Patients:</strong> ' + (metadata.metadata.irbData.target_patient_count || 'N/A') + '</div>';
                            if (metadata.metadata.irbData.date_range) {
                                previewHTML += '<div class="metadata-item"><strong>Date Range:</strong> ' + metadata.metadata.irbData.date_range.from + ' to ' + metadata.metadata.irbData.date_range.to + '</div>';
                            }
                            if (metadata.metadata.irbData.filters) {
                                const filterEntries = Object.entries(metadata.metadata.irbData.filters);
                                const filterText = filterEntries.map(function([key, value]) { return key + ': ' + value; }).join(', ');
                                previewHTML += '<div class="metadata-item"><strong>Filters:</strong> ' + filterText + '</div>';
                            }
                            previewHTML += '</div>';
                        }
                        
                        // FHIR Query Results
                        if (metadata.metadata && metadata.metadata.fhirQuery) {
                            previewHTML += '<h4>🔍 FHIR Query Results</h4>';
                            previewHTML += '<div class="fhir-results">';
                            metadata.metadata.fhirQuery.forEach(function(query) {
                                const resultText = query.success ? query.totalResources + ' records retrieved' : 'Failed: ' + query.error;
                                previewHTML += '<div class="query-result"><strong>' + query.resourceType + ':</strong> ' + resultText + '</div>';
                            });
                            previewHTML += '</div>';
                        }
                        
                        // Data Cleaning Results
                        if (metadata.metadata && metadata.metadata.dataCleaning) {
                            previewHTML += '<h4>🧹 Data Cleaning Results</h4>';
                            previewHTML += '<div class="cleaning-results">';
                            metadata.metadata.dataCleaning.forEach(function(cleaning) {
                                const resultText = cleaning.success ? cleaning.originalCount + ' → ' + cleaning.cleanedCount + ' records (' + cleaning.fields.length + ' fields)' : 'Failed: ' + cleaning.error;
                                previewHTML += '<div class="cleaning-result"><strong>' + cleaning.resourceType + ':</strong> ' + resultText + '</div>';
                            });
                            previewHTML += '</div>';
                        }
                        
                        previewHTML += '</div>';
                        previewDiv.innerHTML = previewHTML;
                    } else {
                        previewDiv.innerHTML = '<p>No metadata available for this dataset</p>';
                    }
                } catch (error) {
                    console.error('Error loading metadata:', error);
                    previewDiv.innerHTML = '<p>Error loading dataset metadata</p>';
                }
            } else {
                previewDiv.classList.remove('show');
            }
        }

        // Auto-refresh every 30 seconds
        setInterval(() => {
            location.reload();
        }, 30000);
    </script>
</body>
</html>
`;

// Routes
app.get('/', (c) => {
  const seeds = getAllSeedDatasets();
  const stats = getStorageStats();
  const researcherId = 'researcher_001'; // In production, get from auth
  const submissions = getIRBSubmissionsByResearcher(researcherId);
  return c.html(researcherDashboardHTML(seeds, stats, submissions));
});

// API endpoint to mark dataset as downloaded
app.post('/api/mark-downloaded/:seedId', (c) => {
  const seedId = c.req.param('seedId');
  const success = markSeedDownloaded(seedId);
  return c.json({ success });
});

// API endpoint to get dataset metadata
app.get('/api/dataset-metadata/:seedId', (c) => {
  const seedId = c.req.param('seedId');
  const seed = getSeedDataset(seedId);
  
  if (!seed) {
    return c.json({ success: false, error: 'Dataset not found' });
  }

  // Return the full seed metadata
  return c.json({ success: true, metadata: seed });
});

// API endpoint to get CSV previews (kept for backward compatibility)
app.get('/api/preview/:seedId', (c) => {
  const seedId = c.req.param('seedId');
  const seed = getSeedDataset(seedId);
  
  if (!seed) {
    return c.json({ success: false, error: 'Dataset not found' });
  }

  const previews: any = {};
  
  // Get previews for each resource type
  seed.resourceTypes.forEach(resourceType => {
    const fileName = `${resourceType}.csv`;
    const preview = getSeedCSVPreview(seedId, fileName, 5);
    if (preview) {
      previews[fileName] = preview;
    }
  });

  return c.json({ success: true, previews });
});

// Download endpoint
app.get('/download/:seedId', (c) => {
  const seedId = c.req.param('seedId');
  const seed = getSeedDataset(seedId);
  
  if (!seed) {
    return c.json({ success: false, error: 'Dataset not found' }, 404);
  }

  // Mark as downloaded
  markSeedDownloaded(seedId);
  
  // Return the file for download
  return c.redirect(`/seeds/${seedId}.zip`);
});

// Static file serving for seeds
app.get('/seeds/:filename', (c) => {
  const filename = c.req.param('filename');
  const filePath = pathJoin(process.cwd(), 'public', 'seeds', filename);
  
  if (!require('fs').existsSync(filePath)) {
    return c.json({ success: false, error: 'File not found' }, 404);
  }
  
  // Read and return the file
  const fileContent = require('fs').readFileSync(filePath);
  return new Response(fileContent, {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="${filename}"`
    }
  });
});

// IRB Upload endpoint
app.post('/api/upload-irb', async (c) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get('irb') as File;
    
    if (!file) {
      return c.json({ success: false, error: 'No file uploaded' });
    }

    // Parse file content based on file type
    let fileContent = '';
    const fileName = file.name.toLowerCase();
    
    if (fileName.endsWith('.pdf')) {
      // Parse PDF file
      try {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const pdfParse = require('pdf-parse');
        const pdfData = await pdfParse(buffer);
        fileContent = pdfData.text;
        console.log(`📄 Parsed PDF: ${file.name} (${fileContent.length} characters)`);
      } catch (pdfError) {
        console.error('Error parsing PDF:', pdfError);
        return c.json({ success: false, error: 'Failed to parse PDF file. Please ensure it is a valid PDF.' });
      }
    } else if (fileName.endsWith('.txt') || fileName.endsWith('.md')) {
      // Read text files directly
      fileContent = await file.text();
      console.log(`📄 Parsed text file: ${file.name} (${fileContent.length} characters)`);
    } else {
      // For other file types, try to read as text
      try {
        fileContent = await file.text();
        console.log(`📄 Parsed file as text: ${file.name} (${fileContent.length} characters)`);
      } catch (textError) {
        return c.json({ success: false, error: 'Unsupported file type. Please upload a PDF, TXT, or MD file.' });
      }
    }
    
    // Validate that we have content
    if (!fileContent || fileContent.trim().length < 50) {
      return c.json({ success: false, error: 'File appears to be empty or contains insufficient content for IRB review.' });
    }
    
    // Perform AI review
    const aiReview = await performAIReview(fileContent);
    
    // Create IRB submission
    const irbId = generateIRBId();
    const submission: IRBSubmission = {
      id: irbId,
      researcherId: 'researcher_001', // In production, get from auth
      fileName: file.name,
      filePath: `/uploads/${irbId}_${file.name}`,
      fileContent: fileContent, // Store the file content for later parsing
      uploadedAt: new Date().toISOString(),
      status: 'draft',
      aiReview
    };
    
    // Store in memory
    createIRBSubmission(submission);
    
    console.log(`📄 IRB uploaded: ${irbId} - ${file.name}`);
    console.log(`🤖 AI Review: ${aiReview.issues.length} issues, ${aiReview.suggestions.length} suggestions, score: ${aiReview.complianceScore}`);
    
    return c.json({ 
      success: true, 
      irbId,
      aiReview 
    });
  } catch (error) {
    console.error('Error uploading IRB:', error);
    return c.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// Submit IRB for admin review
app.post('/api/submit-irb/:irbId', (c) => {
  const irbId = c.req.param('irbId');
  const submission = getIRBSubmission(irbId);
  
  if (!submission) {
    return c.json({ success: false, error: 'IRB submission not found' });
  }
  
  updateIRBSubmission(irbId, { status: 'submitted' });
  
  console.log(`📤 IRB submitted for review: ${irbId}`);
  
  return c.json({ success: true });
});

// Delete IRB submission
app.delete('/api/delete-irb/:irbId', (c) => {
  const irbId = c.req.param('irbId');
  const deleted = deleteIRBSubmission(irbId);
  
  if (deleted) {
    console.log(`🗑️ IRB deleted: ${irbId}`);
    return c.json({ success: true });
  } else {
    return c.json({ success: false, error: 'IRB submission not found' });
  }
});

// Resubmit rejected IRB
app.post('/api/resubmit-irb/:irbId', (c) => {
  const irbId = c.req.param('irbId');
  const submission = getIRBSubmission(irbId);
  
  if (!submission) {
    return c.json({ success: false, error: 'IRB submission not found' });
  }
  
  updateIRBSubmission(irbId, { 
    status: 'submitted',
    adminReview: undefined // Clear previous review
  });
  
  console.log(`🔄 IRB resubmitted: ${irbId}`);
  
  return c.json({ success: true });
});

// Get IRB submissions for current researcher
app.get('/api/irb-submissions', (c) => {
  const researcherId = 'researcher_001'; // In production, get from auth
  const submissions = getIRBSubmissionsByResearcher(researcherId);
  
  return c.json({ success: true, submissions });
});

// Get seed dataset ID for a specific IRB
app.get('/api/irb-dataset/:irbId', (c) => {
  const irbId = c.req.param('irbId');
  const { getSeedDatasetIdForIRB } = require('../utils/sharedStorage');
  const { reloadWorkflowsFromFile } = require('../utils/workflowOrchestrator');
  
  // Force reload workflows to ensure we have the latest data
  reloadWorkflowsFromFile();
  
  const seedId = getSeedDatasetIdForIRB(irbId);
  
  if (seedId) {
    return c.json({ success: true, seedId });
  } else {
    return c.json({ success: false, error: 'No dataset found for this IRB' });
  }
});

// Health check endpoint
app.get('/health', (c) => {
  return c.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

const port = 3002;
console.log(`🔬 Researcher Portal running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port
}); 