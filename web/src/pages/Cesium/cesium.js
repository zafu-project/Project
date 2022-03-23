export default function Cesium_function() {
  const url = "./utils/Cesium.js"
  document.getElementById('cesium-Container').innerhtml = "<script  src=" + {url} + "></script>";
  //cesium密钥
  Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJhNDFlOTQyYy1lYjlhLTQ5OTctYTA2YS0xMDU2YmIyZjQ0ZTEiLCJpZCI6Nzk3OTYsImlhdCI6MTY0MjQwNTg5MX0.KmNIeFFL2CBTaUAXpaYLffbGMaBVSENN8ABykqxu670';

// 创建Cesium Viewer
  const viewer = new Cesium.Viewer("cesium-Container", {
    scene3DOnly: true,
    selectionIndicator: false,
    baseLayerPicker: false
  });

}
