await Bun.build({
	entrypoints: ['./index.ts'],
	outdir: './output/vscan',
    bytecode: true,
    minify: true,
    compile: 'bun-windows-x64',
	define: {
		BUILD_VERSION: '"0.0.4"',
		BUILD_TIME: `"${new Date()}"`,
		DEBUG: 'false',
	},
});