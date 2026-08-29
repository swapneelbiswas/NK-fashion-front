#!/usr/bin/env node
const { execSync } = require('child_process');

// Get arguments passed after `npm run g:pages`
const args = process.argv.slice(2);

if (args.length === 0) {
    console.error('Usage: npm run g:pages <subfolder/component-name>');
    process.exit(1);
}

// Prepend "pages/" to the path
const componentPath = ['pages', ...args].join('/');

console.log(`Generating component at src/app/${componentPath} ...`);

// Run Angular CLI
try {
    execSync(`ng g component ${componentPath}`, { stdio: 'inherit' });
} catch (err) {
    console.error('Error generating component:', err.message);
    process.exit(1);
}
