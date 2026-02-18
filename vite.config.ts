import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],

  // Build configuration
  build: {
    outDir: 'dist',
    sourcemap: true,
    // 代码分割
    rollupOptions: {
      output: {
        manualChunks: {
          // 将核心React库分离到单独的chunk
          'react-core': ['react', 'react-dom', 'react-router'],
          // 将UI库分离到单独的chunk
          'ui-libs': ['lucide-react', '@radix-ui/react-icons', '@radix-ui/react-avatar', '@radix-ui/react-dialog', '@radix-ui/react-tabs'],
          // 将API相关库分离到单独的chunk
          'api-libs': ['axios', 'socket.io-client'],
          // 将表单处理库分离到单独的chunk
          'form-libs': ['react-hook-form'],
          // 将图表库分离到单独的chunk
          'chart-libs': ['recharts'],
          // 将日期处理库分离到单独的chunk
          'date-libs': ['date-fns', 'react-day-picker'],
          // 将支付处理库分离到单独的chunk
          'payment-libs': ['@stripe/react-stripe-js', '@stripe/stripe-js'],
          // 将动画库分离到单独的chunk
          'animation-libs': ['motion'],
          // 将拖放库分离到单独的chunk
          'dnd-libs': ['react-dnd', 'react-dnd-html5-backend'],
          // 将轮播库分离到单独的chunk
          'carousel-libs': ['embla-carousel-react', 'react-slick'],
        },
      },
    },
  },

  // 开发服务器配置
  server: {
    port: 5173,
    open: true,
  },
})
