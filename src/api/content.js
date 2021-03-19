import axios from '@/libs/request'
import qs from 'qs'

// 获取文章列表
const getList = (options) => {
  return axios.get('/public/list?' + qs.stringify(options))
}

// 删除文章
const deletePostById = (ids) => {
  return axios.post('/content/delete', { ids })
}

// 更新文章
const updatePostById = (data) => {
  return axios.post('/content/update-id', data)
}

// 批量修改
const updatePostBatchById = (data) => {
  return axios.post('/content/update-post-settings', data)
}

// 内容管理 -> 标签管理
// 获取标签列表
const getTags = (options) => {
  return axios.get('/admin/get-tags?' + qs.stringify(options))
}

// 添加标签
const addTag = (data) => {
  return axios.post('/admin/add-tag', data)
}

// 删除标签
const removeTag = (id) => {
  return axios.get('/admin/remove-tag?ptid=' + id)
}

// 编辑标签
const updateTag = (data) => {
  return axios.post('/admin/edit-tag?', data)
}

export {
  getList,
  deletePostById,
  updatePostById,
  updatePostBatchById,
  getTags,
  addTag,
  removeTag,
  updateTag
}
