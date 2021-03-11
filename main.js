const {
  app,
  BrowserWindow,
  ipcMain,
  shell,
  globalShortcut,
  dialog,
  Menu,
  Tray,
} = require('electron')
const isDev = require('electron-is-dev')
const FishingDataReader = require('./server/reader')
const log = require('electron-log')
const download = require('download')
const fs = require('fs')
const path = require('path')
const throttle = require('lodash/throttle')
const CONSTANTS = require('./data/constants')
const ObjectsToCsv = require('objects-to-csv')
const iconv = require('iconv-lite')
const datauri = require('datauri')
const Store = require('electron-store')
const set = require('lodash/set')
const capitalize = require('lodash/capitalize')
const unhandled = require('electron-unhandled')

const COMMIT_HASH_DOWNLOAD_LINK =
  'https://ricecake302-generic.pkg.coding.net/pastry-fish/desktop-version/COMMITHASH?version=latest'
const SETUP_EXE_DOWNLOAD_LINK =
  'https://ricecake302-generic.pkg.coding.net/pastry-fish/desktop-app/PastryFishSetup.exe?version=latest'
log.transports.console.level = 'silly'

const WINDOWS = {}
let tray, loading, loadingForReloadingPage, configStore, windowSetting, region
const winURL = isDev
  ? `http://localhost:8080`
  : `file://${__dirname}/front-electron-dist/index.html`

const readerURL = isDev
  ? `http://localhost:8080/reader`
  : `file://${__dirname}/front-electron-dist/reader.html`

const FILE_ENCODING = 'utf8'
const SETUP_PATH = 'setup'
let skipUpdate = false
// const DOWNLOADED_COMMITHASH_PATH = SETUP_PATH + '/DOWNLOADED_COMMITHASH'
const closedWindows = {}

unhandled({
  logger: log.error,
  reportButton: (error) => {
    shell.showItemInFolder(path.join(app.getPath('userData'), 'logs/main.log'))
  },
})

function initWindowSetting(configStore) {
  if (!configStore.get('windowSetting')) {
    configStore.set('windowSetting', {
      main: {
        pos: { x: null, y: null },
        size: { w: 1080, h: 768 },
        opacity: 0.9,
        zoomFactor: 1,
      },
      setting: {
        pos: { x: null, y: null },
        size: { w: 500, h: 500 },
        opacity: 0.9,
        zoomFactor: 1,
      },
      timer: {
        pos: { x: null, y: null },
        size: { w: 500, h: 160 },
        opacity: 0.9,
        zoomFactor: 1,
      },
      history: {
        pos: { x: null, y: null },
        size: { w: 500, h: 800 },
        opacity: 0.9,
        zoomFactor: 1,
      },
      spotStatistics: {
        pos: { x: null, y: null },
        size: { w: 500, h: 500 },
        opacity: 0.9,
        zoomFactor: 1,
      },
    })
    log.info('Initialize user config in', app.getPath('userData'))
  }
}

function saveWindowSetting(path, value) {
  set(windowSetting, path, value)
  configStore.set('windowSetting', windowSetting)
}

