import * as esbuild from "esbuild";
import copy from "esbuild-plugin-copy-watch";

export const buildOptions = {
	entryPoints: [
		"./src/content-scripts/content-script.ts",
		"./src/options/options.ts",
		"./src/background/background.ts",
	],
	bundle: true,
	outdir: "dist",
	outbase: "src",
	platform: "browser",
	sourcemap: true,
	minify: false,
	plugins: [
		copy({
			paths: [
				{
					from: "./src/icons/**/*",
					to: "./icons",
				},
				{
					from: "./src/manifest.json",
					to: "./",
				},
				{
					from: ["./src/common/**/*.css"],
					to: "./common",
				},
				{
					from: ["./src/options/**/*.html", "./src/options/**/*.css"],
					to: "./options",
				},
			],
		}),
	],
};

esbuild.build(buildOptions).catch(() => process.exit(1));
