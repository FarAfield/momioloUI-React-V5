import { Link, useModel } from 'umi';
import { PageContainer, RouteContext } from '@ant-design/pro-layout';
import { Card } from 'antd';

/**
 *  面包屑处理
 */
function pageContainerProps(routes: Array<any>) {
  const breadcrumbData = [
    {
      path: '/Welcome',
      breadcrumbName: '首页',
    },
  ].concat(routes);
  return {
    title: breadcrumbData?.[breadcrumbData?.length - 1]?.breadcrumbName,
    breadcrumb: {
      routes: breadcrumbData,
      itemRender: (route: any, params: any, routes: any) => {
        const first = routes.indexOf(route) === 0;
        return !first ? (
          <span>{route.breadcrumbName}</span>
        ) : (
          <Link to={'/Welcome'}>{route.breadcrumbName}</Link>
        );
      },
    },
  };
}
const PageCard = ({ children }: any) => {
  const { breadcrumbData } = useModel('global', (model: any) => ({
    breadcrumbData: model.breadcrumbData,
  }));
  return (
    <RouteContext.Consumer>
      {(value: any) => {
        const {
          breadcrumb: { routes },
        } = value;
        return (
          <PageContainer {...pageContainerProps(breadcrumbData.length ? breadcrumbData : routes)}>
            <Card>{children}</Card>
          </PageContainer>
        );
      }}
    </RouteContext.Consumer>
  );
};
export default PageCard;