async function init() {
  await createAndShowLoadingWindow().then((win) => (loading = win))
  configStore = new Store()
  initWindowSetting(configStore)
  windowSetting = configStore.get('windowSetting')
  createMainWindow()

  FishingDataReader.onUpdate((data) => {
    WINDOWS.main.webContents.send('fishingData', data)
    WINDOWS.readerTimer && WINDOWS.readerTimer.webContents.send('fishingData', data)
    WINDOWS.readerSpotStatistics &&
      WINDOWS.readerSpotStatistics.webContents.send('fishingData', data)
  })
  FishingDataReader.onFishCaught((data) => {
    WINDOWS.main.webContents.send('fishCaught', data)
  })
  FishingDataReader.onNewRecord((data) => {
    WINDOWS.readerTimer && WINDOWS.readerTimer.webContents.send('newRecord', data)
    WINDOWS.readerHistory && WINDOWS.readerHistory.webContents.send('newRecord', data)
    WINDOWS.readerSpotStatistics &&
      WINDOWS.readerSpotStatistics.webContents.send('newRecord', data)
  })

  updateIfNeeded()
  setInterval(updateIfNeeded, CONSTANTS.INTERVAL_MINUTE * 10)

  ipcMain
    .on('startReader', (event, options) => {
      region = options.region
      FishingDataReader.restart(options, () => {
        log.info('Machina started!', options)
      })
    })
    // .on('restartReader', (event, options) => {
    //   FishingDataReader.restart(options, () => {
    //     log.info('Machina restarted!', options)
    //   })
    // })
    .on('startUpdate', () => {
      quitAndSetup()
    })
    .on('openReader', () => {
      log.info('show reader')
      showReader()
    })
    .on('showSetting', () => {
      showReaderSetting(WINDOWS.readerTimer)
    })
    .on('updateUserData', (event, updateData) => {
      // log.info('updateUserData', updateData.data)
      updateUserData(updateData)

      const newRegion = updateData.data.region
      if (region !== newRegion) {
        region = newRegion
        const options = { region: newRegion }
        FishingDataReader.restart(options, () => {
          log.info('Machina restarted!', options)
        })
      }
    })
    .on('reloadUserData', () => {
      WINDOWS.readerTimer.webContents.send('reloadUserData')
      WINDOWS.readerSetting.webContents.send('reloadUserData')
    })
    .on('skipUpdate', () => {
      skipUpdate = true
      WINDOWS.main.setProgressBar(0)
      log.info('Update skipped')
    })
    .on('toggleHistory', () => {
      toggleReaderHistory()
    })
    .on('toggleSpotStatistics', () => {
      toggleSpotStatistics()
    })
    .on('updateMainWindowSetting', (event, setting) => {
      log.info('update main window setting', setting)
      saveWindowSetting('main.opacity', setting.opacity)
      saveWindowSetting('main.zoomFactor', setting.zoomFactor)
      WINDOWS.main.setOpacity(setting.opacity)
      WINDOWS.main.webContents.setZoomFactor(setting.zoomFactor)
    })
    .on('setCollapse', (event, collapse) => {
      const mainSize = windowSetting.main.size
      if (collapse) {
        WINDOWS.main.setSize(112, 88)
      } else {
        WINDOWS.main.setSize(mainSize.w, mainSize.h)
      }
    })
    .on('setReaderMiniMode', (event, mini) => {
      const readerSize = windowSetting.timer.size
      if (mini) {
        WINDOWS.readerTimer.setSize(readerSize.w, 52)
      } else {
        WINDOWS.readerTimer.setSize(readerSize.w, readerSize.h)
      }
    })
    .on('startLoading', () => {
      // return createAndShowLoadingWindow().then(win => loadingForReloadingPage = win)
    })
    .on('finishLoading', () => {
      // if (loadingForReloadingPage != null && !loadingForReloadingPage.isDestroyed()) {
      //   return loadingForReloadingPage.close()
      // }
      if (!loading.isDestroyed()) {
        WINDOWS.main.show()
        loading.close()
      }
    })
    .on('exportHistory', (event, data) => {
      dialog
        .showSaveDialog({
          title: '导出',
          defaultPath: '鱼糕钓鱼记录.csv',
          buttonLabel: '保存',
          filters: [{ name: 'CSV', extensions: ['csv'] }],
        })
        .then((result) => {
          if (!result.canceled) {
            const csv = new ObjectsToCsv(data)
            // return csv.toDisk(result.filePath, { bom: true })
            return csv.toString().then((str) => {
              fs.writeFileSync(result.filePath, iconv.encode(str, 'gb2312'))
            })
          }
          log.info(result)
        })
        .catch((err) => {
          if (err.code === 'EBUSY') {
            WINDOWS.readerHistory.webContents.send('exportHistoryFailedWithBusyFile')
          }
          log.info(err)
        })
        .finally(() => {
          WINDOWS.readerHistory.webContents.send('exportHistoryFinished')
        })
    })
    .on('showSpotPage', (event, spotId) => {
      WINDOWS.main.webContents.send('showSpotPage', spotId)
      if (WINDOWS.main.isMinimized()) {
        WINDOWS.main.restore()
      }
      WINDOWS.main.focus()
    })
    .on('updateWindowSetting', (event, newWindowSetting) => {
      ;['timer', 'history', 'spotStatistics'].forEach((settingName) => {
        const windowName =
          'reader' + capitalize(settingName[0]) + settingName.substring(1)
        if (
          newWindowSetting[settingName] &&
          WINDOWS[windowName] &&
          newWindowSetting[settingName].zoomFactor > 0.3
        ) {
          saveWindowSetting(
            settingName + '.opacity',
            newWindowSetting[settingName].opacity
          )
          WINDOWS[windowName].setOpacity(newWindowSetting[settingName].opacity)
          saveWindowSetting(
            settingName + '.zoomFactor',
            newWindowSetting[settingName].zoomFactor
          )
          WINDOWS[windowName].webContents.setZoomFactor(
            newWindowSetting[settingName].zoomFactor
          )
        }
      })
    })
  // .on('playSound', (event, playInfo) => {
  //   new Howl({ src: playInfo.path, preload: true })
  //     .volume(playInfo.volume)
  //     .play()
  // })

  ipcMain.handle('showOpenSoundFileDialog', () => {
    return dialog
      .showOpenDialog({
        title: '选择音频文件',
        buttonLabel: '选择',
        filters: [
          {
            name: '音频文件',
            extensions: [
              'mp3',
              'mpeg',
              'opus',
              'ogg',
              'oga',
              'wav',
              'aac',
              'caf',
              'm4a',
              'm4b',
              'mp4',
              'weba',
              'webm',
              'dolby',
              'flac',
            ],
          },
        ],
      })
      .then((result) => {
        if (result.canceled) {
          return { canceled: true }
        } else {
          return datauri(result.filePaths[0]).then((content) => {
            return {
              canceled: result.canceled,
              filePath: result.filePaths[0],
              base64: content,
            }
          })
        }
      })
  })
  ipcMain.handle('getWindowSetting', () => {
    return windowSetting
  })

  globalShortcut.register('Alt+CommandOrControl+L', () => {
    showReader()
  })
  globalShortcut.register('Alt+CommandOrControl+T', () => {
    WINDOWS.main &&
      WINDOWS.main.webContents.openDevTools({
        mode: 'right',
      })
    WINDOWS.readerTimer &&
      WINDOWS.readerTimer.webContents.openDevTools({
        mode: 'undocked',
      })
  })

  tray = new Tray(path.join(__dirname, 'assets/icon256.png'))
  const contextMenu = Menu.buildFromTemplate([
    { label: '打开渔捞鼠标穿透', click: () => setMouseThrough(true) },
    { label: '关闭渔捞鼠标穿透', click: () => setMouseThrough(false) },
    { label: '退出鱼糕程序', click: quit },
  ])
  tray.setToolTip('点击显示鱼糕')
  tray.setContextMenu(contextMenu)
  tray.on('click', showAndFocusMain)
}

