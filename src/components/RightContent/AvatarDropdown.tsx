import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Menu, Spin, message } from 'antd';
import { history, useModel } from 'umi';
import HeaderDropdown from '../HeaderDropdown';
import { createService, isSuccess } from '@/utils/requestUtils';
import { storageClear } from '@/utils/tokenUtils';
import { nickNameAndAvatar } from '@/utils/constant';
import styles from './index.less';

const logout = createService('/account/logout', 'post');
const AvatarDropdown = () => {
  const { initialState, setInitialState } = useModel('@@initialState');

  async function handleLogout() {
    const res = await logout();
    if (isSuccess(res)) {
      await setInitialState((s: any) => ({
        ...s,
        userInfo: {},
        permissions: [],
        menuData: [],
      }));
      storageClear();
      history.push('/user/login');
    } else {
      message.info(res?.statusMessage);
    }
  }

  const onMenuClick = async ({ key }: any) => {
    switch (key) {
      case 'center': {
        history.push('/user/center');
        break;
      }
      case 'settings': {
        history.push('/user/setting');
        break;
      }
      case 'logout': {
        handleLogout();
        break;
      }
      default:
        break;
    }
  };

  const loading = (
    <span className={`${styles.action} ${styles.account}`}>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  );
  if (!initialState?.userInfo?.accountSid) {
    return loading;
  }
  const menuHeaderDropdown = (
    <Menu className={styles.menu} onClick={(e) => onMenuClick(e)}>
      <Menu.Item key="center">
        <UserOutlined />
        个人中心
      </Menu.Item>
      <Menu.Item key="settings">
        <SettingOutlined />
        个人设置
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout">
        <LogoutOutlined />
        退出登录
      </Menu.Item>
    </Menu>
  );
  return (
    <HeaderDropdown overlay={menuHeaderDropdown}>
      <span className={`${styles.action} ${styles.account}`}>
        <Avatar
          size="small"
          className={styles.avatar}
          src={initialState?.userInfo?.userAvatar || nickNameAndAvatar[1]}
          alt="avatar"
        />
        <span>{initialState?.userInfo?.userName || nickNameAndAvatar[0]}</span>
      </span>
    </HeaderDropdown>
  );
};

export default AvatarDropdown;
