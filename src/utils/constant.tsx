import { GithubOutlined } from '@ant-design/icons';

/**
 *  系统常量配置
 */
// 主题颜色
export const ThemeConfig = [
  {
    key: '#1890ff',
    theme: '',
    name: '拂晓蓝',
    modifyVars: {
      '@primary-color': '#1890ff',
    },
  },
  {
    key: '#F5222D',
    theme: 'https://preview.pro.ant.design/theme/dust.css',
    name: '薄暮',
    modifyVars: {
      '@primary-color': '#F5222D',
    },
  },
  {
    key: '#FA541C',
    theme: 'https://preview.pro.ant.design/theme/volcano.css',
    name: '火山',
    modifyVars: {
      '@primary-color': '#FA541C',
    },
  },
  {
    key: '#FAAD14',
    theme: 'https://preview.pro.ant.design/theme/sunset.css',
    name: '日暮',
    modifyVars: {
      '@primary-color': '#FAAD14',
    },
  },
  {
    key: '#13C2C2',
    theme: 'https://preview.pro.ant.design/theme/cyan.css',
    name: '明青',
    modifyVars: {
      '@primary-color': '#13C2C2',
    },
  },
  {
    key: '#52C41A',
    theme: 'https://preview.pro.ant.design/theme/green.css',
    name: '极光绿',
    modifyVars: {
      '@primary-color': '#52C41A',
    },
  },
  {
    key: '#2F54EB',
    theme: 'https://preview.pro.ant.design/theme/geekblue.css',
    name: '极客蓝',
    modifyVars: {
      '@primary-color': '#2F54EB',
    },
  },
  {
    key: '#722ED1',
    theme: 'https://preview.pro.ant.design/theme/purple.css',
    name: '酱紫',
    modifyVars: {
      '@primary-color': '#722ED1',
    },
  },
];
// 请求状态码配置
export const requestErrorCodeConfig = {
  TOKEN_INVALID_ERROR: '10002',
  UNAUTHORIZED_ERROR: '10003',
};
// 全局样式配置
export const proSettings = {
  navTheme: 'dark',
  primaryColor: '#13C2C2',
  layout: 'side', // side top
  contentWidth: 'Fluid', // 默认Fluid，layout为top时可设置为Fixed
  fixedHeader: true, // 固定头部
  fixSiderbar: true, // 固定右边菜单,layout为side时可设置为true
  colorWeak: false,
  title: 'Momiolo',
  pwa: false,
  iconfontUrl: '',
};
// 登录页配置
export const loginPageConfig = {
  metaTitle: 'momiolo',
  title: 'Momiolo',
  loginDescription: 'Momiolo 是极具个性化的 Web 中台系统',
};
// 版权配置
export const copyRightConfig = [
  { title: 'react', href: 'https://react.docschina.org/docs/getting-started.html' },
  { title: <GithubOutlined />, href: 'https://github.com/FarAfield' },
  { title: 'vue', href: 'https://vue3js.cn/docs/zh/' },
];
// 版权信息
export const copyRight = '版权所有';
// 默认昵称以及头像配置
export const nickNameAndAvatar = [
  '管理员',
  'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
];
// 默认首页路径
export const homePath = '/Welcome';