function setMouseThrough(enable) {
  WINDOWS.readerTimer &&
    WINDOWS.readerTimer.setIgnoreMouseEvents(enable, { forward: true })
  WINDOWS.readerHistory &&
    WINDOWS.readerHistory.setIgnoreMouseEvents(enable, { forward: true })
  WINDOWS.readerSpotStatistics &&
    WINDOWS.readerSpotStatistics.setIgnoreMouseEvents(enable, { forward: true })
}

// let mainSize = { w: -1, h: -1 }
// let readerSize = { w: -1, h: -1 }
//
// function setWindow(window, option) {
//   if (option.opacity) {
//     window.setOpacity(option.opacity)
//   }
//   if (option.zoomFactor && window.webContents.zoomFactor !== option.zoomFactor) {
//     window.webContents.setZoomFactor(option.zoomFactor)
//   }
//   if (option.pos != null && option.pos.x != null && option.pos.y != null) {
//     window.setPosition(option.pos.x, option.pos.y)
//   }
//   if (option.size.w > 0 && option.size.h > 0) {
//     window.setSize(option.size.w, option.size.h)
//   }
//   if (window === WINDOWS.main) {
//     mainSize = { w: option.size.w, h: option.size.h }
//   } else if (window === WINDOWS.readerTimer) {
//     readerSize = { w: option.size.w, h: option.size.h }
//   }
// }

