/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState) {
  const { currentUser } = initialState || {};
  return {
    canAdmin: currentUser && currentUser.access === 'admin',
  };
}

// / Neccesary imports
// import { request as requestUmi } from 'umi';
// import Reqs from 'umi-request';
// import merge from 'lodash/merge';
// import cloneDeep from 'lodash/cloneDeep';
// // Part 1: "Simple" Error Handler =))
// const errorHandler = (error) => {
//     console.log('HTTP ERROR', error);
//     throw error;
// };
// // Part 2: Request Interceptors, (use this instead of "headers" directly in request config)
// const requestInterceptor = (url, options) => {
//     return {
//         url,
//         options: merge(cloneDeep(options), {
//             headers: { Authorization: `Bearer ${jwt.getAccess()}` },
//         }),
//     };
// };
// // Part 3: Response Interceptos
// const { cancel } = Reqs.CancelToken.source();
// let refreshTokenRequest = null;
// const responseInterceptor = async (response, options) => {
//     const accessTokenExpired = response.status === 401;
//     if (accessTokenExpired) {
//         try {
//             if (!refreshTokenRequest) {
//                 refreshTokenRequest = refreshAccessToken(jwt.getRefresh());
//             }
//             // multiple requests but "await"ing for only 1 refreshTokenRequest, because of closure
//             const res = await refreshTokenRequest;
//             if (!res)
//                 throw new Error();
//             if (res.access)
//                 jwt.saveAccess(res.access);
//             if (res.refresh)
//                 jwt.saveRefresh(res.refresh); // for ROTATE REFRESH TOKENS
//             return requestUmi(response.url, merge(cloneDeep(options), {
//                 headers: { Authorization: `Bearer ${res.access}` },
//             }));
//         }
//         catch (err) {
//             jwt.removeAccess();
//             jwt.removeRefresh();
//             cancel('Session time out.');
//             throw err;
//         }
//         finally {
//             refreshTokenRequest = null;
//         }
//     }
//     return response;
// };
// export const request = {
//     errorHandler,
//     // This would fuck the refresh token logic, use requestInterceptors instead,
//     // because jwt.getAccess() will not being called everytime, but only the first time => lead to stale access token
//     // headers: { Authorization: `Bearer ${jwt.getAccess()}` },
//     // Handle refresh token (old): https://github.com/ant-design/ant-design-pro/issues/7159#issuecomment-680789397
//     // Handle refresh token (new): https://gist.github.com/paulnguyen-mn/8a5996df9b082c69f41bc9c5a8653533
//     requestInterceptors: [requestInterceptor],
//     responseInterceptors: [responseInterceptor],
// };
