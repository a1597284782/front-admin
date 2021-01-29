import ViewUI from 'view-design'

const addErrorLog = errorInfo => {
  const { statusText, status, request: { responseURL } } = errorInfo
  const info = {
    type: 'ajax',
    code: status,
    mes: statusText,
    url: responseURL
  }
  if (!responseURL.includes('save_error_logger')) store.dispatch('addErrorLog', info)
}

/* eslint-disable handle-callback-err */
const errorHandle = err => {
  // console.log('err', err)
  ViewUI.Message.error('未知错误！')
  addErrorLog(err)
}

export default errorHandle
