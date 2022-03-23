import React, { useState, useEffect, useRef } from 'react';
import { Button, Card, List, Typography, message, Tooltip, Avatar } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { history } from 'umi';
import { ModalForm, ProFormText } from '@ant-design/pro-form';
import styles from './style.less';
import {
  currentUser as getUsers,
  createUser,
  updateUser,
  deleteUser,
} from '@/services/ant-design-pro/api';
import {
  TeamOutlined,
  UserAddOutlined,
  UserDeleteOutlined,
  SolutionOutlined,
  UserOutlined,
  CheckCircleTwoTone,
  CloseCircleTwoTone,
  LockOutlined,
} from '@ant-design/icons';
const { Paragraph, Text } = Typography;

const handleAdd = async (fields) => {
  const hide = message.loading('正在创建账户');

  try {
    await createUser(fields);
    hide();
    message.success('创建账户成功');
    return true;
  } catch (error) {
    hide();
    message.error('创建账户失败');
    return false;
  }
};

const handleDelete = async (fields) => {
  const hide = message.loading('正在注销用户');

  try {
    await deleteUser(fields);
    hide();
    message.success('注销账户成功');
    return true;
  } catch (error) {
    hide();
    message.error('注销账户失败');
    return false;
  }
};

const handleUpdate = async (fields) => {
  const hide = message.loading('正在修改账户');

  try {
    await updateUser(fields.userId, {
      username: fields.username,
      password: fields.password,
    });
    hide();
    message.success('修改账户成功');
    return true;
  } catch (error) {
    hide();
    message.error('修改账户失败');
    return false;
  }
};

