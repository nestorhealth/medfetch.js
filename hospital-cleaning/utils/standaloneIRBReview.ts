import OpenAI from 'openai';

// Initialize OpenAI client
function getOpenAIClient() {
  const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY || process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.warn('OpenAI API key not set. Using fallback review method.');
    return null;
  }
  
  try {
    return new OpenAI({ apiKey });
  } catch (error) {
    console.warn('OpenAI package not available. Using fallback review method.');
    return null;
  }
}

// More reasonable template for comparison
function getReasonableTemplate(): string {
  return `
RESEARCH PROTOCOL: Example Study

PRINCIPAL INVESTIGATOR: Dr. Example, MD
Department of Research, University Hospital

STUDY TITLE: Example Research Study

INFORMED CONSENT:
Participants will receive informed consent forms explaining the study purpose, procedures, and their rights.

DATA SECURITY AND PRIVACY PROTECTION:
Data will be stored securely with appropriate privacy protections.

RISK ASSESSMENT:
The study involves minimal risk. Benefits include contributing to medical knowledge.

VOLUNTARY PARTICIPATION:
Participation is voluntary and participants may withdraw at any time.

CONFIDENTIALITY AND PRIVACY:
Participant data will be kept confidential.

STUDY OBJECTIVES:
This study aims to [describe research goals].

TARGET POPULATION:
[Describe participant criteria]

DATA REQUIREMENTS:
[Describe data needs]

MONITORING AND OVERSIGHT:
Study progress will be monitored regularly.
`;
}

// Standalone AI review function with more reasonable scoring
export async function performStandaloneAIReview(fileContent: string): Promise<{ 
  issues: string[]; 
  suggestions: string[]; 
  complianceScore: number; 
  comparison?: string;
  wouldPass: boolean;
}> {
  const openai = getOpenAIClient();
  
  if (!openai) {
    // Fallback to basic review if OpenAI is not available
    return performBasicReview(fileContent);
  }

  try {
    const templateIRB = getReasonableTemplate();

    const prompt = `You are reviewing an IRB (Institutional Review Board) application. Be REASONABLE and FAIR in your assessment.

IMPORTANT GUIDELINES:
- Only flag CRITICAL missing elements that are essential for IRB approval
- Be lenient with formatting and style differences
- If something is implied or can be reasonably inferred, do NOT flag it as missing
- Focus on substance over form
- A score of 80+ should be considered PASSING
- A score of 60-79 should be considered NEEDS MINOR REVISIONS
- Only scores below 60 should be considered FAILING

REQUIRED ELEMENTS (only flag if COMPLETELY missing):
1. Informed Consent - must mention consent process
2. Data Security - must mention privacy/data protection
3. Risk Assessment - must acknowledge risks/benefits
4. Voluntary Participation - must mention voluntary nature
5. Study Purpose - must describe research objectives
6. Target Population - must describe participants
7. Data Requirements - must mention what data is needed

REFERENCE TEMPLATE:
${templateIRB}

SUBMITTED IRB DOCUMENT:
${fileContent.substring(0, 4000)}

Provide your analysis in this exact format:

Issues:
- [List ONLY critical missing elements. If none found, write "None."]

Suggestions:
- [Provide helpful suggestions for improvement. If no issues, write "None."]

Score: [Number between 0-100, be generous with good IRBs]

Reasoning: [Brief explanation of score]`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a fair and reasonable IRB reviewer. You provide balanced assessments and avoid being overly critical. Focus on essential elements only.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 800
    });

    const response = completion.choices[0]?.message?.content || '';
    
    // Parse the structured response
    const issues: string[] = [];
    const suggestions: string[] = [];
    let complianceScore = 85; // Default to good score
    let reasoning = '';
    
    const lines = response.split('\n');
    let currentSection = '';
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      if (trimmedLine.startsWith('Issues:')) {
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
    
    // Ensure reasonable scoring
    if (complianceScore < 0 || complianceScore > 100) {
      complianceScore = 85;
    }
    
    // If no critical issues found, ensure good score
    if (issues.length === 0 && complianceScore < 80) {
      complianceScore = 85;
    }
    
    // If many issues found, ensure score reflects that
    if (issues.length > 3 && complianceScore > 70) {
      complianceScore = Math.min(complianceScore, 65);
    }
    
    const wouldPass = complianceScore >= 80;
    
    console.log('🤖 Standalone AI Review completed:', { 
      issues: issues.length, 
      suggestions: suggestions.length, 
      score: complianceScore,
      wouldPass,
      reasoning: reasoning.substring(0, 100) + '...'
    });
    
    return { 
      issues, 
      suggestions, 
      complianceScore: Math.round(complianceScore),
      comparison: reasoning,
      wouldPass
    };
    
  } catch (error) {
    console.error('Error in AI review:', error);
    return performBasicReview(fileContent);
  }
}

