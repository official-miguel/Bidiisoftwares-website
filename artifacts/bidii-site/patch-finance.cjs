// One-shot patch — run with: node patch-finance.cjs
// Delete after running.
const fs = require('fs');
const path = require('path');

const file = path.resolve(__dirname, 'src/App.tsx');
let c = fs.readFileSync(file, 'utf8');

// 1. Remove the financeScreenshot import line
const importLine = "import financeScreenshot from '@assets/Screenshot_(106)_1787081748997.png';\n";
if (c.includes(importLine)) {
  c = c.replace(importLine, '');
  console.log('Removed import line');
} else {
  console.log('Import line not found — skipping');
}

// 2. Remove image: financeScreenshot from the Finance feature entry
// and update detail text
const oldFinance = ", detail: 'A real Bidii screen \xb7 add more finance views here', image: financeScreenshot }";
const newFinance = ", detail: 'KES 84,600 collected this term' }";
if (c.includes(oldFinance)) {
  c = c.replace(oldFinance, newFinance);
  console.log('Updated Finance feature entry');
} else {
  console.log('Finance entry not found — skipping');
}

fs.writeFileSync(file, c, 'utf8');
console.log('Patch complete. File size:', c.length);
