// https://umijs.org/config/
import { defineConfig } from 'umi';
import proxy from './proxy';

const { REACT_APP_ENV } = process.env;
export default defineConfig({
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  history: {
    type: 'hash',
  },
  // https://umijs.org/zh-CN/plugins/plugin-layout
  layout: {
    name: 'Momiolo',
    locale: true,
    layout: 'side',
    siderWidth: 208,
    breakpoint:false,
  },
  dynamicImport: {
    loading: '@ant-design/pro-layout/es/PageLoading',
  },
  targets: {
    ie: 11,
  },
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': '#13C2C2',
  },
  // esbuild is father build tools
  // https://umijs.org/plugins/plugin-esbuild
  esbuild: {},
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'pre'],
  manifest: {
    basePath: '/',
  },
  // Fast Refresh 热更新
  fastRefresh: {},
  nodeModulesTransform: { type: 'none' },
  mfsu: {},
  webpack5: {},
  exportStatic: {},
});
