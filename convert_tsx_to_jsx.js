const fs = require('fs');
const path = require('path');

// Directory containing the .tsx files
const uiDir = '/Users/anshumanprajapati/Documents/Projects/flow-reel/flow-reel-ui/src/components/ui';

// Get all files in the directory
const allFiles = fs.readdirSync(uiDir);

// Process both .tsx files and fix existing .jsx files
allFiles.forEach(file => {
  const filePath = path.join(uiDir, file);
  
  // Skip directories
  if (fs.statSync(filePath).isDirectory()) return;
  
  // Handle .tsx files - convert to .jsx
  if (file.endsWith('.tsx')) {
    const jsxPath = path.join(uiDir, file.replace('.tsx', '.jsx'));
    
    // Read the .tsx file
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Convert TypeScript to JavaScript
    content = convertTsToJs(content);
    
    // Write the .jsx file
    fs.writeFileSync(jsxPath, content, 'utf8');
    console.log(`Converted ${file} to ${file.replace('.tsx', '.jsx')}`);
    
    // Delete the original .tsx file
    fs.unlinkSync(filePath);
    console.log(`Deleted original file: ${file}`);
  }
  // Fix existing .jsx files
  else if (file.endsWith('.jsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Fix any issues in the .jsx files
    content = fixJsxFile(content);
    
    // Write the fixed content back
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed ${file}`);
  }
});

// Function to convert TypeScript to JavaScript
function convertTsToJs(content) {
  return content
    // Remove import type statements but preserve named imports
    .replace(/import\s+type\s+(\w+)\s+from\s+["'](.+?)["'];/g, '')
    .replace(/import\s+{\s*type\s+(\w+)(?:\s*,\s*|\s*}\s*from)/g, 'import {$1 from')
    
    // Fix import statements with type keywords
    .replace(/import\s+{(.*?)}\s+from/g, (match, imports) => {
      const cleanedImports = imports
        .replace(/\s*type\s+(\w+)\s*,?/g, '$1,')
        .replace(/,\s*,/g, ',')
        .replace(/,\s*}/g, '}')
        .replace(/\s*,\s*$/, '');
      return `import {${cleanedImports}} from`;
    })
    
    // Remove generic type parameters
    .replace(/<[^<>]*?>[^<>]*?(?=[,);=])/g, '')
    
    // Remove interface declarations
    .replace(/export\s+interface\s+\w+\s*{[\s\S]*?}(?:\s*;)?/g, '')
    
    // Remove type declarations
    .replace(/export\s+type\s+.*?;/g, '')
    .replace(/type\s+\w+\s*=[\s\S]*?;/g, '')
    
    // Remove type annotations in function parameters
    .replace(/:\s*[^,)=]+(?=[,)=])/g, '')
    
    // Remove type assertions
    .replace(/as\s+\w+/g, '')
    
    // Fix React.forwardRef generic types
    .replace(/React\.forwardRef<.*?>\(/g, 'React.forwardRef(')
    
    // Fix any broken import statements
    .replace(/import\s*\*\s*from/g, 'import * as DefaultImport from');
}

// Function to fix issues in JSX files
function fixJsxFile(content) {
  // Fix broken import statements
  content = content.replace(/import\s*\*\s*from\s*["'](.+?)["'];/g, 'import * as DefaultImport from "$1";');
  
  // Fix any references to the default import
  if (content.includes('import * as DefaultImport from')) {
    // Extract the import path
    const importMatch = content.match(/import\s*\*\s*as\s*DefaultImport\s*from\s*["'](.+?)["'];/);
    if (importMatch) {
      const importPath = importMatch[1];
      
      // Try to determine the appropriate name from the path
      let importName = importPath.split('/').pop();
      importName = importName.charAt(0).toUpperCase() + importName.slice(1).replace(/-([a-z])/g, g => g[1].toUpperCase());
      
      // Replace DefaultImport with the appropriate name
      content = content.replace(/import\s*\*\s*as\s*DefaultImport\s*from\s*["'](.+?)["'];/g, 
                              `import * as ${importName} from "$1";`);
    }
  }
  
  return content;
}

console.log('Conversion and fixes complete!');