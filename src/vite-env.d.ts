/// <reference types="vite/client" />
/// <reference types="element-plus/global.d.ts" />

declare module '*.vue' {
  import { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module 'vue3-particles';
declare module 'element-plus/dist/locale/zh-cn.mjs';
declare module 'mockjs';

declare module 'Uint8Array';
declare module 'window';
