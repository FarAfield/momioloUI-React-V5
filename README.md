# momioloUi-React-V5

## React-V5 以 ant design pro v5 为基础

1.项目结构 
- config 项目必要配置以及不同环境代理配置 
- mock 存放基础 mock 接口
 - public 静态资源目录 
 - src 项目主文件 
    - components 公共组件 
    - models 全局 model
    - pages 页面 
    - utils 工具类
    - app.ts 项目启动入口 
 - md 文档

2.关于 app.ts 功能 
- ①getInitialState 整个应用初始时执行，返回值作为全局共享数据。 
- ②request 统一请求工具，其他配置可参照 umi-request 
- ③layoutActionRef 用于手动控制菜单刷新 
- ④layout 配置 proLayout 
- 注意：登录页与基础页属于不同布局，通过 initialState 中的 menuData 来控制是否启用 layout，需要在登录以及退出登录时更新 initialState 中的数据并同时手动刷新菜单
