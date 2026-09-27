const { execSync } = require('child_process');
const fs = require('fs');
const vm = require('vm');

console.log('Extracting fresh files from nmimsgdg-main.zip...');
execSync('powershell -Command "Expand-Archive -Path nmimsgdg-main.zip -DestinationPath temp_extract -Force"');

console.log('Restoring clean index-CxpCrW08.js...');
fs.copyFileSync('temp_extract/nmimsgdg-main/assets/index-CxpCrW08.js', 'assets/index-CxpCrW08.js');
if (fs.existsSync('nmimsgdg-main/assets/index-CxpCrW08.js')) {
  fs.copyFileSync('temp_extract/nmimsgdg-main/assets/index-CxpCrW08.js', 'nmimsgdg-main/assets/index-CxpCrW08.js');
}

// Clean up temp_extract
fs.rmSync('temp_extract', { recursive: true, force: true });

// Verify syntax
const code = fs.readFileSync('assets/index-CxpCrW08.js', 'utf8');
new vm.Script(code);
console.log('Successfully restored pristine JS bundle. Syntax is 100% valid!');
