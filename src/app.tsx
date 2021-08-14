import {PageLoading} from '@ant-design/pro-layout';
import {history, RequestConfig} from 'umi';
import {createRef} from 'react';
import {message} from 'antd';
import RightContent from '@/components/RightContent';
import Footer from '@/components/Footer';
import {homePath, proSettings, requestErrorCodeConfig} from '@/utils/constant';
import {getToken, isLogin, storageClear} from '@/utils/tokenUtils';
import {createService, transformResponse} from '@/utils/requestUtils';
import {getIconByName} from '@/utils/support';
import logo from '../public/logo-white.svg';

const loginPath = '/user/login';
const findCurrentInfo = createService('/account/findCurrentInfo');
const findCurrentMenu = createService('/resource/findCurrentMenu');
async function fetchUserInfo() {
  const userInfo = transformResponse(await findCurrentInfo(), true) || {};
  return {
    userInfo,
    permissions: userInfo.permissions || [],
  };
}

function formatMenu(menuData: any[], parentPath: string = '') {
  return menuData.map((item: any) => {
    // 非按钮
    if (item.resourceType !== 3) {
      const path = `${parentPath}/${item.resourceCode}`;
      item.path = path;
      item.name = `${item.resourceName}`;
      item.icon = item.resourceIcon;
      // 路由则隐藏
      item.hideInMenu = item.resourceType === 2;
      // 走统一路由权限过滤
      item.access = 'routeFilter';
      if (item.children?.length) {
        item.children = formatMenu(item.children, path);
      }
    }
    return item;
  });
}
async function fetchUserMenu() {
  const menuData = (transformResponse(await findCurrentMenu(), true) || {}).children || [];
  return formatMenu(menuData);
}

/** 执行getInitialState比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <PageLoading />,
};
/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * 整个应用最开始执行，返回值会作为全局共享的数据
 */
export async function getInitialState() {
  // 如果已登录且不处于登录页，则需要重新获取用户以及菜单数据
  if (isLogin() && history.location.pathname !== loginPath) {
    const { userInfo, permissions } = await fetchUserInfo();
    const menuData = await fetchUserMenu();
    return {
      userInfo,
      permissions,
      menuData,
      fetchUserInfo,
      fetchUserMenu,
      settings: proSettings,
    };
  }
  return {
    userInfo: {},
    permissions: [],
    menuData: [],
    fetchUserInfo,
    fetchUserMenu,
    settings: proSettings,
  };
}

/**
 *   网络请求工具
 */
const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};
const maxCountMessage = message;
maxCountMessage.config({ maxCount: 1 });
// ErrorHandle
const errorHandler = async (error: any) => {
  const { response } = error;
  if (!response) {
    maxCountMessage.error('请求超时');
  } else if (response.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    const { status, url } = response;
    console.error(`请求状态：${status}  请求路径：${url}`);
    maxCountMessage.error(errorText);
  }
  throw error;
};
// 请求拦截器
const RequestInterceptor = (url: string, options: any) => {
  const token = getToken();
  return {
    url,
    options: {
      ...options,
      headers: token ? { Authorization: `${token}` } : {},
      interceptors: true,
    },
  };
};
// 响应拦截器
const ResponseInterceptor = async (response: any) => {
  // 非200状态的返回以及异常均由errorHandle处理
  if (response.status === 200) {
    const res = await response.clone().json();
    if (res?.statusCode) {
      if (res.statusCode === requestErrorCodeConfig.TOKEN_INVALID_ERROR) {
        maxCountMessage.error('登陆已失效，请重新登陆！');
        storageClear();
        history.replace(loginPath);
      }
      if (res.statusCode === requestErrorCodeConfig.UNAUTHORIZED_ERROR) {
        maxCountMessage.error('抱歉，您暂无此权限！');
      }
      if (res.statusCode !== '0') {
        // todo 统一业务错误处理
        console.error(res.statusMessage);
      }
    }
  }
  return response;
};
export const request: RequestConfig = {
  errorHandler,
  requestInterceptors: [RequestInterceptor],
  responseInterceptors: [ResponseInterceptor],
  credentials: 'include', // 默认请求是否带上cookie
  useCache: false, // 是否使用缓存
  prefix: '/base',
  timeout: 30000, // 30s
};

/**
 *   布局组件layout
 *
 */
const getMenuPath = (array: any[], result: any[]) => {
  array.forEach((item: any) => {
    if (item.resourceType !== 3) {
      result.push(item.path);
      if (item.children?.length) {
        getMenuPath(item.children, result);
      }
    }
  });
};
export const layoutActionRef = createRef<{ reload: () => void }>();
//  https://umijs.org/zh-CN/plugins/plugin-layout#layout
//  https://beta-pro.ant.design/docs/advanced-menu-cn
//  https://procomponents.ant.design/components/layout
export const layout = ({ initialState }: any) => {
  const routePathList: Array<any> = ['/Welcome', '/user/center', '/user/setting']; //无需鉴权页面路径
  getMenuPath(initialState?.menuData || [], routePathList);
  return {
    actionRef: layoutActionRef, // 使用此ref用于刷新菜单数据（登陆成功以及退出登录调用）
    pure: !initialState?.menuData?.length, // 若无菜单数据则隐藏布局
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    waterMarkProps: {
      content: initialState?.currentUser?.accountName,
    },
    footerRender: () => <Footer />,
    onPageChange: () => {
      const {
        location: { pathname },
      } = history;
      // 如果没有登录，重定向到 login
      if (!isLogin() && pathname !== loginPath) {
        history.replace(loginPath);
      }
      // 如果无权访问或者路径不匹配，到403页面
      if (isLogin() && !routePathList.includes(pathname)) {
        history.push('/Exception/Exception403');
      }
    },
    links: [],
    logo,
    onMenuHeaderClick: () => history.push(homePath),
    menuHeaderRender: undefined,
    menuItemRender: (item: any, dom: any) => {
      return (
        <div onClick={() => history.push(item.path)}>
          {getIconByName(item.icon)}
          {dom}
        </div>
      );
    },
    subMenuItemRender: (item: any, dom: any) => {
      return (
        <div>
          {getIconByName(item.icon)}
          {dom}
        </div>
      );
    },
    menu: {
      // 每次initialState.menuData变化就重新读取菜单数据
      params: initialState?.menuData,
      request: async () => {
        return initialState?.menuData || [];
      },
    },
    ...initialState?.settings,
  };
};
