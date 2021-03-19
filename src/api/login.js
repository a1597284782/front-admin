import axios from '@/libs/request'
import qs from 'qs'

/**
 * 获取验证码接口
 * @param {*} sid 是唯一标识
 */
const getCode = sid => {
  return axios.get('/public/getCaptcha', {
    params: {
      sid: sid
    }
  })
}

/**
 * 忘记密码接口
 * @param {*} option 用户信息 （邮箱，验证码）
 */
const forget = option => {
  return axios.post('/login/forget', {
    ...option
  })
}

/**
 * 立即登录接口
 * @param {*} loginInfo 用户信息
 */
const login = loginInfo => {
  return axios.post('/login/login', {
    ...loginInfo
  })
}

/**
 * 注册接口
 * @param {*} regInfo 用户信息
 */
const reg = regInfo => {
  return axios.post('/login/reg', {
    ...regInfo
  })
}

// 重置密码接口
const updatePassword = data => {
  return axios.get('/login/reset-passwd?' + qs.stringify(data))
}

export { getCode, forget, login, reg, updatePassword }
