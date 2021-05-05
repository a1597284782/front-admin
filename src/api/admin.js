import axios from '@/libs/request'
import qs from 'qs'

// 获取用户列表
const getUserList = parmas => {
  return axios.get('/admin/users?' + qs.stringify(parmas))
}

// 修改用户信息
const updateUserById = data => {
  return axios.post('/admin/update-user', data)
}

// 删除用户
const deleteUserById = ids => {
  return axios.post('/admin/delete-user', { ids })
}

// 批量修改
const updateUserBatchById = data => {
  return axios.post('/admin/update-user-settings', data)
}

// 校验用户名
const checkUsername = username => {
  return axios.get('/admin/checkname?username=' + username)
}

// 添加用户
const addUser = data => {
  return axios.post('/admin/add-user', data)
}

// 添加菜单
const addMenu = data => axios.post('/admin/add-menu', data)

// 获取菜单
const getMenu = () => axios.get('/admin/get-menu')

// 更新菜单
const updateMenu = data => axios.post('/admin/update-menu', data)

// 删除菜单
const deleteMenu = data => axios.post('/admin/delete-menu', data)

// 添加角色
const addRole = data => axios.post('/admin/add-role', data)

// 获取角色
const getRoles = () => axios.get('/admin/get-roles')

// 获取角色名字
const getRoleNames = () => axios.get('/admin/get-roles-names')

// 更新角色
const updateRole = data => axios.post('/admin/update-role', data)

// 删除角色
const deleteRole = data => axios.post('/admin/delete-role', data)

// 获得统计数据
const getStatData = () => axios.get('/admin/getstat')

// 获取错误信息
const getErrorList = params =>
  axios.get('/admin/get-error?' + qs.stringify(params))

// 删除错误信息
const deleteErrors = data => axios.post('/admin/delete-error', data)

// 获取评论
const getCommentsList = params =>
  axios.get('/admin/get-comments?' + qs.stringify(params))

// 批量更新评论
const updateComments = data => axios.post('/admin/update-comments-batch', data)

// 删除评论
const deleteComments = data => axios.post('/admin/delete-comments', data)

export {
  getUserList,
  updateUserById,
  updateUserBatchById,
  deleteUserById,
  checkUsername,
  addUser,
  addMenu,
  getMenu,
  updateMenu,
  deleteMenu,
  addRole,
  getRoles,
  updateRole,
  deleteRole,
  getRoleNames,
  getStatData,
  getErrorList,
  deleteErrors,
  getCommentsList,
  updateComments,
  deleteComments
}
