import { DefaultFooter } from '@ant-design/pro-layout';
import { copyRight, copyRightConfig } from '@/utils/constant';

const links = copyRightConfig.map((i: any, index: number) => {
  const item = { ...i };
  item.key = `${i.title}-${index}`;
  item.blankTarget = true;
  return item;
});
export default () => {
  return <DefaultFooter copyright={`${new Date().getFullYear()} ${copyRight}`} links={links} />;
};
