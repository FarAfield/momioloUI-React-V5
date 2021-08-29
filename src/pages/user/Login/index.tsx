import { useEffect, useState } from 'react';
import { history, Link, useModel } from 'umi';
import { Button, Checkbox, Form, Input, message, notification } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import md5 from 'md5';
import Footer from '@/components/Footer';
import { homePath, loginPageConfig } from '@/utils/constant';
import { createService, isSuccess } from '@/utils/requestUtils';
import { isLogin, setToken } from '@/utils/tokenUtils';
import { layoutActionRef } from '@/app';
import logo from '../../../../public/logo.svg';
import styles from './index.less';

const login = createService('/account/login', 'post');
const Login = () => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const [loading, setLoading] = useState(false);

  /** 如果已登录，直接跳转到首页*/
  useEffect(() => {
    if (isLogin()) {
      history.push(homePath);
    }
  }, []);

  const loginSuccess = async (token: string) => {
    setToken(token);
    setLoading(true);
    const { userInfo, permissions }: any = await initialState?.fetchUserInfo?.();
    const menuData = await initialState?.fetchUserMenu?.();
    setLoading(false);
    setInitialState((s: any) => ({
      ...s,
      userInfo,
      permissions,
      menuData,
    })).then(() => {
      // 登陆成功后刷新菜单数据
      layoutActionRef?.current?.reload?.();
      // 给超级管理员一个惊喜
      if(userInfo.accountName === 'momiolo'){
        message.success('尊敬的超级管理员，欢迎使用！')
      }
      history.push(homePath);
    });
  };

  const onFinish = async ({ accountName, accountPassword }: any) => {
    setLoading(true);
    const response = await login({
      accountName,
      accountPassword: md5(accountPassword),
    });
    setLoading(false);
    if (!isSuccess(response)) {
      notification.error({
        message: response.statusMessage,
      });
    } else {
      loginSuccess(response.data?.token);
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.top}>
          <div className={styles.header}>
            <Link to="/user/login">
              <img alt="logo" className={styles.logo} src={logo} />
              <span className={styles.title}>{loginPageConfig.title}</span>
            </Link>
          </div>
          <div className={styles.desc}>{loginPageConfig.loginDescription}</div>
        </div>
        <div className={styles.main}>
          <Form onFinish={onFinish}>
            <Form.Item
              name="accountName"
              rules={[
                { required: true, whitespace: true, message: '请输入登录账号！' },
                { max: 20, message: '最大字符长度为20！' },
              ]}
            >
              <Input
                size="large"
                addonBefore={<UserOutlined className={styles.prefixIcon} />}
                placeholder="请输入登录账号（momiolo）"
                maxLength={20}
                autoComplete="off"
              />
            </Form.Item>
            <Form.Item
              name="accountPassword"
              rules={[
                { required: true, whitespace: true, message: '请输入登录密码！' },
                { max: 20, message: '最大字符长度为20！' },
              ]}
            >
              <Input
                size="large"
                addonBefore={<LockOutlined className={styles.prefixIcon} />}
                type="password"
                placeholder="请输入登录密码（momiolo）"
                maxLength={20}
                autoComplete="off"
              />
            </Form.Item>
            <Form.Item>
              <Button
                size="large"
                type="primary"
                loading={loading}
                style={{ width: '100%' }}
                htmlType="submit"
              >
                登录
              </Button>
            </Form.Item>
          </Form>
          <div className={styles.action}>
            <Checkbox disabled>记住账号</Checkbox>
            <a onClick={() => message.info('敬请期待！')}>注册账号</a>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
export default Login;
