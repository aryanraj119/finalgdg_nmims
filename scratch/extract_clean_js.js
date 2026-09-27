const { execSync } = require('child_process');
const fs = require('fs');
const vm = require('vm');

console.log('Extracting fresh zip...');
execSync('powershell -Command "Expand-Archive -Path nmimsgdg-main.zip -DestinationPath fresh_zip_extract -Force"');

console.log('Replacing assets/index-CxpCrW08.js with clean file...');
const sourceFile = 'fresh_zip_extract/nmimsgdg-main/assets/index-CxpCrW08.js';
fs.copyFileSync(sourceFile, 'assets/index-CxpCrW08.js');
if (fs.existsSync('nmimsgdg-main/assets/index-CxpCrW08.js')) {
  fs.copyFileSync(sourceFile, 'nmimsgdg-main/assets/index-CxpCrW08.js');
}

// Clean up
fs.rmSync('fresh_zip_extract', { recursive: true, force: true });

// Check JS code
const code = fs.readFileSync('assets/index-CxpCrW08.js', 'utf8');
new vm.Script(code);
console.log('SUCCESS! assets/index-CxpCrW08.js has been restored and is 100% syntactically valid!');
