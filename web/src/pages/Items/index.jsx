import { PageContainer } from '@ant-design/pro-layout';
import styles from './style.less';
const content = (
  <div className={styles.pageHeaderContent}>
    <p className={styles.contentLink} style={{ marginTop: 20 }}>
      项目是任务项的集合。创建一个任务，从一组图像计算正射影像、点云和纹理模型。
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
const Items = ({children}) => {
  return <PageContainer content={content} extraContent={extraContent}>
    { children }
  </PageContainer>;
};
export default Items;