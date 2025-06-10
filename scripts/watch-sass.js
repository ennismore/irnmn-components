#!/usr/bin/env node

/**
 * Compile a given SCSS file to its corresponding dist/css/style.css output.
 * For example: src/components/foo/style.scss → src/components/foo/dist/css/style.css
 */

const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const input = process.argv[2];

if (!input) {
    console.error('No input file provided.');
    process.exit(1);
}

const inputAbs = path.resolve(input);
const baseDir = path.dirname(inputAbs);
const outputDir = path.join(baseDir, 'dist/css');
const outputFile = path.join(outputDir, 'style.css');

// Ensure the output directory exists
fs.mkdirSync(outputDir, { recursive: true });

console.log(`[sass] Compiling: ${input} → ${outputFile}`);

// Run sass
exec(`npx sass "${inputAbs}" "${outputFile}"`, (err, stdout, stderr) => {
    if (err) {
        console.error(`[sass] Error compiling ${input}:`, stderr);
        return;
    }
    if (stdout) console.log(stdout);
});