function createReaderSetting(readTimerWin) {
  WINDOWS.readerSetting = new BrowserWindow({
    width: windowSetting.setting.size.w,
    height: windowSetting.setting.size.h,
    x: windowSetting.setting.pos.x,
    y: windowSetting.setting.pos.y,
    opacity: windowSetting.setting.opacity,
    frame: false,
    transparent: false,
    maximizable: false,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
      enableRemoteModule: true,
      preload: __dirname + '/preload.js',
      additionalArguments: ['--route-name=ReaderSetting'],
      zoomFactor: windowSetting.setting.zoomFactor,
    },
    icon: path.join(__dirname, 'assets/setting.png'),
    show: false,
    parent: readTimerWin,
  })
  const win = WINDOWS.readerSetting
  closedWindows['readerSetting'] = null
  setOnTop(win)
  win.removeMenu()
  win.loadURL(readerURL).then(() => {
    win.webContents.on('new-window', function (e, url) {
      e.preventDefault()
      shell.openExternal(url)
    })
  })
  win
    .on('closed', (e) => {
      closedWindows['readerSetting'] = win
    })
    .on('moved', () => {
      const [x, y] = win.getPosition()
      saveWindowSetting('setting.pos', { x, y })
    })
    .on('resized', () => {
      const [w, h] = win.getSize()
      saveWindowSetting('setting.size', { w, h })
    })

  if (isDev) {
    win.webContents.openDevTools({
      mode: 'undocked',
    })
  }
}

function createReaderHistory(readTimerWin) {
  WINDOWS.readerHistory = new BrowserWindow({
    width: windowSetting.history.size.w,
    height: windowSetting.history.size.h,
    x: windowSetting.history.pos.x,
    y: windowSetting.history.pos.y,
    opacity: windowSetting.history.opacity,
    frame: false,
    transparent: false,
    maximizable: false,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
      enableRemoteModule: true,
      preload: __dirname + '/preload.js',
      additionalArguments: ['--route-name=ReaderHistory'],
      zoomFactor: windowSetting.history.zoomFactor,
    },
    icon: path.join(__dirname, 'assets/reader.png'),
    show: false,
    parent: readTimerWin,
  })
  const win = WINDOWS.readerHistory
  closedWindows['readerHistory'] = null
  setOnTop(win)
  win.removeMenu()
  win.loadURL(readerURL).then(() => {
    win.webContents.on('new-window', function (e, url) {
      e.preventDefault()
      shell.openExternal(url)
    })
  })
  win
    .on('closed', (e) => {
      closedWindows['readerHistory'] = win
    })
    .on('moved', () => {
      const [x, y] = win.getPosition()
      saveWindowSetting('history.pos', { x, y })
    })
    .on('resized', () => {
      const [w, h] = win.getSize()
      saveWindowSetting('history.size', { w, h })
    })
  // if (isDev) {
  //   readerHistory.webContents.openDevTools({
  //     mode: 'undocked',
  //   })
  // }
}

function createReaderSpotStatistics(readTimerWin) {
  WINDOWS.readerSpotStatistics = new BrowserWindow({
    width: windowSetting.spotStatistics.size.w,
    height: windowSetting.spotStatistics.size.h,
    x: windowSetting.spotStatistics.pos.x,
    y: windowSetting.spotStatistics.pos.y,
    opacity: windowSetting.spotStatistics.opacity,
    frame: false,
    transparent: false,
    maximizable: false,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
      enableRemoteModule: true,
      preload: __dirname + '/preload.js',
      additionalArguments: ['--route-name=ReaderSpotStatistics'],
      zoomFactor: windowSetting.spotStatistics.zoomFactor,
    },
    icon: path.join(__dirname, 'assets/reader.png'),
    show: false,
    parent: readTimerWin,
  })
  const win = WINDOWS.readerSpotStatistics
  closedWindows['readerSpotStatistics'] = null
  setOnTop(win)
  win.removeMenu()
  win.loadURL(readerURL).then(() => {
    win.webContents.on('new-window', function (e, url) {
      e.preventDefault()
      shell.openExternal(url)
    })
  })
  win
    .on('closed', (e) => {
      closedWindows['readerSpotStatistics'] = win
    })
    .on('moved', () => {
      const [x, y] = win.getPosition()
      saveWindowSetting('spotStatistics.pos', { x, y })
    })
    .on('resized', () => {
      const [w, h] = win.getSize()
      saveWindowSetting('spotStatistics.size', { w, h })
    })
  // if (isDev) {
  //   win.webContents.openDevTools({
  //     mode: 'undocked',
  //   })
  // }
}

