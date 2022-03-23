import React, {useState, useRef} from 'react';
import {Button, Menu, Dropdown, message, Upload, Popconfirm, Tooltip, Image} from 'antd';
import ProTable from '@ant-design/pro-table';
import {ModalForm, ProFormText} from '@ant-design/pro-form';
import {history} from 'umi';
import styles from './style.less';
import {
  getTasks,
  addTask,
  cancelTask,
  removeTask,
  resatrtTask,
  downloadOrthophoto,
  downloadDTM,
  downloadDSM,
} from '@/services/ant-design-pro/api';
import {
  LoadingOutlined,
  ReloadOutlined,
  DownloadOutlined,
  PlusOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
  DeleteOutlined,
  DownOutlined,
  FileImageOutlined,
  DotChartOutlined,
  CodeOutlined,
  PictureOutlined,
  AppstoreOutlined,
  TableOutlined,
  MenuOutlined,
} from '@ant-design/icons';
import moment from 'moment';

//FixedMe
// const currentProjectId = history.location.query.id;
const options = {
  restart: '重启',
  cancel: '取消',
  remove: '删除',
  detect: '检测',
};

const handleOptions = async (projectId, e, key) => {
  const taskId = e.id;
  const hide = message.loading(`正在${options[key]}任务`);
  try {
    if (key === 'restart') {
      await resatrtTask(projectId, taskId, `uuid=${e.uuid}`);
    }
    if (key === 'cancel') {
      await cancelTask(projectId, taskId, `uuid=${e.uuid}`);
    }
    if (key === 'remove') {
      await removeTask(projectId, taskId, `uuid=${e.uuid}`);
    }
    if (key === 'detect') {
      console.log('检测中');
    }
    hide();
    message.success(`${options[key]}任务成功`);
    return true;
  } catch (error) {
    hide();
    message.error(`${options[key]}任务失败`);
    return false;
  }
};

const handleAdd = async (fields) => {
  let formdata = new FormData();
  for (let i = 0; i < imageList.length; i++) {
    formdata.append('images', imageList[i])
  }
  formdata.append('name', fields.name);
  const hide = message.loading('正在创建任务');
  try {
    await addTask(history.location.query.id, formdata);
    hide();
    message.success('创建任务成功');
    return true;
  } catch (error) {
    hide();
    message.error('创建任务失败');
    return false;
  }
};

const handleDownload = async (projectId, taskId, key) => {
  const hide = message.loading(`正在下载${key}`);
  try {
    if (key === 'orthophoto') {
      const msg = await downloadOrthophoto(projectId, taskId);
      window.open(msg.url);
    } else if (key === 'dsm') {
      const msg = await downloadDSM(projectId, taskId);
      window.open(msg.url);
    } else if (key === 'dtm') {
      const msg = await downloadDTM(projectId, taskId);
      window.open(msg.url);
    }
    hide();
    message.success(`正在下载${key}`);
    return true;
  } catch (error) {
    hide();
    message.error(`下载${key}失败`);
    return false;
  }
};

const menu = (
  <Menu key="tmsLayer" onClick={handleMenuClick}>
    <Menu.Item key="orthophoto" icon={<FileImageOutlined/>}>
      下载orthophoto
    </Menu.Item>
    <Menu.Item key="dsm" icon={<FileImageOutlined/>}>
      下载DSM
    </Menu.Item>
    <Menu.Item key="dtm" icon={<FileImageOutlined/>}>
      下载DTM
    </Menu.Item>
  </Menu>
);

function handleMenuClick(e) {
  message.info('Click on menu item.');
  console.log('click', e);
  handleDownload(history.location.query.id, selectedRow.id, e.key);
}

// 新建任务的图片数据
let imageList = [];
// 应用于文件下载的被选中任务变量
let selectedRow = {};

