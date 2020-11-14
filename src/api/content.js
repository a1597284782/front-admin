import axios from '@/libs/request'
import qs from 'qs'

// 获取文章列表
const getList = (options) => {
  return axios.get('/public/list?' + qs.stringify(options))
}

// 删除文章
const deletePostById = (id) => {
  return axios.get('/content/delete?tid=' + id)
}

export {
  getList,
  deletePostById
}
