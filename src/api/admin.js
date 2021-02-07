import axios from '@/libs/request'
import qs from 'qs'

// 获取用户列表
const getUserList = (parmas) => {
  return axios.get('/admin/users?' + qs.stringify(parmas))
}

// 修改用户信息
const updateUserById = (data) => {
  return axios.post('/admin/update-user', data)
}

// 删除用户
const deleteUserById = (ids) => {
  return axios.post('/admin/delete-user', { ids })
}

// 批量修改
const updateUserBatchById = (data) => {
  return axios.post('/admin/update-user-settings', data)
}

// 校验用户名
const checkUsername = (username) => {
  return axios.get('/admin/checkname?username=' + username)
}

// 添加用户
const addUser = (data) => {
  return axios.post('/admin/add-user', data)
}

export {
  getUserList,
  updateUserById,
  updateUserBatchById,
  deleteUserById,
  checkUsername,
  addUser
}
