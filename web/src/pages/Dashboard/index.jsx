import React, { useState } from 'react';
import { StatisticCard } from '@ant-design/pro-card';
import RcResizeObserver from 'rc-resize-observer';
const { Statistic, Divider } = StatisticCard;
const Dashboard = () => {
  const [responsive, setResponsive] = useState(false);
  return (
    <RcResizeObserver
      key="resize-observer"
      onResize={(offset) => {
        setResponsive(offset.width < 596);
      }}
    >
      <StatisticCard.Group>
      <StatisticCard
        statistic={{
          title: '任务数量',
          tip: '帮助文字',
          value: 10,
        }}
      />
      <Divider />
      <StatisticCard
        statistic={{
          title: '未运行',
          value: 5,
          status: 'default',
        }}
      />
      <StatisticCard
        statistic={{
          title: '作业中',
          value: 3,
          status: 'processing',
        }}
      />
      <StatisticCard
        statistic={{
          title: '作业异常',
          value: 2,
          status: 'error',
        }}
      />
      <StatisticCard
        statistic={{
          title: '已完成',
          value: '-',
          status: 'success',
        }}
      />
    </StatisticCard.Group>
      <StatisticCard.Group direction={responsive ? 'column' : 'row'} style={{marginTop: 8}}>
        <StatisticCard
          statistic={{
            title: '存储空间',
            tip: '这些值可能与运行应用程序的虚拟化环境相关，而不一定与机器的值相关。请参阅在Docker设置中更改这些值的Windows和MacOS说明。',
            value: 601986875,
          }}
        />
        <Divider type={responsive ? 'horizontal' : 'vertical'} />
        <StatisticCard
          statistic={{
            title: '未使用',
            value: 3701928,
            description: <Statistic title="占比" value="61.5%" />,
          }}
          chart={
            <img
              src="https://gw.alipayobjects.com/zos/alicdn/ShNDpDTik/huan.svg"
              alt="百分比"
              width="100%"
            />
          }
          chartPlacement="left"
        />
        <StatisticCard
          statistic={{
            title: '已用',
            value: 1806062,
            description: <Statistic title="占比" value="38.5%" />,
          }}
          chart={
            <img
              src="https://gw.alipayobjects.com/zos/alicdn/6YR18tCxJ/huanlv.svg"
              alt="百分比"
              width="100%"
            />
          }
          chartPlacement="left"
        />
      </StatisticCard.Group>
      <StatisticCard.Group direction={responsive ? 'column' : 'row'} style={{marginTop: 8}}>
        <StatisticCard
          statistic={{
            title: '内存',
            tip: '这些值可能与运行应用程序的虚拟化环境相关，而不一定与机器的值相关。请参阅在Docker设置中更改这些值的Windows和MacOS说明。',
            value: 601986875,
          }}
        />
        <Divider type={responsive ? 'horizontal' : 'vertical'} />
        <StatisticCard
          statistic={{
            title: '未使用',
            value: 3701928,
            description: <Statistic title="占比" value="61.5%" />,
          }}
          chart={
            <img
              src="https://gw.alipayobjects.com/zos/alicdn/ShNDpDTik/huan.svg"
              alt="百分比"
              width="100%"
            />
          }
          chartPlacement="left"
        />
        <StatisticCard
          statistic={{
            title: '已用',
            value: 1806062,
            description: <Statistic title="占比" value="38.5%" />,
          }}
          chart={
            <img
              src="https://gw.alipayobjects.com/zos/alicdn/6YR18tCxJ/huanlv.svg"
              alt="百分比"
              width="100%"
            />
          }
          chartPlacement="left"
        />
      </StatisticCard.Group>
    </RcResizeObserver>
  );
};

export default Dashboard;