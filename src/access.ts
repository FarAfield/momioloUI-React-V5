export default function (initialState = {}) {
  const { permissions = [] }: any = initialState;
  return {
    routeFilter: ({ path }: any) => {
      // 此处可实现前端静态路由鉴权（已实现后端鉴权）
      return !!path;
    },
    // 鉴权方法（按钮级别）
    auth: (key: string) => permissions.includes(key),
  };
}
