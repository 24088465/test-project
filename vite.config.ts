import { defineConfig, UserConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import vueJsx from '@vitejs/plugin-vue-jsx';

import resolveExternalsPlugin from 'vite-plugin-resolve-externals';
// import vueSetupExtend from 'vite-plugin-vue-setup-extend-plus';

// https://vitejs.dev/config/
export default defineConfig((): UserConfig => {
  return {
    plugins: [
      vue(),
      vueJsx(),
      resolveExternalsPlugin({
        AMap: 'AMap',
      }),

      // vueSetupExtend.default(),
      // eslintPlugin({
      //   include: [
      //     'src/**/*.js',
      //     'src/**/*.ts',
      //     'src/**/*.vue',
      //     'src/*.js',
      //     'src/*.ts',
      //     'src/*.vue',
      //   ],
      // }),
    ],

    build: {
      rollupOptions: {
        //external: ['@amap/amap-jsapi-loader'],
      },
    },
    resolve: {
      alias: {
        // 配置别名指向src目录
        '@': resolve(__dirname, 'src'),
        'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js',
        //'@amap/amap-jsapi-loader': '@amap/amap-jsapi-loader/dist/index.esm.js', 
      },
      // 使用别名的文件后缀
      extensions: ['.js', '.json', '.ts', '.tsx'],
      
    },
    server: {
      proxy: {
        '/': {
          target: 'http://101.201.105.132:8090',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/downloads/, ''),
          // 不需要 rewrite，因为不需要去掉前缀
        },
      },
    },
    esbuild: {
      drop: ['console', 'debugger'],
    },
  };
});