function createAndShowLoadingWindow() {
  const win = new BrowserWindow({
    width: 250,
    height: 250,
    frame: false,
    show: true,
    transparent: true,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
      enableRemoteModule: true,
      preload: __dirname + '/preload.js',
    },
    icon: path.join(__dirname, 'assets/icon256.png'),
  })

  win.removeMenu()

  win.once('ready-to-show', () => {
    win.show()
  })
  return win
    .loadURL(
      isDev
        ? `http://localhost:8080/loading`
        : `file://${__dirname}/front-electron-dist/loading.html`
    )
    .then(() => win)
}

function createMainWindow() {
  WINDOWS.main = new BrowserWindow({
    width: windowSetting.main.size.w,
    height: windowSetting.main.size.h,
    x: windowSetting.main.pos.x,
    y: windowSetting.main.pos.y,
    opacity: windowSetting.main.opacity,
    frame: false,
    show: false,
    transparent: false,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
      enableRemoteModule: true,
      preload: __dirname + '/preload.js',
      zoomFactor: windowSetting.main.zoomFactor,
    },
    icon: path.join(__dirname, 'assets/icon256.png'),
  })
  const win = WINDOWS.main
  win.removeMenu()
  win.loadURL(winURL).then(() => {
    createReader()

    win.webContents.on('new-window', function (e, url) {
      e.preventDefault()
      shell.openExternal(url)
    })
  })

  win
    .on('moved', () => {
      const [x, y] = win.getPosition()
      saveWindowSetting('main.pos', { x, y })
    })
    .on('resized', () => {
      const [w, h] = win.getSize()
      saveWindowSetting('main.size', { w, h })
    })
    .on('closed', () => {
      quit()
    })
}

function setOnTop(win) {
  win.setAlwaysOnTop(true, 'screen-saver')
}

function createReader() {
  WINDOWS.readerTimer = new BrowserWindow({
    width: windowSetting.timer.size.w,
    height: windowSetting.timer.size.h,
    x: windowSetting.timer.pos.x,
    y: windowSetting.timer.pos.y,
    opacity: windowSetting.timer.opacity,
    frame: false,
    transparent: false,
    maximizable: false,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
      enableRemoteModule: true,
      preload: __dirname + '/preload.js',
      additionalArguments: ['--route-name=ReaderTimer'],
      zoomFactor: windowSetting.timer.zoomFactor,
    },
    icon: path.join(__dirname, 'assets/reader.png'),
    show: false,
  })
  const win = WINDOWS.readerTimer
  closedWindows['reader'] = null
  setOnTop(win)
  win.removeMenu()
  // reader.maximize()
  win
    .on('closed', (e) => {
      closedWindows['reader'] = win
    })
    .on('hide', (e) => {
      WINDOWS.readerSetting.hide()
      WINDOWS.readerHistory.hide()
      WINDOWS.readerSpotStatistics.hide()
    })
    .on('moved', () => {
      const [x, y] = win.getPosition()
      saveWindowSetting('timer.pos', { x, y })
    })
    .on('resized', () => {
      const [w, h] = win.getSize()
      saveWindowSetting('timer.size', { w, h })
    })

  win.loadURL(readerURL).then(() => {
    win.webContents.on('new-window', function (e, url) {
      e.preventDefault()
      shell.openExternal(url)
    })

    createReaderSetting(win)
    createReaderHistory(win)
    createReaderSpotStatistics(win)

    // FishingDataReader.onUpdate((data) => {
    //   reader.webContents.send('fishingData', data)
    // })
    // FishingDataReader.start(() => {
    //   log.info('Machina started!')
    // })

    // ipcMain.on('startUpdate', () => {
    //   quitAndSetup()
    // })
  })
  // if (isDev) {
  //   win.webContents.openDevTools({
  //     mode: 'undocked',
  //   })
  // }
}

function updateUserData(updateData) {
  WINDOWS.main.webContents.send('updateUserData', updateData)
}

function showReader() {
  if (closedWindows['reader']) {
    createReader()
  }
  WINDOWS.readerTimer && WINDOWS.readerTimer.show()
}

function showReaderSetting() {
  if (closedWindows['readerSetting']) {
    createReaderSetting()
  }
  WINDOWS.readerSetting && WINDOWS.readerSetting.show()
}

function toggleReaderHistory() {
  if (closedWindows['readerHistory']) {
    createReaderHistory(WINDOWS.readerTimer)
  }
  if (WINDOWS.readerHistory.isVisible()) {
    WINDOWS.readerHistory.hide()
  } else {
    WINDOWS.readerHistory.show()
  }
}

