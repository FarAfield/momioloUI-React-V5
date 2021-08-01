import { useCallback, useMemo } from 'react';
import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Menu, Spin } from 'antd';
import { history, useModel } from 'umi';
import HeaderDropdown from '../HeaderDropdown';
import { createService } from '@/utils/requestUtils';
import { storageClear } from '@/utils/tokenUtils';
import { nickNameAndAvatar } from '@/utils/constant';
import styles from './index.less';

const logout = createService('/account/logout', 'post');
const AvatarDropdown = () => {
  const { initialState } = useModel('@@initialState');

  async function handleLogout() {
    await logout();
    storageClear();
    history.push('/user/login');
  }

  const onMenuClick = useCallback(async ({ key }: any) => {
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
        // setInitialState((s: object) => ({
        //   ...s,
        //   userInfo: {},
        //   permissions: [],
        //   menuData: [],
        // }));
        handleLogout();
        break;
      }
      default:
        break;
    }
  }, []);

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
  const menuHeaderDropdown = useMemo(
    () => (
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
    ),
    [],
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
