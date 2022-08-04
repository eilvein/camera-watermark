import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import * as pkg from './package.json'
import * as path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    define: {
        _APP_VERSION: JSON.stringify(pkg.version)
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
            '@components': path.resolve(__dirname, 'src/components'),
            '@utils': path.resolve(__dirname, 'src/utils'),
            '@assets': path.resolve(__dirname, 'src/assets'),
            '@api': path.resolve(__dirname, 'src/api'),
            '@config': path.resolve(__dirname, 'src/config')
        }
    },
    // 公共样式
    css: {
        // 此处添加全局scss🔥
        preprocessorOptions: {
            scss: {
                additionalData: '@import "@/assets/styles/app.scss";'
            }
        }
    },
    // 服务
    server: {
        host: '172.17.128.187',
        port: 8080,
        open: true,
        cors: true,
        proxy: {
            // '/api': {
            //     target: 'http://jsonplaceholder.typicode.com',
            //     changeOrigin: true,
            //     rewrite: (path) => path.replace(/^\/api/, '')
            // }
        }
    },
    // 打包后目录
    build: {
        // base: process.env.NODE_ENV === 'production' ? '/camera-watermark/' : '',
        outDir: 'dist',
        assetsDir: 'assets',
        rollupOptions: {
            output: {
                chunkFileNames: 'assets/js/[name]-[hash].js',
                entryFileNames: 'assets/js/[name]-[hash].js',
                assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
            }
        },
        assetsInlineLimit: 0,
        brotliSize: false
    },
    // 引入第三方的配置
    optimizeDeps: {
        include: []
    }
})
