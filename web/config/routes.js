export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user',
        routes: [{name: '登录', path: '/user/login', component: './user/Login'}]
      },
      {component: './404'},
    ],
  },
  {name: '仪表盘', icon: 'dashboard', path: '/dashboard', component: './Dashboard'},
  {
    path: '/items',
    name: '工作台',
    icon: 'project',
    component: './Items',

    routes: [
      {path: '/items', redirect: '/items/projects'},
      {path: '/items/projects', hideInMenu: true, name: '项目', component: './Items/Projects'},
      {
        path: '/items/projects/tasks',
        hideInMenu: true,

        name: '任务',
        component: './Items/Projects/Tasks',
      },
      {component: './404'},
    ],
  },
  {name: '管理', icon: 'setting', path: '/admin', component: './Admin'},
  {
    name: '三维模型',
    icon: 'table',
    hideInMenu: true,
    layout: {
      hideMenu: false,
      hideNav: false,
      hideFooter: true,
    },
    path: '/cesium',
    component: './Cesium'
  },
  {path: '/', redirect: '/dashboard'},
  {component: './404'},
];
