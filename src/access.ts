export default function (initialState = {}) {
  const { permissions = [] }: any = initialState;
  return {
    routeFilter: ({ path }: any) => {
      // 此处可实现前端静态路由鉴权（已实现后端鉴权）
      // 前端403鉴权实现位于app.ts中（针对不存在的路由鉴权）
      return !!path;
    },
    // 鉴权方法（按钮级别）
    auth: (key: string) => permissions.includes(key),
  };
}
