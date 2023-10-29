import terser from "@rollup/plugin-terser";  // 不用解构出来 有默认导出
import nodeResolve from "@rollup/plugin-node-resolve";
import obfuscator from 'rollup-plugin-obfuscator';


export default {
    input: "./src/main.js",
    plugins: [
        nodeResolve(),
        obfuscator({
            options: {
                // Your javascript-obfuscator options here
                // See what's allowed: https://github.com/javascript-obfuscator/javascript-obfuscator
            },
        }),
    ],
    output: {
        dir: "dist",
        // file: "bundle.js",
        entryFileNames: "[name]-[hash].js",
        format: "cjs",
        plugins: [
            terser(),
        ],
    },
}