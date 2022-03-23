import { PageContainer } from '@ant-design/pro-layout';
import styles from './style.less'; // import Cesium from 'cesium/Cesium'

import React, { useEffect } from 'react';
import * as Cesium from 'cesium'; // import "cesium/Build/Cesium/Widgets/widgets.css";

import './Widgets/widgets.css'; //Cesium参数.js

import './cesium';
import CardBorderLess from './CardBorderLess';
window.CESIUM_BASE_URL = window.location.protocol + '//' + window.location.host;

const Cesiumz = () => {
  const content = (
    <div className={styles.pageHeaderContent}>
      <p
        className={styles.contentLink}
        style={{
          marginTop: 20,
        }}
      >
        Cesium
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
  ); // JS代码
//<PageContainer className={styles.page} content={content} extraContent={extraContent}>
//</PageContainer>
  useEffect(() => {
    const cesiumJsUrl = './utils/Cesium.js';
    document.getElementById('cesiumContainer').innerhtml =
      '<script  src=' +
      {
        cesiumJsUrl,
      } +
      '></script>'; //Cesium Token

    Cesium.Ion.defaultAccessToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkZTQ0NzU5MS0wMzUzLTQ2MmItYjBjNC0yYjYzMTk2YTlhYTkiLCJpZCI6Nzk3OTYsImlhdCI6MTY0MzI3MzQ3MH0.lrdjEm7yghHeZFsUd8kNl1dYnwSoKVGWEik9OBltwro'; // 创建Cesium Viewer

    let viewer = new Cesium.Viewer('cesiumContainer', {
      // 加载天地图
      terrainProvider: Cesium.createWorldTerrain({
        requestWaterMask: true,
        // 运动的水
        requestVertexNormals: false, // 加载光数据
      }),
      scene3DOnly: true,
      selectionIndicator: true,
      baseLayerPicker: true, // 加载高德影像地图
      //imageryProvider: new Cesium.UrlTemplateImageryProvider({url: "https://webst02.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}",}),
    }); //隐藏Cesium-logo

    viewer.cesiumWidget.creditContainer.style.display = 'none'; // 显示地形

    viewer.scene.globe.depthTestAgainstTerrain = true; //-----------------------------------------------------

    /*配置视窗*/
    //基于太阳位置的光照
    //viewer.scene.globe.enableLighting = true;

    /*初始化相机*/
    //位置

    let initialPosition = new Cesium.Cartesian3.fromDegrees(
      119.679462,
      30.230264,
      314.562799425431
    ); //（经度，纬度，高度）
    //方向

    let initialOrientation = new Cesium.HeadingPitchRoll.fromDegrees(
      10,
      -60,
      0.025883251314954971306
    ); //（左右，上下，左右倾斜）【正：右，负：左】
    // 设置初始视角

    let homeCameraView = {
      destination: initialPosition,
      orientation: {
        heading: initialOrientation.heading,
        pitch: initialOrientation.pitch,
        roll: initialOrientation.roll,
      },
    }; //更新home按钮

    viewer.scene.camera.setView(homeCameraView); //添加飞行动画选项

    homeCameraView.duration = 2; //持续时间

    homeCameraView.maximumHeight = 2000;
    homeCameraView.pitchAdjustHeight = 2000;
    homeCameraView.endTransform = Cesium.Matrix4.IDENTITY; // 覆盖默认的 home 按钮

    viewer.homeButton.viewModel.command.beforeExecute.addEventListener(function (e) {
      e.cancel = true;
      viewer.scene.camera.flyTo(homeCameraView);
    }); //加载3D模型

    let tileset = new Cesium.Cesium3DTileset({
      url: 'http://localhost:8001/data/tileset.json', //maximumScreenSpaceError: 2, //最大的屏幕空间误差
      //maximumNumberOfLoadedTiles: 1000, //最大加载瓦片个数
    }); //添加到场景

    tileset.readyPromise.then(viewer.scene.primitives.add(tileset)); //调整模型位置、大小、角度

    let params = {
      tx: 119.67954,
      //模型中心X轴坐标（经度，单位：十进制度）
      ty: 30.23134,
      //模型中心Y轴坐标（纬度，单位：十进制度）
      tz: 70,
      //模型中心Z轴坐标（高程，单位：米）
      rx: -86.3,
      //X轴（经度）方向旋转角度（单位：度）
      ry: -0.2,
      //Y轴（纬度）方向旋转角度（单位：度）
      rz: 1.4, //Z轴（高程）方向旋转角度（单位：度）
    };

    function update3dtilesMaxtrix(tileset) {
      //旋转
      let mx = Cesium.Matrix3.fromRotationX(Cesium.Math.toRadians(params.rx));
      let my = Cesium.Matrix3.fromRotationY(Cesium.Math.toRadians(params.ry));
      let mz = Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(params.rz));
      let rotationX = Cesium.Matrix4.fromRotationTranslation(mx);
      let rotationY = Cesium.Matrix4.fromRotationTranslation(my);
      let rotationZ = Cesium.Matrix4.fromRotationTranslation(mz); //平移

      let position = Cesium.Cartesian3.fromDegrees(params.tx, params.ty, params.tz);
      let m = Cesium.Transforms.eastNorthUpToFixedFrame(position); //旋转、平移矩阵相乘

      Cesium.Matrix4.multiply(m, rotationX, m);
      Cesium.Matrix4.multiply(m, rotationY, m);
      Cesium.Matrix4.multiply(m, rotationZ, m); //赋值给tileset

      tileset._root.transform = m;
    } //更新模型数据

    tileset.readyPromise.then((tileset) => {
      update3dtilesMaxtrix(tileset); //viewer.zoomTo(tileset, new Cesium.HeadingPitchRange(0.5, -0.2, tileset.boundingSphere.radius * 1.0));
    }); //更改模型大小
    // let scale = Cesium.Matrix4.fromUniformScale(0.6)
    // Cesium.Matrix4.multiply(m, scale, m)
    //末尾
    //末尾
  }, []);
  return (
    <div className="App">
        <div id={'cesiumContainer'} />
      </div>

  );
};

export default Cesiumz;
