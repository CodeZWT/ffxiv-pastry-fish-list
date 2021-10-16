const sendElectronEvent = (channel, data) => {
  window.electron?.ipcRenderer?.send(channel, data)
}

export { sendElectronEvent }
