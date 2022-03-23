import { SettingDrawer } from '@ant-design/pro-layout';
import { PageLoading } from '@ant-design/pro-layout';
import { history, Link } from 'umi';
import RightContent from '@/components/RightContent';
import Footer from '@/components/Footer';
import { currentUser as queryCurrentUser } from './services/ant-design-pro/api';
import { BookOutlined, LinkOutlined } from '@ant-design/icons';
import defaultSettings from '../config/defaultSettings';
// Neccesary imports
import { request as requestUmi } from 'umi';
import Reqs from 'umi-request';
import merge from 'lodash/merge';
import cloneDeep from 'lodash/cloneDeep';

const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';
/** 获取用户信息比较慢的时候会展示一个 loading */

export const initialStateConfig = {
  loading: <PageLoading />,
};
/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */

export async function getInitialState() {
  const fetchUserInfo = async () => {
    try {
      const msg = await queryCurrentUser();
      return msg.results[msg.results.length - 1];
    } catch (error) {
      history.push(loginPath);
    }

    return undefined;
  }; // 如果是登录页面，不执行

  if (history.location.pathname !== loginPath) {
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
      settings: defaultSettings,
    };
  }

  return {
    fetchUserInfo,
    settings: defaultSettings,
  };
} // ProLayout 支持的api https://procomponents.ant.design/components/layout

export const layout = ({ initialState, setInitialState }) => {
  return {
    rightContentRender: () => <RightContent />,
    //“项目-无人机影像可视化平台”开关
    pageTitleRender:false,
    disableContentMargin: false,
    // waterMarkProps: {
    //   content: initialState?.currentUser?.name,
    // },
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history; // 如果没有登录，重定向到 login

      if (!initialState?.currentUser && location.pathname !== loginPath) {
        history.push(loginPath);
      }
    },
    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    childrenRender: (children, props) => {
      // if (initialState?.loading) return <PageLoading />;
      return (
        <>
          {children}
          {!props.location?.pathname?.includes('/login') && (
            <SettingDrawer
              enableDarkTheme
              settings={initialState?.settings}
              onSettingChange={(settings) => {
                setInitialState((preInitialState) => ({ ...preInitialState, settings }));
              }}
            />
          )}
        </>
      );
    },
    ...initialState?.settings,
  };
};

// Part 1: "Simple" Error Handler =))
const errorHandler = (error) => {
  console.log('HTTP ERROR', error);
  throw error;
};
// Part 2: Request Interceptors, (use this instead of "headers" directly in request config)
const requestInterceptor = (url, options) => {
  return {
    url,
    options: merge(cloneDeep(options), {
      headers: { Authorization: `JWT ${localStorage.getItem('token')}` },
    }),
  };
};
// Part 3: Response Interceptos
const { cancel } = Reqs.CancelToken.source();
let refreshTokenRequest = null;
const responseInterceptor = async (response, options) => {
  const accessTokenExpired = response.status === 401;
  // if (accessTokenExpired) {
  //     try {
  //         if (!refreshTokenRequest) {
  //             refreshTokenRequest = refreshAccessToken(localStorage.getItem('token'));
  //         }
  //         // multiple requests but "await"ing for only 1 refreshTokenRequest, because of closure
  //         const res = await refreshTokenRequest;
  //         if (!res)
  //             throw new Error();
  //         if (res.access)
  //             jwt.saveAccess(res.access);
  //         if (res.refresh)
  //             jwt.saveRefresh(res.refresh); // for ROTATE REFRESH TOKENS
  //         return requestUmi(response.url, merge(cloneDeep(options), {
  //             headers: { Authorization: `JWT ${res.access}` },
  //         }));
  //     }
  //     catch (err) {
  //         localStorage.removeItem('token');
  //         // jwt.removeAccess();
  //         // jwt.removeRefresh();
  //         cancel('Session time out.');
  //         throw err;
  //     }
  //     finally {
  //         refreshTokenRequest = null;
  //     }
  // }
  return response;
};
export const request = {
  errorHandler,
  // This would fuck the refresh token logic, use requestInterceptors instead,
  // because jwt.getAccess() will not being called everytime, but only the first time => lead to stale access token
  // headers: { Authorization: `Bearer ${jwt.getAccess()}` },
  // Handle refresh token (old): https://github.com/ant-design/ant-design-pro/issues/7159#issuecomment-680789397
  // Handle refresh token (new): https://gist.github.com/paulnguyen-mn/8a5996df9b082c69f41bc9c5a8653533
  requestInterceptors: [requestInterceptor],
  responseInterceptors: [responseInterceptor],
};
