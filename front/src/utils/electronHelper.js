const sendElectronEvent = (channel, data) => {
  window.electron?.ipcRenderer?.send(channel, data)
}

const invokeElectronEvent = (channel, params, callback) => {
  window.electron?.ipcRenderer?.invoke(channel, params).then(callback)
}

export { sendElectronEvent, invokeElectronEvent }