export default () => {
  const formRef = useRef();
  const [time, setTime] = useState(() => Date.now());
  // 新建任务弹窗变量
  const [createModalVisible, handleModalVisible] = useState(false);
  // 查看任务对应图片弹窗变量
  const [getImagesModalVisible, handleGetImagesModalVisible] = useState(false);
  // 轮询变量
  const [polling, setPolling] = useState(5000);
  // 设置图片大小变量
  const [imageSize, setImageSize] = useState('small');
  // 表格数据处理
  const actionRef = useRef();
  const confirm = async (e, key) => {
    const success = await handleOptions(history.location.query.id, e, key);
    if (success) {
      if (actionRef.current) {
        actionRef.current.reload();
      }
    }
  };
  const columns = [
    {
      title: '创建时间',
      key: 'created_at',
      dataIndex: 'created_at',
      valueType: 'dateTime',
    },
    {
      title: '任务名',
      key: 'id',
      render: (record) => <span>{record.name === null ? 'Task #' + record.id : record.name}</span>,
    },
    {
      title: '图片数量',
      key: 'images_count',
      dataIndex: 'images_count',
      render: (text) => (
        <a
          onClick={() => {
            handleGetImagesModalVisible(true);
          }}
        >
          {text}
        </a>
      ),
    },
    {
      title: '状态',
      key: 'status',
      dataIndex: 'status',
      filters: true,
      onFilter: true,
      valueEnum: {
        10: {text: '排队中', status: 'Default'},
        20: {text: '运行中', status: 'Processing'},
        30: {text: '失败', status: 'Error'},
        40: {text: '已完成', status: 'Success'},
        50: {text: '取消', status: 'Default'},
      },
    },
    {
      title: '进度',
      key: 'progress',
      dataIndex: 'running_progress',
      valueType: (item) => ({
        type: 'progress',
        status: item.status !== 'error' ? 'active' : 'exception',
      }),
    },
    {
      title: '文件下载',
      key: 'file',
      render: (record) => [
        <Dropdown
          key="downloadFile"
          overlay={menu}
          trigger={['click']}
          disabled={record.running_progress !== '100.0'}
        >
          <Button
            icon={<DownloadOutlined/>}
            onClick={() => {
              selectedRow = record;
              console.log(selectedRow);
            }}
          >
            <DownOutlined/>
          </Button>
        </Dropdown>,
      ],
    },
    {
      title: '操作',
      key: 'option',
      //fixed: 'right',
      render: (record) => [
        <Popconfirm
          key="restart"
          title="确定重启此任务吗"
          placement="bottom"
          onConfirm={() => {
            confirm(record, 'restart');
          }}
          okText="确定"
          cancelText="取消"
        >
          <Tooltip title="重启任务">
            <Button type="primary" ghost shape="circle" icon={<PlayCircleOutlined/>}/>
          </Tooltip>
        </Popconfirm>,
        <Popconfirm
          key="cancel"
          title="确定取消此任务吗"
          placement="bottom"
          onConfirm={() => {
            confirm(record, 'cancel');
          }}
          okText="确定"
          cancelText="取消"
        >
          <Tooltip title="取消任务">
            <Button shape="circle" icon={<PauseCircleOutlined/>}/>
          </Tooltip>
        </Popconfirm>,
        <Popconfirm
          key="remove"
          title="确定删除此任务吗"
          placement="bottom"
          onConfirm={() => {
            confirm(record, 'remove');
          }}
          okText="确定"
          cancelText="取消"
        >
          <Tooltip title="删除任务">
            <Button shape="circle" icon={<DeleteOutlined/>}/>
          </Tooltip>
        </Popconfirm>,
        <Popconfirm
          key="detect"
          title="确定检测此任务吗"
          placement="bottom"
          onConfirm={() => {
            confirm(record, 'detect');
          }}
          okText="确定"
          cancelText="取消"
        >
          <Tooltip title="检测树木">
            <Button shape="circle" icon={<CodeOutlined/>}/>
          </Tooltip>
        </Popconfirm>,
        // <Tooltip key="getCoordinates" title="获取树木坐标">
        //   <Button shape="circle" icon={<DotChartOutlined />} />
        // </Tooltip>,
      ],
    },
    {
      title: '三维模型',
      key: '3d',
      //fixed: 'right',
      render: (_) => [
        <Button
          key="viewModel"
          type="primary"
          ghost
          shape="circle"
          icon={<PictureOutlined/>}
          onClick={() => {
            history.push('/cesium');
          }}
        />,
      ],
    },
  ];
  return (
    <>
      <ProTable
        actionRef={actionRef}
        columns={columns}
        rowKey="key"
        search={false}
        pagination={{
          showSizeChanger: true,
        }}
        polling={polling || undefined}
        request={async () => {
          const msg = await getTasks(history.location.query.id);
          setTime(Date.now());
          msg.forEach((element) => {
            element.running_progress = (element.running_progress * 100).toFixed(1);
          });
          return {
            data: msg,
            success: true,
            total: msg.length,
          };
        }}
        dateFormatter="string"
        headerTitle={`上次更新时间：${moment(time).format('HH:mm:ss')}`}
        toolBarRender={() => [
          <Button
            key="polling"
            type="primary"
            onClick={() => {
              if (polling) {
                setPolling(undefined);
                return;
              }
              setPolling(5000);
            }}
          >
            {polling ? <LoadingOutlined/> : <ReloadOutlined/>}
            {polling ? '停止轮询' : '开始轮询'}
          </Button>,
          <Button
            key="create"
            icon={<PlusOutlined/>}
            onClick={() => {
              handleModalVisible(true);
            }}
          >
            新建
          </Button>,
        ]}
      />
      <ModalForm
        formRef={formRef}
        className={styles.modelForm}
        title={'新建任务'}
        width="720px"
        visible={createModalVisible}
        onVisibleChange={handleModalVisible}
        onFinish={async (value) => {
          const success = await handleAdd({...value});
          // 重置表单
          formRef.current?.resetFields();
          imageList = [];
          if (success) {
            handleModalVisible(false);

            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        modalProps={{
          onCancel: (e) => {
            // 重置表单
            formRef.current?.resetFields();
            imageList = [];
          },
        }}
      >
        <ProFormText
          label="任务名"
          tooltip=""
          placeholder="请输入任务名"
          rules={[
            {
              required: true,
              message: '规则名称为必填项',
            },
          ]}
          name="name"
        />
        <div style={{marginBottom: '20px'}}>
          图片
          <span style={{float: 'right'}}>
            <a
              onClick={() => {
                setImageSize('small');
              }}
            >
              <MenuOutlined style={{fontSize: '18px', color: '#08c'}}/>
            </a>
            <a
              onClick={() => {
                setImageSize('default');
              }}
            >
              <AppstoreOutlined style={{fontSize: '20px', color: '#08c'}}/>
            </a>
            <a
              onClick={() => {
                setImageSize('large');
              }}
            >
              <TableOutlined style={{fontSize: '20px', color: '#08c'}}/>
            </a>
          </span>
        </div>
        <Upload
          action={(i) => {
            imageList.push(i)
          }}
          listType="picture-card"
          multiple
          defaultFileList={[]}
          onRemove={(e) => {
            for (let i = 0; i < imageList.length; i++) {
              if (e.uid === imageList[i].uid) {
                imageList.splice(i, 1);
              }
            }
          }}
          showUploadList={{showPreviewIcon: false}}
          className={
            imageSize === 'small'
              ? styles.upload_list_small
              : imageSize === 'default'
                ? styles.upload_list_default
                : styles.upload_list_large
          }
        >
          <div>
            <PlusOutlined/>
            <div style={{marginTop: 8}}>上传图片</div>
          </div>
        </Upload>
      </ModalForm>
      <ModalForm
        className={styles.modelForm}
        title={'查看任务图片'}
        width="720px"
        submitter={false}
        visible={getImagesModalVisible}
        onVisibleChange={handleGetImagesModalVisible}
      >
        <div style={{marginBottom: '20px'}}>
          <PictureOutlined style={{fontSize: '18px', color: '#08c', verticalAlign: 'sub'}}/>
          <span>&nbsp;任务图片如下:</span>
          <span style={{float: 'right'}}>
            <a
              onClick={() => {
                setImageSize('small');
              }}
            >
              <MenuOutlined style={{fontSize: '18px', color: '#08c'}}/>
            </a>
            <a
              onClick={() => {
                setImageSize('default');
              }}
            >
              <AppstoreOutlined style={{fontSize: '20px', color: '#08c'}}/>
            </a>
            <a
              onClick={() => {
                setImageSize('large');
              }}
            >
              <TableOutlined style={{fontSize: '20px', color: '#08c'}}/>
            </a>
          </span>
        </div>
        <Image.PreviewGroup>
          <div style={{border: '1px dashed', padding: '10px'}}>
            <Image
              width={imageSize === 'small' ? 60 : imageSize === 'default' ? 100 : 150}
              src="https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg"
            />
            <Image
              width={imageSize === 'small' ? 60 : imageSize === 'default' ? 100 : 150}
              src="https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg"
            />
            <Image
              width={imageSize === 'small' ? 60 : imageSize === 'default' ? 100 : 150}
              src="https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg"
            />
            <Image
              width={imageSize === 'small' ? 60 : imageSize === 'default' ? 100 : 150}
              src="https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg"
            />
          </div>
        </Image.PreviewGroup>
      </ModalForm>
    </>
  );
};
