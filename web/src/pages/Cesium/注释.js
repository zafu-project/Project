//基于建筑高度的建筑物颜色
// tileset.style = new Cesium.Cesium3DTileStyle({
//   color : {
//     conditions : [
//       // ["${height} >= 20", "rgba(45, 0, 75, 0.5)"],
//       // ["${height} >= 15", "rgb(102, 71, 151)"],
//       // ["${height} >= 10", "rgb(170, 162, 204)"],
//       // ["${height} >= 8", "rgb(224, 226, 238)"],
//       // ["${height} >= 5", "rgb(252, 230, 200)"],
//       // ["${height} >= 2", "rgb(248, 176, 87)"],
//       ["${height} >= 1", "rgb(198, 106, 11)"],
//       ["true", "rgb(127, 59, 8)"]
//     ]
//   }
// });


/*//设置时间选项
viewer.clock.shouldAnimate = true; // 当观众开始观看时，让动画播放
viewer.clock.startTime = Cesium.JulianDate.fromIso8601("2022-02-03T16:00:00Z");
viewer.clock.stopTime = Cesium.JulianDate.fromIso8601("2022-02-03T16:20:00Z");
viewer.clock.currentTime = Cesium.JulianDate.fromIso8601("2022-02-03T16:00:00Z");
viewer.clock.multiplier = 2; // 加速
viewer.clock.clockStep = Cesium.ClockStep.SYSTEM_CLOCK_MULTIPLIER; // 滴答计算方式
viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP; // 最后一个回路
viewer.timeline.zoomTo(viewer.clock.startTime, viewer.clock.stopTime); // 设定可见距离
*/
//-----------------------------------------------------
/*//添加图层
// 移除基础图层
viewer.imageryLayers.remove(viewer.imageryLayers.get(0));
// 添加 Sentinel-2 图层(层状)
viewer.imageryLayers.addImageryProvider(new Cesium.IonImageryProvider({assetId: 3954}));
*/
//-----------------------------------------------------
/*加载和样式化实体*/
/*
//1:kml 标签
//参数
var kmlOptions = {
  camera: viewer.scene.camera,
  canvas: viewer.scene.canvas,
  clampToGround: true
};
//从.kml中加载加载POI点位,引用上述配置
var geocachePromise = Cesium.KmlDataSource.load('https://gist.githubusercontent.com/rahwang/bf8aa3a46da5197a4c3445c5f5309613/raw/04e17770dd552fd2694e2597986fd480b18b5014/sampleGeocacheLocations.kml', kmlOptions);
//网络kml链接：https://gist.githubusercontent.com/rahwang/bf8aa3a46da5197a4c3445c5f5309613/raw/04e17770dd552fd2694e2597986fd480b18b5014/sampleGeocacheLocations.kml

//******添加 geocache billboard 实体到场景并对它们进行样式化******
geocachePromise.then(function (dataSource) {
  //将新数据作为实体添加到查看器
  viewer.dataSources.add(dataSource);

  //获取实体数组
  var geocacheEntities = dataSource.entities.values;

  for (var i = 0; i < geocacheEntities.length; i++) {
    var entity = geocacheEntities[i];
    //添加 geocache billboard 实体到场景并对它们进行样式化
    if (Cesium.defined(entity.billboard)) {
      //调整垂直起点，以便针坐在地形上
      entity.billboard.verticalOrigin = Cesium.VerticalOrigin.BOTTOM;
      //禁用标签以减少杂乱
      entity.label = undefined;
      //添加距离显示条件
      entity.billboard.distanceDisplayCondition = new Cesium.DistanceDisplayCondition(10.0, 20000.0);
      //用度数来计算经纬度
      var cartographicPosition = Cesium.Cartographic.fromCartesian(entity.position.getValue(Cesium.JulianDate.now()));
      var longitude = Cesium.Math.toDegrees(cartographicPosition.longitude);//经度
      var latitude = Cesium.Math.toDegrees(cartographicPosition.latitude);//纬度
      //修改描述
      var description = '<table class="cesium-infoBox-defaultTable cesium-infoBox-defaultTable-lighter"><tbody>' +
        '<tr><th>' + "经度" + '</th><td>' + longitude.toFixed(5) + '</td></tr>' +
        '<tr><th>' + "纬度" + '</th><td>' + latitude.toFixed(5) + '</td></tr>' +
        '</tbody></table>';
      entity.description = description;

    }
  }
});
*/
//-----------------------------------------------------
/*
//2:GeoJson 标识临界
var geojsonOptions = {
  clampToGround: true
};
// 从 GeoJson 文件加载邻域边界
var neighborhoodsPromise = Cesium.GeoJsonDataSource.load('https://gist.githubusercontent.com/gka/a37f7b330f65b9c0531cc7f4c8d80c34/raw/5bb0e906b0d821ac0933f9466e0350a96fef47d0/neighborhoods.geojson', geojsonOptions);
// 保存邻居数据的新实体集合
var neighborhoods;
neighborhoodsPromise.then(function (dataSource) {
  // 将新数据作为实体添加到查看器
  viewer.dataSources.add(dataSource);
  neighborhoods = dataSource.entities;

  // 获取实体数组
  var neighborhoodEntities = dataSource.entities.values;
  for (var i = 0; i < neighborhoodEntities.length; i++) {
    var entity = neighborhoodEntities[i];

    if (Cesium.defined(entity.polygon)) {
      // entity styling code here
      // 使用 geojson 邻域值作为实体名称
      //entity.name = entity.properties.neighborhood;
      // 将多边形材质设置为随机的半透明颜色。
      entity.polygon.material = Cesium.Color.fromRandom({
        red: 0.1,
        maximumGreen: 0.5,
        minimumBlue: 0.5,
        alpha: 0.6
      });

      // 告诉多边形为地形着色。Cesium _ 3D _ tile 将为3d tileset 和 ClassificationType.CESIUM _ 3D _ tile 将同时为3d tiles 和地形着色(默认情况下都是这两种颜色)
      entity.polygon.classificationType = Cesium.ClassificationType.TERRAIN;

      // 生成多边形位置
      var polyPositions = entity.polygon.hierarchy.getValue(Cesium.JulianDate.now()).positions;
      var polyCenter = Cesium.BoundingSphere.fromPoints(polyPositions).center;
      polyCenter = Cesium.Ellipsoid.WGS84.scaleToGeodeticSurface(polyCenter);
      entity.position = polyCenter;
      // 生成标签
      entity.label = {
        text: entity.name,
        showBackground: true,
        scale: 0.6,
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(10.0, 8000.0),
        disableDepthTestDistance: 100.0
      };

    }
  }
});
*/
//-----------------------------------------------------
/*
// 从 CZML 文件加载无人机飞行路径
var dronePromise = Cesium.CzmlDataSource.load('./Source/SampleData/SampleFlight.czml');

var drone;
dronePromise.then(function (dataSource) {
  viewer.dataSources.add(dataSource);
  //使用在 CZML 数据中定义的 id 获取实体
  drone = dataSource.entities.getById('Aircraft/Aircraft1');
  // 附加一个3D模型
  drone.model = {
    url: 'https://raw.githubusercontent.com/CesiumGS/cesium-workshop/main/Source/SampleData/Models/CesiumDrone.gltf',
    minimumPixelSize: 128,
    maximumScale: 1000,
    silhouetteColor: Cesium.Color.WHITE,
    silhouetteSize: 2
  };
  // 根据采样位置添加计算出的方向
  drone.orientation = new Cesium.VelocityOrientationProperty(drone.position);
  // 平滑路径插值
  drone.position.setInterpolationOptions({
    interpolationDegree: 3,
    interpolationAlgorithm: Cesium.HermitePolynomialApproximation
  });
});
*/
//-----------------------------------------------------
/*//示例杭州建筑
  //教程参考
  var viewer = new Cesium.Viewer("cesiumContainer", {
    terrainProvider: Cesium.createWorldTerrain({
      // required for water effects
      requestWaterMask: true,
      // required for terrain lighting
      requestVertexNormals: true,
    }),
    animation: true, //是否显示动画控件
    scene3DOnly: true,
    baseLayerPicker: false, //是否显示图层选择控件
    geocoder: true, //是否显示地名查找控件
    timeline: true, //是否显示时间线控件
    navigationHelpButton: false, //是否显示帮助信息控件
    infoBox: true, //是否显示点击要素之后显示的信息
    // 加载高德影像地图
    imageryProvider: new Cesium.UrlTemplateImageryProvider({url: "https://webst02.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}",}),
  });

  var palaceTileset = new Cesium.Cesium3DTileset({url: "http://localhost:9000/model/47289680a5c711ec94138f1e84dd1bb9/tileset.json",});
  viewer.scene.primitives.add(palaceTileset);
  palaceTileset.readyPromise.then(function (tileset) {
    viewer.scene.primitives.add(tileset);
    viewer.zoomTo(tileset, new Cesium.HeadingPitchRange(0.5, -0.2, tileset.boundingSphere.radius * 1.0));
  }).otherwise(function (error) {
    console.log(error);
  });
  //加颜色
  palaceTileset.style = new Cesium.Cesium3DTileStyle({color: {conditions: [["${Floor} >= 300", "rgba(45, 0, 75, 0.5)"], ["${Floor} >= 200", "rgba(102, 71, 151,0.5)"], ["${Floor} >= 100", "rgba(45, 0, 75, 0.5)"], ["${Floor} >= 50", "rgba(102, 71, 151,0.5)"], ["${Floor} >= 25", "rgba(252, 230, 200,0.5)"], ["${Floor} >= 10", "rgba(248, 176, 87,0.5)"], ["${Floor} >= 5", "rgba(198, 106, 11,0.5)"], ["true", "rgb(127, 59, 8)"],],},});
  let entity = viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(118.78, 32.07, 20.61), point: {
      color: Cesium.Color.RED, //点位颜色
      pixelSize: 10, //像素点大小
    },
    label: {
      text: '测试名称',
      font: "14pt Source Han Sans CN", //字体样式
      fillColor: Cesium.Color.BLACK, //字体颜色
      backgroundColor: Cesium.Color.AQUA, //背景颜色
      showBackground: true, //是否显示背景颜色
      style: Cesium.LabelStyle.FILL, //label样式
      outlineWidth: 2,
      verticalOrigin: Cesium.VerticalOrigin.CENTER, //垂直位置
      horizontalOrigin: Cesium.HorizontalOrigin.LEFT, //水平位置
      pixelOffset: new Cesium.Cartesian2(10, 0), //偏移
    },
  });
    */
