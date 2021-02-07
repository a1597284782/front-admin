import axios from '@/libs/request'
import { getToken } from '@/libs/util'

const getUserInfo = (token) => {
  return axios.get('/public/info', {
    headers: {
      Authorization: 'Beaerer ' + getToken()
    }
  })
}

export {
  getUserInfo
}
