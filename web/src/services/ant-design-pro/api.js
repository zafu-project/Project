// @ts-ignore

/* eslint-disable */
import { request } from 'umi';

function getCookie(name) {
  let cookies = document.cookie;
  // 解析出名/值对列表
  let list = cookies.split('; '); 

  for (let i = 0; i < list.length; i++) {
    // 解析出名和值
    let arr = list[i].split('=');
    if (arr[0] == name) {
      return arr[1];
    }
  }
  return '';
}
const csrftoken = getCookie('csrftoken')
/** 获取当前的用户 GET */
// 这个web-odm接口是获取用户列表
export async function currentUser(options) {
  return request('/api/admin/users/', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 退出登录接口 POST /api/login/outLogin */

export async function outLogin(options) {
  return request('/api/login/outLogin', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 登录接口 POST /api/login/account */

export async function login(body, options) {
  return request('/api/token-auth/', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

/** 创建用户 */

export async function createUser(body, options) {
  return request('/api/admin/users/', {
    method: 'POST',
    headers: {
      'X-CSRFToken': csrftoken,
    },
    data: body,
    ...(options || {}),
  });
}

/** 更新用户信息 */

export async function updateUser(id, body, options) {
  return request(`/api/admin/users/${id}/`, {
    method: 'PUT',
    headers: {
      'X-CSRFToken': csrftoken,
    },
    data: body,
    ...(options || {}),
  });
}

/** 注销用户 */

export async function deleteUser(id, body, options) {
  return request(`/api/admin/users/${id}/`, {
    method: 'DELETE',
    headers: {
      'X-CSRFToken': csrftoken,
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取项目列表 */

export async function getProjects(options) {
  return request('/api/projects/', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 新建项目 */

export async function addProject(body, options) {
  const csrftoken = getCookie('csrftoken')
  return request('/api/projects/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrftoken,
    },
    data: body,
    ...(options || {}),
  });
}

/** 更新项目 /api/projects/7/edit/ */

export async function updateProject(id, body, options) {
  return request(`/api/projects/${id}/edit/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrftoken,
    },
    data: body,
    ...(options || {}),
  });
}

/** 删除项目 */

export async function removeProject(id, options) {
  return request(`/api/projects/${id}/`, {
    method: 'DELETE',
    headers: {
      'X-CSRFToken': csrftoken,
    },
    ...(options || {}),
  });
}

/** 获取任务列表 */
export async function getTasks(id, options) {
  return request(`/api/projects/${id}/tasks/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrftoken,
    },
    ...(options || {}),
  });
}

/** 新建任务 */

export async function addTask(projectId, body, options) {
  return request(`/api/projects/${projectId}/tasks/`, {
    method: 'POST',
    headers: {
      'X-CSRFToken': csrftoken,
    },
    data: body,
    ...(options || {}),
  });
}

/** 更新任务 */

export async function updateTask(projectId, taskId, body, options) {
  return request(`/api/projects/${projectId}/tasks/${taskId}/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrftoken,
    },
    data: body,
    ...(options || {}),
  });
}

/** 取消任务 */

export async function cancelTask(projectId, taskId, data, options) {
  return request(`/api/projects/${projectId}/tasks/${taskId}/cancel/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'X-CSRFToken': csrftoken,
    },
    data: data,
    ...(options || {}),
  });
}

/** 删除任务 */

export async function removeTask(projectId, taskId, data, options) {
  return request(`/api/projects/${projectId}/tasks/${taskId}/remove/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'X-CSRFToken': csrftoken,
    },
    data: data,
    ...(options || {}),
  });
}

/** 重启任务 */

export async function resatrtTask(projectId, taskId, data, options) {
  return request(`/api/projects/${projectId}/tasks/${taskId}/restart/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'X-CSRFToken': csrftoken,
    },
    data: data,
    ...(options || {}),
  });
}

/** Orthphoto TMS layer */

export async function downloadOrthophoto(projectId, taskId, options) {
  return request(`/api/projects/${projectId}/tasks/${taskId}/orthophoto/export`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'X-CSRFToken': csrftoken,
    },
    // 这里可以有多种图片格式，这里只设置为gtiff
    data: 'format=gtiff',
    ...(options || {}),
  });
}

/** Surface Model TMS layer */

export async function downloadDSM(projectId, taskId, options) {
  return request(`/api/projects/${projectId}/tasks/${taskId}/dsm/export`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'X-CSRFToken': csrftoken,
    },
    data: 'format=gtiff',
    ...(options || {}),
  });
}

/** Terrain Model TMS layer */

export async function downloadDTM(projectId, taskId, options) {
  return request(`/api/projects/${projectId}/tasks/${taskId}/dtm/export`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'X-CSRFToken': csrftoken,
    },
    data: 'format=gtiff',
    ...(options || {}),
  });
}
