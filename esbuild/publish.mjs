import * as esbuild from "esbuild";
import copy from "esbuild-plugin-copy-watch";

const buildOptions = {
	bundle: false,
	outdir: "dist-src",
	// outbase: "src",
	platform: "browser",
	sourcemap: false,
	minify: false,
	plugins: [
		copy({
			paths: [
				{
					from: "./src/**/*",
					to: "./src/",
				},
				{
					from: "./esbuild/**/*",
					to: "./esbuild/",
				},
				{
					from: "./*",
					to: "./",
				},
			],
		}),
	],
};

esbuild.build(buildOptions).catch(() => process.exit(1));
