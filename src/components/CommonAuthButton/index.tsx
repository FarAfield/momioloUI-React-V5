import { Popconfirm, Button } from 'antd';
import { useAccess } from 'umi';

/**
 *  btns  数组
 *
 *  key  唯一标识，若为remove,添加danger样式
 *  title  按钮名称
 *  auth 权限
 *  onClick 点击事件
 *  disabled  禁用
 *  hide 隐藏
 *  pop 二次确认
 *  message 二次确认提示
 */

const simpleButton = (item: any) => (
  <Button
    key={item.key}
    type="primary"
    ghost
    size="small"
    danger={item.key === 'remove'}
    disabled={!!item.disabled}
    onClick={item.onClick}
    style={{ margin: 6 }}
  >
    {item.title}
  </Button>
);
const confirmButton = (item: any) => (
  <Popconfirm
    key={item.key}
    title={item.message}
    onConfirm={item.onClick}
    disabled={!!item.disabled}
  >
    <Button
      type="primary"
      ghost
      size="small"
      danger={item.key === 'remove'}
      disabled={!!item.disabled}
      style={{ margin: 6 }}
    >
      {item.title}
    </Button>
  </Popconfirm>
);
const CommonAuthButton = (props: any) => {
  const { btns } = props;
  const { auth }: any = useAccess();
  const authBtns = btns.filter((item: any) => auth(item.auth)).filter((i: any) => !i.hide);
  return authBtns.map((item: any) => (item.pop ? confirmButton(item) : simpleButton(item)));
};
export default CommonAuthButton;
