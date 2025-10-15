const fs = require('fs');
const path = require('path');

// Directory containing UI components
const uiComponentsDir = '/Users/anshumanprajapati/Documents/Projects/flow-reel/flow-reel-ui/src/components/ui';

// Files to fix - add all remaining files that need fixing
const filesToFix = [
  'drawer.jsx',
  'dropdown-menu.jsx',
  'form.jsx',
  'hover-card.jsx',
  'input-otp.jsx',
  'label.jsx', // Corrected from lable.jsx
  'menubar.jsx',
  'navigation-menu.jsx',
  'pagination.jsx',
  'popover.jsx',
  'progress.jsx',
  'radio-group.jsx',
  'resizable.jsx',
  'scroll-area.jsx',
  'select.jsx',
  'separator.jsx',
  'sheet.jsx',
  'sidebar.jsx'
];

// Common fixes to apply
function fixJsxFile(content) {
  // Fix React import
  content = content.replace(/import \*\s+from "react";/g, 'import * as React from "react";');
  
  // Fix other common imports
  content = content.replace(/import \*\s+from "([^"]+)";/g, (match, p1) => {
    // Extract the module name from the path
    const moduleName = p1.split('/').pop();
    const capitalizedName = moduleName
      .split('-')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join('');
    
    return `import * as ${capitalizedName} from "${p1}";`;
  });
  
  // Fix forwardRef syntax
  content = content.replace(/React\.forwardRef>/g, 'React.forwardRef');
  
  // Fix TypeScript type annotations
  content = content.replace(/<[^>]*>/g, '');
  
  // Fix incomplete component implementations with empty returns
  content = content.replace(/\(\{ ([^}]*) \}, ref\) => \s*\n/g, '({ $1 }, ref) => (\n    <div ref={ref} {...props} />\n  )');
  
  // Fix missing return statements
  content = content.replace(/return\s*;/g, 'return null;');
  
  // Fix broken className strings
  content = content.replace(/"([^"]*),\s*([^"]*)"/g, '"$1 $2"');
  
  // Fix broken JSX closing tags
  content = content.replace(/(\s*)\n\s*\)/g, '$1/>)');
  
  // Fix broken component props
  content = content.replace(/\{\.\.\.(props|rest)\}/g, '{...$1}');
  
  // Remove TypeScript interface and type declarations
  content = content.replace(/export (interface|type) [^;]*;/g, '');
  
  // Fix broken cva calls
  content = content.replace(/cva\(\s*"([^"]*)",\s*\{([^}]*)\}\s*,\s*\);/g, 'cva(\n  "$1",\n  {$2}\n);');
  
  return content;
}

// Process each file
filesToFix.forEach(fileName => {
  const filePath = path.join(uiComponentsDir, fileName);
  
  // Check if file exists
  if (fs.existsSync(filePath)) {
    console.log(`Fixing ${fileName}...`);
    
    try {
      // Read file content
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Apply fixes
      content = fixJsxFile(content);
      
      // Write fixed content back to file
      fs.writeFileSync(filePath, content);
      
      console.log(`✅ Fixed ${fileName}`);
    } catch (error) {
      console.error(`❌ Error fixing ${fileName}:`, error.message);
    }
  } else {
    console.log(`⚠️ File not found: ${fileName}`);
  }
});

console.log('All files processed.');