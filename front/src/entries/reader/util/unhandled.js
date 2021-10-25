import _ from 'lodash'

const handleError = (msg, error) => {
  console.error(msg, error)
  const dialog = window.remote.dialog
  const app = window.remote.app
  dialog.showMessageBoxSync({
    type: 'error',
    message: '发生错误，即将关闭...\n' + error,
    title: 'Front Error',
  })
  app.quit()
}

const errorHandler = _.debounce(error => {
  handleError('Unhandled Error', error)
}, 200)

window.addEventListener('error', event => {
  event.preventDefault()
  errorHandler(event.error || event)
})
const rejectionHandler = _.debounce(reason => {
  handleError('Unhandled Promise Rejection', reason)
}, 200)

window.addEventListener('unhandledrejection', event => {
  event.preventDefault()
  rejectionHandler(event.reason)
})
