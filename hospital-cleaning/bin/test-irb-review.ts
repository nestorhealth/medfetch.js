#!/usr/bin/env tsx

import { readFileSync } from 'fs';
import { join } from 'path';

// Import the standalone AI review function
import { performStandaloneAIReview } from '../utils/standaloneIRBReview';

async function testIRBReview(irbPath: string, description: string) {
  console.log(`\n🧪 Testing IRB Review: ${description}`);
  console.log('=' .repeat(60));
  
  try {
    // Read IRB file
    const irbContent = readFileSync(irbPath, 'utf8');
    console.log(`📄 IRB Content Length: ${irbContent.length} characters`);
    
    // Perform AI review
    console.log('\n🔍 Performing AI Review...');
    const aiReview = await performStandaloneAIReview(irbContent);
    
    // Display results
    console.log('\n📊 AI Review Results:');
    console.log(`   - Compliance Score: ${aiReview.complianceScore}%`);
    console.log(`   - Issues Found: ${aiReview.issues.length}`);
    console.log(`   - Suggestions: ${aiReview.suggestions.length}`);
    
    if (aiReview.issues.length > 0) {
      console.log('\n❌ Issues Found:');
      aiReview.issues.forEach((issue: string, index: number) => {
        console.log(`   ${index + 1}. ${issue}`);
      });
    }
    
    if (aiReview.suggestions.length > 0) {
      console.log('\n💡 Suggestions:');
      aiReview.suggestions.forEach((suggestion: string, index: number) => {
        console.log(`   ${index + 1}. ${suggestion}`);
      });
    }
    
    if (aiReview.comparison) {
      console.log('\n📋 Comparison Analysis:');
      console.log(aiReview.comparison);
    }
    
    // Determine if IRB would pass review
    const wouldPass = aiReview.complianceScore >= 80;
    console.log(`\n${wouldPass ? '✅' : '❌'} IRB Review Result: ${wouldPass ? 'PASS' : 'FAIL'} (Score: ${aiReview.complianceScore}%)`);
    
    return {
      success: true,
      aiReview,
      wouldPass
    };
    
  } catch (error) {
    console.error(`❌ Error testing IRB review: ${error}`);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

async function main() {
  console.log('🧪 IRB Review Testing');
  console.log('======================');
  
  const testIRBs = [
    { path: 'test-irbs/good-cardiovascular-study.txt', description: 'Good Cardiovascular Study' },
    { path: 'test-irbs/good-diabetes-study.txt', description: 'Good Diabetes Study' },
    { path: 'test-irbs/bad-missing-consent.txt', description: 'Bad IRB - Missing Consent' },
    { path: 'test-irbs/bad-no-risk-assessment.txt', description: 'Bad IRB - No Risk Assessment' },
    { path: 'test-irbs/bad-incomplete.txt', description: 'Bad IRB - Incomplete' }
  ];
  
  const results = [];
  
  for (const irbTest of testIRBs) {
    const result = await testIRBReview(join(process.cwd(), irbTest.path), irbTest.description);
    results.push({
      ...irbTest,
      result
    });
  }
  
  // Summary
  console.log('\n📊 Test Summary');
  console.log('================');
  
  const successfulTests = results.filter(r => r.result.success);
  const failedTests = results.filter(r => !r.result.success);
  const passingIRBs = successfulTests.filter(r => r.result.wouldPass);
  const failingIRBs = successfulTests.filter(r => !r.result.wouldPass);
  
  console.log(`✅ Successful Tests: ${successfulTests.length}`);
  console.log(`❌ Failed Tests: ${failedTests.length}`);
  console.log(`✅ Passing IRBs: ${passingIRBs.length}`);
  console.log(`❌ Failing IRBs: ${failingIRBs.length}`);
  
  if (passingIRBs.length > 0) {
    console.log('\n✅ Passing IRBs:');
    passingIRBs.forEach(test => {
      console.log(`   - ${test.description}: ${test.result.aiReview?.complianceScore}%`);
    });
  }
  
  if (failingIRBs.length > 0) {
    console.log('\n❌ Failing IRBs:');
    failingIRBs.forEach(test => {
      console.log(`   - ${test.description}: ${test.result.aiReview?.complianceScore}%`);
    });
  }
  
  if (failedTests.length > 0) {
    console.log('\n❌ Failed Test Results:');
    failedTests.forEach(test => {
      console.log(`   - ${test.description}: ${test.result.error}`);
    });
  }
  
  console.log('\n✅ IRB Review Testing completed!');
}

main().catch(console.error); 