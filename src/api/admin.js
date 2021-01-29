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

// 获取删除用户
const deleteUserById = (id) => {
  return axios.get('/admin/delete-user?id=' + id)
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
  deleteUserById,
  checkUsername,
  addUser
}
