const { build } = require('esbuild');

const DEV = process.argv.includes('--dev');
const ACT = process.argv.includes('--action');

// Build action
ACT && build({
    entryPoints: ['./src/action.js'],
    platform: 'node',
    format: "cjs",
    outfile: 'dist/action.js',
    minify: true,
    sourcemap: false,
    bundle: true
});

// Build Test
DEV && build({
    entryPoints: ['./src/test.js'],
    outfile: 'dist/test.js',
    platform: 'node',
    format: "cjs",
    sourcemap: 'inline',
    minify: false,
    bundle: true,
});