// Enhanced fallback basic review function with reasonable scoring
function performBasicReview(fileContent: string): { 
  issues: string[]; 
  suggestions: string[]; 
  complianceScore: number;
  wouldPass: boolean;
} {
  const issues: string[] = [];
  const suggestions: string[] = [];
  let complianceScore = 85;

  const content = fileContent.toLowerCase();
  
  // Check for essential elements
  const hasInformedConsent = content.includes('informed consent') || 
                            content.includes('consent') ||
                            content.includes('participant consent');
  
  const hasRisks = content.includes('risk') || 
                  content.includes('discomfort') || 
                  content.includes('safety') ||
                  content.includes('benefit');
  
  const hasPurpose = content.includes('purpose') || 
                    content.includes('objective') || 
                    content.includes('aim') || 
                    content.includes('goal') ||
                    content.includes('study');
  
  const hasDataSecurity = content.includes('data') || 
                         content.includes('privacy') || 
                         content.includes('confidentiality') || 
                         content.includes('security') ||
                         content.includes('hipaa');
  
  const hasVoluntary = content.includes('voluntary') || 
                      content.includes('withdraw') || 
                      content.includes('right');

  // Only flag if clearly missing
  let missingElements = 0;
  
  if (!hasInformedConsent) {
    issues.push('Informed consent process not clearly described');
    suggestions.push('Add a section describing the informed consent process');
    missingElements++;
  }

  if (!hasRisks) {
    issues.push('Risk assessment not clearly addressed');
    suggestions.push('Include a section on potential risks and benefits');
    missingElements++;
  }

  if (!hasPurpose) {
    issues.push('Study purpose not clearly stated');
    suggestions.push('Clearly articulate the research objectives');
    missingElements++;
  }

  if (!hasDataSecurity) {
    issues.push('Data security and privacy measures not addressed');
    suggestions.push('Include data security protocols and privacy protections');
    missingElements++;
  }

  if (!hasVoluntary) {
    issues.push('Voluntary participation not explicitly stated');
    suggestions.push('Clearly state that participation is voluntary');
    missingElements++;
  }

  // More generous scoring
  if (missingElements === 0) {
    complianceScore = 90;
  } else if (missingElements === 1) {
    complianceScore = 85;
  } else if (missingElements === 2) {
    complianceScore = 75;
  } else if (missingElements === 3) {
    complianceScore = 65;
  } else {
    complianceScore = 55;
  }

  // Bonus for comprehensive documents
  if (fileContent.length > 1500) {
    complianceScore = Math.min(100, complianceScore + 5);
  }

  const wouldPass = complianceScore >= 80;

  console.log('🔍 Basic Review completed:', { 
    issues: issues.length, 
    suggestions: suggestions.length, 
    score: complianceScore,
    wouldPass,
    missingElements,
    contentLength: fileContent.length
  });

  return { 
    issues, 
    suggestions, 
    complianceScore: Math.round(complianceScore),
    wouldPass
  };
} 