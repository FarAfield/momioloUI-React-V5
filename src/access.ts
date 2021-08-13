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
export default function (initialState = {}) {
  const { permissions = [], menuData }: any = initialState;
  const routePathList: Array<any> = []; //页面路径
  getMenuPath(menuData, routePathList);
  return {
    routeFilter: ({ path }: any) => {
      // 此处可实现前端静态路由鉴权（已实现后端鉴权）
      return !!path;
    },
    // 鉴权方法（按钮级别）
    auth: (key: string) => permissions.includes(key),
    // 鉴权方法（路由级别）
    authRoute: (path: string) => routePathList.includes(path),
  };
}
