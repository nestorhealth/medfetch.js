#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env');

function verifyEnv() {
  // Check if .env file exists
  if (!fs.existsSync(envPath)) {
    console.error('❌ .env file not found in hospital-cleaning directory');
    process.exit(1);
  }

  // Read .env file
  const envContent = fs.readFileSync(envPath, 'utf-8');
  
  // Check for both API key variables
  const hasOpenAIKey = envContent.includes('OPENAI_API_KEY=');
  const hasPublicOpenAIKey = envContent.includes('NEXT_PUBLIC_OPENAI_API_KEY=');

  if (!hasOpenAIKey || !hasPublicOpenAIKey) {
    console.error('❌ .env file is missing required API keys');
    if (!hasOpenAIKey) console.error('  - OPENAI_API_KEY is missing');
    if (!hasPublicOpenAIKey) console.error('  - NEXT_PUBLIC_OPENAI_API_KEY is missing');
    console.error('\nPlease add both variables to your .env file:');
    console.error('OPENAI_API_KEY=your-api-key-here');
    console.error('NEXT_PUBLIC_OPENAI_API_KEY=your-api-key-here');
    process.exit(1);
  }

  console.log('✅ Environment variables verified');
  console.log('✅ .env file exists and contains both OpenAI API keys');
}

verifyEnv(); 