/*
// 设置样式
import Cesium from "cesium";

tileset.style = new Cesium.Cesium3DTileStyle({
  color: "color('white')",
  show: true
});*/
/*
// let longitude = 119.67954; //模型需要改变的经度(自定义，任意值)
        // let latitude = 30.23134; //模型需要改变的纬度(自定义，任意值)
        // let heightOffset = 111.0000000003; //模型需要改变的高度(根据3DTiles调整，此次调整为10)
        // //获取3Dtlies的bounds范围
        // let boundingSphere = tileset.boundingSphere;
        // //获取3Dtlies的范围中心点的弧度
        // let cartographic = Cesium.Cartographic.fromCartesian(boundingSphere.center);
        // //定义3Dtlies改变之后中心点的弧度
        // let offsetvalue = Cesium.Cartographic.fromDegrees(longitude, latitude, heightOffset);
        // //模型本身的位置
        // let surface = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, 0.0);
        // //模型改变的位置
        // let offset = Cesium.Cartesian3.fromRadians(offsetvalue.longitude, offsetvalue.latitude, heightOffset);
        // //定义模型的改变状态
        // let translation = Cesium.Cartesian3.subtract(offset, surface, new Cesium.Cartesian3());
        // //修改模型的位置
        // tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
        // //异步设置摄像机以查看提供的一个或多个实体或数据源。
        // //viewer.zoomTo(tileset, new Cesium.HeadingPitchRange(0.5, -0.2, tileset.boundingSphere.radius));
        //
        // // var m = tileset.modelMatrix;
        // // //RotateX为旋转角度，转为弧度再参与运算
        // // var m1 = Cesium.Matrix3.fromRotationX(Cesium.Math.toRadians(2));
        // // //矩阵计算
        // // Cesium.Matrix4.multiplyByMatrix3(m, m1, m);
        // // //赋值
        // // tileset.modelMatrix = m;
*/
/*
//新增
      //开启地下可视化调整高度
      // viewer.scene.screenSpaceCameraController.enableCollisionDetection = false;
      // viewer.scene.globe.translucency.enabled=true;
      // viewer.scene.globe.depthTestAgainstTerrain = true;
      // //相机最低高度
      // viewer.scene.screenSpaceCameraController.minimumZoomDistance = 200;
      // //相机最高高度
      // viewer.scene.screenSpaceCameraController.maximumZoomDistance = 800;
*/
