#!/usr/bin/env node
const { execSync } = require('child_process');

// Get arguments passed after `npm run g:interceptor`
const args = process.argv.slice(2);

if (args.length === 0) {
    console.error('Usage: npm run g:interceptor <interceptor-name>');
    process.exit(1);
}

// Prepend "interceptors/" to the path
const interceptorPath = ['interceptors', ...args].join('/');

console.log(`Generating interceptor at src/app/${interceptorPath} ...`);

// Run Angular CLI
try {
    execSync(`ng g interceptor ${interceptorPath}`, { stdio: 'inherit' });
} catch (err) {
    console.error('Error generating interceptor:', err.message);
    process.exit(1);
}
