import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import terser from "@rollup/plugin-terser";  // 不用解构出来 有默认导出

import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
      imports: ['vue'],
    }),
    Components({
      resolvers: [
        ElementPlusResolver(),
      ],
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        dir: 'dist',
        // manualChunks: {
        //   echarts: ['echarts'],
        //   lodash: ['lodash'],
        // },
        plugins: [
          terser(),
        ],
        manualChunks(id) {
          if (id.includes("node_modules/lodash-es")) {
            return "vendor-lodash" //代码分割为第三方包
          }
          if (id.includes("node_modules/axios")) {
            return "vendor-axios" //代码分割为第三方包
          }
          if (id.includes("views/controller/setting") || id.includes("views/controller/sign") || id.includes("views/controller/sent") || id.includes("views/visitor")){
            return "views-controller-setting"
          }
          if (id.includes("views/controller/log")){
            return "views-controller-log"
          }
          if (id.includes("views/controller")) {
            return "views-controller"
          }
          if (id.includes('node_modules')) {
            const arr = id.toString().split('node_modules/')[1].split('/')
            switch(arr[0]) {
              case '@vue':
              case 'element-plus':
                return '_' + arr[0]
              default :
                return '__vendor'
            }
          }
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
})
