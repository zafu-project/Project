import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Alert, message } from 'antd';
import React, { useState } from 'react';
import { ProFormText, LoginForm } from '@ant-design/pro-form';
import { history, useModel, router } from 'umi';
import Footer from '@/components/Footer';
import { login, createUser } from '@/services/ant-design-pro/api';
import styles from './index.less';

const LoginMessage = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

const Login = () => {
  const [userLoginState, setUserLoginState] = useState({});
  const [type, setType] = useState('account');
  const { initialState, setInitialState } = useModel('@@initialState');
  const [signMethod, setSignMethod] = useState('signIn');
  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      await setInitialState((s) => ({ ...s, currentUser: userInfo }));
    }
  };

  const handleSubmit = async (values) => {
    try {
      let msg = null;
      
      // 注册/登录
      if (signMethod === 'signUp') {
        // 根据web-odm接口，先注册账号成功后再请求获取token;
        const userMsg = await createUser({...values});
        if (userMsg) {
          msg = await login({ ...values });
        }
        
      } else {
        // 登录获取token
        msg = await login({ ...values });
      }

      if (msg.token) {
        // 设置token
        localStorage.setItem('token', msg.token);
        const defaultLoginSuccessMessage = '登录成功！';
        message.success(defaultLoginSuccessMessage);
        await fetchUserInfo();
        /** 此方法会跳转到 redirect 参数所在的位置 */

        if (!history) return;
        const { query } = history.location;
        const { redirect } = query;
        history.push(redirect || '/')
        return;
      }

      console.log(msg); // 如果失败去设置用户错误信息

      // setUserLoginState(msg);
    } catch (error) {
      const defaultLoginFailureMessage = '登录失败，请重试！';
      message.error(defaultLoginFailureMessage);
    }
  };

  const { status, type: loginType } = userLoginState;
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.loginForm}>
          <LoginForm
            submitter={{
              searchConfig: {
                resetText: '重置',
                submitText: signMethod === 'signIn' ? '登录' : '注册',
              },
              resetButtonProps: {
                style: {
                  // 隐藏重置按钮
                  display: 'none',
                },
              },
              submitButtonProps: {
                style: {
                  width: '328px',
                  height: '40px',
                  padding: '6.4px 15px',
                  fontSize: '16px',
                  borderRadius: '2px',
                },
              },
            }}
            logo={<img alt="logo" src="/logo.svg" />}
            title="树木检测平台"
            subTitle={'浙江农林大学学11-402作业'}
            initialValues={{
              username: 'zafu_xue_11_402',
              password: '123456',
            }}
            onFinish={async (values) => {
              await handleSubmit(values);
            }}
          >
            {status === 'error' && loginType === 'account' && (
              <LoginMessage content={'错误的用户名和密码'} />
            )}
            <ProFormText
              name="username"
              fieldProps={{
                size: 'large',
                prefix: <UserOutlined className={styles.prefixIcon} />,
              }}
              placeholder={'请输入用户名'}
              rules={[
                {
                  required: true,
                  message: '用户名是必填项！',
                },
              ]}
            />
            <ProFormText.Password
              name="password"
              fieldProps={{
                size: 'large',
                prefix: <LockOutlined className={styles.prefixIcon} />,
              }}
              placeholder={'请输入密码'}
              rules={[
                {
                  required: true,
                  message: '密码是必填项！',
                },
              ]}
            />
            <div style={{ marginBottom: 20, paddingTop: 0 }}>
              <a
                style={{ float: 'right' }}
                onClick={() => {
                  signMethod === 'signIn' ? setSignMethod('signUp') : setSignMethod('signIn');
                }}
              >
                {signMethod === 'signIn' ? '注册' : '账号登录'}
              </a>
            </div>
          </LoginForm>
        </div>
      </div>
      {/* <Footer /> */}
    </div>
  );
};

export default Login;
