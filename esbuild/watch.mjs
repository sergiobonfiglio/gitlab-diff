import * as esbuild from 'esbuild'
import {buildOptions} from './build.mjs'

let ctx = await esbuild.context(buildOptions)

await ctx.watch()
console.log('watching...')