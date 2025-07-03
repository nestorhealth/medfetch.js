#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🧹 Clearing all hospital cleaning data...\n');

// Data files to remove
const dataFiles = [
  'data/irb-submissions.json',
  'data/workflows.json', 
  'data/seedDatasets.json'
];

// Directories to clear
const directories = [
  'public/seeds',
  'cleaned-data',
  'fhir-data'
];

// Remove data files
console.log('📄 Removing data files:');
dataFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    console.log(`  ✅ Deleted: ${file}`);
  } else {
    console.log(`  ⚠️  Not found: ${file}`);
  }
});

// Clear directories
console.log('\n📁 Clearing directories:');
directories.forEach(dir => {
  const dirPath = path.join(process.cwd(), dir);
  if (fs.existsSync(dirPath)) {
    // Remove all files in directory
    const files = fs.readdirSync(dirPath);
    files.forEach(file => {
      const filePath = path.join(dirPath, file);
      const stats = fs.statSync(filePath);
      if (stats.isFile()) {
        fs.unlinkSync(filePath);
        console.log(`  ✅ Deleted: ${dir}/${file}`);
      } else if (stats.isDirectory()) {
        fs.rmSync(filePath, { recursive: true, force: true });
        console.log(`  ✅ Deleted: ${dir}/${file}/`);
      }
    });
    console.log(`  🗂️  Cleared: ${dir}/`);
  } else {
    console.log(`  ⚠️  Directory not found: ${dir}/`);
  }
});

console.log('\n✅ Data clearing completed!');
console.log('\n📋 Summary:');
console.log('  - IRB submissions cleared');
console.log('  - Workflows cleared');
console.log('  - Seed datasets cleared');
console.log('  - Processed data files cleared');
console.log('  - Raw FHIR data cleared');
console.log('\n🔄 You may want to restart the servers for a completely fresh start.');
console.log('   Run: npm run restart-servers (if available) or restart manually.'); 