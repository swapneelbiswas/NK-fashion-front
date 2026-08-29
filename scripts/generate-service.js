#!/usr/bin/env node
const { execSync } = require('child_process');

// Get arguments passed after `npm run g:service`
const args = process.argv.slice(2);

if (args.length === 0) {
    console.error('Usage: npm run g:service <subfolder/service-name>');
    process.exit(1);
}

// Prepend "services/" to the path
const servicePath = ['services', ...args].join('/');

console.log(`Generating service at src/app/${servicePath} ...`);

// Run Angular CLI
try {
    execSync(`ng g service ${servicePath}`, { stdio: 'inherit' });
} catch (err) {
    console.error('Error generating service:', err.message);
    process.exit(1);
}
