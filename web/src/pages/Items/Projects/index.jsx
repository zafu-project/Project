import React, { useState, useEffect, useRef } from 'react';
import { Button, Card, List, Typography, message, Tooltip, Avatar } from 'antd';
import { history } from 'umi';
import { ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import styles from './style.less';
import {
  getProjects,
  addProject,
  removeProject,
  updateProject,
} from '@/services/ant-design-pro/api';
import {
  PlusOutlined,
  SettingOutlined,
  DeleteOutlined,
  DoubleRightOutlined,
  ProjectOutlined,
} from '@ant-design/icons';
const { Paragraph, Text } = Typography;

const handleAdd = async (fields) => {
  const hide = message.loading('正在创建项目');

  try {
    await addProject(fields);
    hide();
    message.success('创建项目成功');
    return true;
  } catch (error) {
    hide();
    message.error('创建项目失败');
    return false;
  }
};

const handleRemove = async (projectId) => {
  const hide = message.loading('正在删除项目');

  try {
    await removeProject(projectId);
    hide();
    message.success('删除项目成功');
    return true;
  } catch (error) {
    hide();
    message.error('删除项目失败');
    return false;
  }
};

const handleUpdate = async (fields) => {
  const hide = message.loading('正在修改项目');

  try {
    await updateProject(fields.projectId, {
      name: fields.name,
      description: fields.description,
    });
    hide();
    message.success('修改项目成功');
    return true;
  } catch (error) {
    hide();
    message.error('修改项目失败');
    return false;
  }
};

const Projects = () => {
  // 创建项目弹窗是否可见变量
  const [createModalVisible, handleCreateModalVisible] = useState(false);
  // 修改项目弹窗是否可见变量
  const [updateModalVisible, handleUpdateModalVisible] = useState(false);
  // 项目列表
  const [projectList, setProjectList] = useState([]);
  // 加载动画变量
  const [loading, setLoading] = useState(false);
  // useEffect监听值
  const [count, setCount] = useState(1);
  // 获取当前点击项目的ID
  const [projectId, setProjectId] = useState(-1);
  // 初始项目空值
  const nullData = {};
  // 表单字段处理
  const createFormRef = useRef();
  const updateFormRef = useRef();
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const msg = await getProjects();
        setProjectList(msg);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        history.push(loginPath);
      }
    };
    fetchData();
  }, [count]);

  return (
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
        dataSource={[nullData, ...projectList]}
        renderItem={(item) => {
          if (item && item.id) {
            return (
              <List.Item key={item.id}>
                <Card
                  title={<a>项目名:{item.name}</a>}
                  extra={
                    <span>
                      <Text type="secondary">任务:</Text>
                      <Text strong>{item.tasks.length === 0 ? '0' : item.tasks.length}</Text>
                    </span>
                  }
                  hoverable
                  className={styles.card}
                  actions={[
                    <Tooltip key="setting" title="配置项目">
                      <SettingOutlined
                        onClick={() => {
                          setProjectId(item.id);
                          handleUpdateModalVisible(true);
                          // 设置项目的初始值
                          updateFormRef.current?.setFields([{
                            name: 'name',
                            value: item.name,
                          }, {
                            name: 'description',
                            value: item.description,
                          }])
                        }}
                      />
                    </Tooltip>,
                    <Tooltip key="delete" title="删除项目">
                      <DeleteOutlined
                        onClick={async () => {
                          await handleRemove(item.id);
                          setCount(count + 1);
                        }}
                      />
                    </Tooltip>,
                    <Tooltip key="view" title="查看任务">
                      <DoubleRightOutlined
                        onClick={() => {
                          history.push({
                            pathname: '/items/projects/tasks',
                            query: {
                              id: item.id,
                            },
                          });
                        }}
                      />
                    </Tooltip>,
                  ]}
                >
                  <Card.Meta
                    avatar={
                      // <img
                      //   alt=""
                      //   className={styles.cardAvatar}
                      //   src="https://joeschmoe.io/api/v1/random"
                      // />
                      <Avatar
                        size={60}
                        icon={<ProjectOutlined />}
                        className={styles.cardAvatar}
                        style={{ backgroundColor: '#1890ff' }}
                      />
                    }
                    description={
                      <Paragraph
                        className={styles.item}
                        ellipsis={{
                          rows: 3,
                        }}
                      >
                        <Text type="secondary">项目描述:{item.description}</Text>
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
                  <PlusOutlined /> 新增项目
                </Button>
              </List.Item>
              <ModalForm
                formRef={createFormRef}
                className={styles.modelForm}
                title={'创建项目'}
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
                  label="项目名"
                  tooltip=""
                  rules={[
                    {
                      required: true,
                      message: '规则名称为必填项',
                    },
                  ]}
                  name="name"
                  placeholder={'请输入项目名'}
                />
                <ProFormTextArea label="描述" name="description" placeholder={'请输入项目信息'} />
              </ModalForm>
              <ModalForm
                formRef={updateFormRef}
                className={styles.modelForm}
                title={'编辑项目'}
                width="400px"
                visible={updateModalVisible}
                onVisibleChange={handleUpdateModalVisible}
                onFinish={async (value) => {
                  const success = await handleUpdate({ projectId, ...value });
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
                  label="项目名"
                  tooltip=""
                  rules={[
                    {
                      required: true,
                      message: '规则名称为必填项',
                    },
                  ]}
                  name="name"
                  placeholder={'请输入项目名'}
                />
                <ProFormTextArea label="描述" name="description" placeholder={'请输入项目信息'} />
              </ModalForm>
            </>
          );
        }}
      />
    </div>
  );
};

export default Projects;