function toggleSpotStatistics() {
  if (closedWindows['readerSpotStatistics']) {
    createReaderSpotStatistics(WINDOWS.readerTimer)
  }
  if (WINDOWS.readerSpotStatistics.isVisible()) {
    WINDOWS.readerSpotStatistics.hide()
  } else {
    WINDOWS.readerSpotStatistics.show()
  }
}

function updateIfNeeded() {
  if (skipUpdate) {
    log.info('Update check skipped')
    return
  }

  log.info('Checking updates...')
  let LOCAL_COMMIT_HAST_PATH
  if (isDev) {
    LOCAL_COMMIT_HAST_PATH = __dirname + '/front-electron-dist/COMMITHASH'
  } else {
    LOCAL_COMMIT_HAST_PATH = path.join(app.getAppPath(), '../../resources/COMMITHASH')
  }
  const localCommitHash = fs.readFileSync(LOCAL_COMMIT_HAST_PATH).toString(FILE_ENCODING)
  // let downloadedCommitHash
  // if (fs.existsSync(DOWNLOADED_COMMITHASH_PATH)) {
  //   downloadedCommitHash = fs.readFileSync(DOWNLOADED_COMMITHASH_PATH).toString(FILE_ENCODING)
  // }
  // if (downloadedCommitHash === localCommitHash)

  log.info('Local commit hash', localCommitHash)
  streamToString(download(COMMIT_HASH_DOWNLOAD_LINK)).then((remoteCommitHash) => {
    log.info('Remote commit hash:', remoteCommitHash)
    if (localCommitHash !== remoteCommitHash) {
      log.info('New Version Detected!')
      const throttled = throttle(
        (progress) => WINDOWS.main.webContents.send('setupDownload', progress),
        500
      )
      download(SETUP_EXE_DOWNLOAD_LINK, SETUP_PATH).on('downloadProgress', (progress) => {
        // Report download progress
        throttled(progress)
        WINDOWS.main.setProgressBar(progress.percent)
        if (progress.percent === 1) {
          // fs.writeFileSync(DOWNLOADED_COMMITHASH_PATH, remoteCommitHash, {encoding: FILE_ENCODING})
          WINDOWS.main.webContents.send('checkStartSetup')
        }
      })
    } else {
      log.info('No Update. Wait 10 minutes to check...')
    }
  })
}

function quitAndSetup() {
  FishingDataReader.stop(() => {
    const installerPath = isDev
      ? path.join(__dirname, 'setup/PastryFishSetup.exe')
      : path.join(__dirname, '../../setup/PastryFishSetup.exe')
    log.info('try open path', installerPath)
    shell.showItemInFolder(installerPath)
    log.info('quit before update')
    tray.destroy()
    app.quit()
  })
}

function quit() {
  FishingDataReader.stop(() => {
    log.info('quit by close')
    tray.destroy()
    app.quit()
  })
}

function streamToString(stream) {
  const chunks = []
  return new Promise((resolve, reject) => {
    stream.on('data', (chunk) => chunks.push(chunk))
    stream.on('error', reject)
    stream.on('end', () => resolve(Buffer.concat(chunks).toString(FILE_ENCODING)))
  })
}

const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  log.info('Try open 2nd instance just quit')
  app.quit()
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
    log.info('Focus main window when try to open 2nd instance')
    showAndFocusMain()
  })

  app.whenReady().then(() => init())
}

function showAndFocusMain() {
  if (WINDOWS.main) {
    if (WINDOWS.main.isMinimized()) WINDOWS.main.restore()
    if (!WINDOWS.main.isVisible()) WINDOWS.main.show()
    WINDOWS.main.focus()
  }
}

// app.on('window-all-closed', () => {
//   if (process.platform !== 'darwin') {
//     log.info('in all closed')
//     FishingDataReader.stop(() => {
//       log.info('call quit')
//       // if (toInstallUpdates) {
//       //   log.info('try install')
//       //   exec('./setup/PastryFishSetup.exe')
//       // } else {
//       app.quit()
//       // }
//     })
//   }
// })

// app.on("activate", () => {
//   if (BrowserWindow.getAllWindows().length === 0) {
//     createMainWindow();
//   }
// });