const Admin = () => {
  // 创建账户弹窗是否可见变量
  const [createModalVisible, handleCreateModalVisible] = useState(false);
  // 修改账户弹窗是否可见变量
  const [updateModalVisible, handleUpdateModalVisible] = useState(false);
  // 账户列表
  const [userList, setUserList] = useState([]);
  // 加载动画变量
  const [loading, setLoading] = useState(false);
  // useEffect监听值
  const [count, setCount] = useState(1);
  // 获取当前点击用户的ID
  const [userId, setUserId] = useState(-1);
  // 初始账户空值
  const nullData = {};
  // 表单字段处理
  const createFormRef = useRef();
  const updateFormRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const msg = await getUsers();
        setUserList(msg.results);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        history.push(loginPath);
      }
    };
    fetchData();
  }, [count]);

  const content = (
    <div className={styles.pageHeaderContent}>
      <p className={styles.contentLink} style={{ marginTop: 20 }}>
        用户管理及配置模块。
      </p>
    </div>
  );

  const extraContent = (
    <div className={styles.extraImg}>
      <img
        alt="这是一个标题"
        src="https://gw.alipayobjects.com/zos/rmsportal/RzwpdLnhmvDJToTdfDPe.png"
      />
    </div>
  );
  return (
    <PageContainer content={content} extraContent={extraContent}>
      <div className={styles.cardList}>
        <List
          rowKey="id"
          loading={loading}
          grid={{
            gutter: 16,
            xs: 1,
            sm: 2,
            md: 3,
            lg: 3,
            xl: 4,
            xxl: 4,
          }}
          dataSource={[nullData, ...userList]}
          renderItem={(item) => {
            if (item && item.id) {
              return (
                <List.Item key={item.id}>
                  <Card
                    title={<a>用户:{item.username}</a>}
                    extra={
                      <Text type="secondary">
                        活跃状态:
                        {item.is_active ? (
                          <CheckCircleTwoTone twoToneColor="#52c41a" />
                        ) : (
                          <CloseCircleTwoTone twoToneColor="#dd4646" />
                        )}
                      </Text>
                    }
                    hoverable
                    className={styles.card}
                    actions={[
                      <Tooltip key="setting" title="修改账户">
                        <SolutionOutlined
                          onClick={() => {
                            // 获取对应修改账户的ID
                            setUserId(item.id);
                            handleUpdateModalVisible(true);
                            updateFormRef.current?.setFields([{
                              name: 'username',
                              value: item.username,
                            }])
                          }}
                        />
                      </Tooltip>,
                      <Tooltip key="delete" title="注销账户">
                        <UserDeleteOutlined
                          onClick={async () => {
                            const success = await handleDelete(item.id);

                            // 注销成功直接跳转到登录页
                            if (success) {
                              history.push('/user/login');
                            }
                          }}
                        />
                      </Tooltip>,
                    ]}
                  >
                    <Card.Meta
                      avatar={
                        item.is_superuser ? (
                          <Avatar
                            size={45}
                            icon={<TeamOutlined />}
                            style={{ backgroundColor: '#1890ff' }}
                            className={styles.cardAvatar}
                          />
                        ) : (
                          <Avatar size={45} icon={<UserOutlined />} className={styles.cardAvatar} />
                        )
                      }
                      description={
                        <Paragraph
                          className={styles.item}
                          ellipsis={{
                            rows: 3,
                          }}
                        >
                          {item.is_superuser ? (
                            <Text strong>超级用户</Text>
                          ) : (
                            <Text type="secondary">普通用户</Text>
                          )}
                        </Paragraph>
                      }
                    />
                  </Card>
                </List.Item>
              );
            }

            return (
              <>
                <List.Item>
                  <Button
                    type="dashed"
                    className={styles.newButton}
                    onClick={() => {
                      handleCreateModalVisible(true);
                    }}
                  >
                    <UserAddOutlined /> 新建账户
                  </Button>
                </List.Item>
                <ModalForm
                  formRef={createFormRef}
                  className={styles.modelForm}
                  title={'创建账户'}
                  width="400px"
                  visible={createModalVisible}
                  onVisibleChange={handleCreateModalVisible}
                  onFinish={async (value) => {
                    const success = await handleAdd(value);
                    createFormRef.current?.resetFields();
                    if (success) {
                      handleCreateModalVisible(false);
                      setCount(count + 1);
                    }
                  }}
                  modalProps={{
                    onCancel: (e) => {
                      createFormRef.current?.resetFields();
                    },
                  }}
                >
                  <ProFormText
                    label="账号"
                    tooltip=""
                    rules={[
                      {
                        required: true,
                        message: '规则名称为必填项',
                      },
                    ]}
                    fieldProps={{
                      size: 'large',
                      prefix: <UserOutlined className={styles.prefixIcon} />,
                    }}
                    name="username"
                    placeholder={'请输入账号'}
                  />
                  <ProFormText.Password
                    label="密码"
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
                </ModalForm>
                <ModalForm
                  formRef={updateFormRef}
                  className={styles.modelForm}
                  title={'修改账户'}
                  width="400px"
                  visible={updateModalVisible}
                  onVisibleChange={handleUpdateModalVisible}
                  onFinish={async (value) => {
                    const success = await handleUpdate({ userId, ...value });
                    updateFormRef.current?.resetFields();
                    if (success) {
                      handleUpdateModalVisible(false);
                      setCount(count + 1);
                    }
                  }}
                  modalProps={{
                    onCancel: (e) => {
                      updateFormRef.current?.resetFields();
                    },
                  }}
                >
                  <ProFormText
                    label="账号"
                    tooltip=""
                    rules={[
                      {
                        required: true,
                        message: '规则名称为必填项',
                      },
                    ]}
                    fieldProps={{
                      size: 'large',
                      prefix: <UserOutlined className={styles.prefixIcon} />,
                    }}
                    name="username"
                    placeholder={'请输入账号'}
                  />
                  <ProFormText.Password
                    label="密码"
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
                </ModalForm>
              </>
            );
          }}
        />
      </div>
    </PageContainer>
  );
};

export default Admin;
