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

const COMMIT_HASH_DOWNLOAD_LINK =
  'https://ricecake302-generic.pkg.coding.net/pastry-fish/desktop-version/COMMITHASH?version=latest'
const SETUP_EXE_DOWNLOAD_LINK =
  'https://ricecake302-generic.pkg.coding.net/pastry-fish/desktop-app/PastryFishSetup.exe?version=latest'
log.transports.console.level = 'silly'

let tray,
  main,
  reader,
  readerSetting,
  readerHistory,
  readerSpotStatistics,
  loading,
  loadingForReloadingPage
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

async function init() {
  await createAndShowLoadingWindow().then((win) => (loading = win))
  createMainWindow()

  FishingDataReader.onUpdate((data) => {
    main.webContents.send('fishingData', data)
    reader && reader.webContents.send('fishingData', data)
    readerSpotStatistics && readerSpotStatistics.webContents.send('fishingData', data)
  })
  FishingDataReader.onFishCaught((data) => {
    main.webContents.send('fishCaught', data)
  })
  FishingDataReader.onNewRecord((data) => {
    reader && reader.webContents.send('newRecord', data)
    readerHistory && readerHistory.webContents.send('newRecord', data)
    readerSpotStatistics && readerSpotStatistics.webContents.send('newRecord', data)
  })

  updateIfNeeded()
  setInterval(updateIfNeeded, CONSTANTS.INTERVAL_MINUTE * 10)

  ipcMain
    .on('startReader', (event, options) => {
      FishingDataReader.start(options, () => {
        log.info('Machina started!', options)
      })
    })
    .on('restartReader', (event, options) => {
      FishingDataReader.restart(options, () => {
        log.info('Machina restarted!', options)
      })
    })
    .on('startUpdate', () => {
      quitAndSetup()
    })
    .on('openReader', () => {
      log.info('show reader')
      showReader()
    })
    .on('showSetting', () => {
      showReaderSetting(reader)
    })
    .on('updateUserData', (event, updateData) => {
      // log.info('updateUserData', updateData.data)
      updateUserData(updateData)

      setWindow(main, updateData.data.main)
      setWindow(readerSetting, updateData.data.setting)
      setWindow(reader, updateData.data.timer)
      setWindow(readerHistory, updateData.data.history)
      setWindow(readerSpotStatistics, updateData.data.spotStatistics)
      if (!loading.isDestroyed()) {
        main.show()
        loading.close()
      }
    })
    .on('reloadUserData', () => {
      reader.webContents.send('reloadUserData')
    })
    .on('skipUpdate', () => {
      skipUpdate = true
      main.setProgressBar(0)
      log.info('Update skipped')
    })
    .on('toggleHistory', () => {
      toggleReaderHistory()
    })
    .on('toggleSpotStatistics', () => {
      toggleSpotStatistics()
    })
    .on('zoomMainWindow', (event, zoomFactor) => {
      log.info('zoom main window', zoomFactor)
      main.webContents.setZoomFactor(zoomFactor)
    })
    .on('setCollapse', (event, collapse) => {
      if (collapse) {
        main.setSize(112, 88)
      } else {
        main.setSize(mainSize.w, mainSize.h)
      }
    })
    .on('setReaderMiniMode', (event, mini) => {
      if (mini) {
        reader.setSize(readerSize.w, 52)
      } else {
        reader.setSize(readerSize.w, readerSize.h)
      }
    })
    .on('startLoading', () => {
      // return createAndShowLoadingWindow().then(win => loadingForReloadingPage = win)
    })
    .on('finishLoading', () => {
      // if (loadingForReloadingPage != null && !loadingForReloadingPage.isDestroyed()) {
      //   return loadingForReloadingPage.close()
      // }
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
            readerHistory.webContents.send('exportHistoryFailedWithBusyFile')
          }
          log.info(err)
        })
        .finally(() => {
          readerHistory.webContents.send('exportHistoryFinished')
        })
    })
    .on('showSpotPage', (event, spotId) => {
      main.webContents.send('showSpotPage', spotId)
      if (main.isMinimized()) {
        main.restore()
      }
      main.focus()
    })

  globalShortcut.register('Alt+CommandOrControl+L', () => {
    showReader()
  })
  globalShortcut.register('Alt+CommandOrControl+T', () => {
    main &&
      main.webContents.openDevTools({
        mode: 'undocked',
      })
  })

  tray = new Tray(path.join(__dirname, 'assets/icon256.png'))
  const contextMenu = Menu.buildFromTemplate([{ label: '退出鱼糕程序', click: quit }])
  tray.setToolTip('点击显示鱼糕')
  tray.setContextMenu(contextMenu)
  tray.on('click', showAndFocusMain)
}

let mainSize = { w: -1, h: -1 }
let readerSize = { w: -1, h: -1 }

function setWindow(window, option) {
  if (option.opacity) {
    window.setOpacity(option.opacity)
  }
  if (option.zoomFactor && window.webContents.zoomFactor !== option.zoomFactor) {
    window.webContents.setZoomFactor(option.zoomFactor)
  }
  if (option.pos != null && option.pos.x != null && option.pos.y != null) {
    window.setPosition(option.pos.x, option.pos.y)
  }
  if (option.size.w > 0 && option.size.h > 0) {
    window.setSize(option.size.w, option.size.h)
  }
  if (window === main) {
    mainSize = { w: option.size.w, h: option.size.h }
  } else if (window === reader) {
    readerSize = { w: option.size.w, h: option.size.h }
  }
}

function createReaderSetting(readTimerWin) {
  readerSetting = new BrowserWindow({
    width: 500,
    height: 500,
    frame: false,
    transparent: true,
    maximizable: false,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
      enableRemoteModule: true,
      preload: __dirname + '/preload.js',
      additionalArguments: ['--route-name=ReaderSetting'],
    },
    icon: path.join(__dirname, 'assets/setting.png'),
    show: false,
    parent: readTimerWin,
  })
  const win = readerSetting
  closedWindows['readerSetting'] = null
  win.setOpacity(1)
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
      updateUserData({
        path: 'reader.setting.pos',
        data: { x, y },
      })
    })
    .on('resized', () => {
      const [w, h] = win.getSize()
      updateUserData({
        path: 'reader.setting.size',
        data: { w, h },
      })
    })

  if (isDev) {
    win.webContents.openDevTools({
      mode: 'bottom',
    })
  }
}

function createReaderHistory(readTimerWin) {
  readerHistory = new BrowserWindow({
    width: 500,
    height: 800,
    frame: false,
    transparent: true,
    maximizable: false,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
      enableRemoteModule: true,
      preload: __dirname + '/preload.js',
      additionalArguments: ['--route-name=ReaderHistory'],
    },
    icon: path.join(__dirname, 'assets/reader.png'),
    show: false,
    parent: readTimerWin,
  })
  const win = readerHistory
  closedWindows['readerHistory'] = null
  win.setOpacity(0.9)
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
      updateUserData({
        path: 'reader.history.pos',
        data: { x, y },
      })
    })
    .on('resized', () => {
      const [w, h] = win.getSize()
      updateUserData({
        path: 'reader.history.size',
        data: { w, h },
      })
    })
  if (isDev) {
    readerHistory.webContents.openDevTools({
      mode: 'undocked',
    })
  }
}

function createReaderSpotStatistics(readTimerWin) {
  readerSpotStatistics = new BrowserWindow({
    width: 500,
    height: 500,
    frame: false,
    transparent: true,
    maximizable: false,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
      enableRemoteModule: true,
      preload: __dirname + '/preload.js',
      additionalArguments: ['--route-name=ReaderSpotStatistics'],
    },
    icon: path.join(__dirname, 'assets/reader.png'),
    show: false,
    parent: readTimerWin,
  })
  const win = readerSpotStatistics
  closedWindows['readerSpotStatistics'] = null
  win.setOpacity(0.9)
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
      updateUserData({
        path: 'reader.spotStatistics.pos',
        data: { x, y },
      })
    })
    .on('resized', () => {
      const [w, h] = win.getSize()
      updateUserData({
        path: 'reader.spotStatistics.size',
        data: { w, h },
      })
    })
  // if (isDev) {
  //   win.webContents.openDevTools({
  //     mode: 'undocked',
  //   })
  // }
}

function createAndShowLoadingWindow() {
  const win = new BrowserWindow({
    width: 300,
    height: 300,
    frame: false,
    show: true,
    transparent: true,
    opacity: 0.9,
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
  main = new BrowserWindow({
    width: 1080,
    height: 768,
    frame: false,
    show: false,
    transparent: true,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
      enableRemoteModule: true,
      preload: __dirname + '/preload.js',
    },
    icon: path.join(__dirname, 'assets/icon256.png'),
  })
  const win = main
  // win.once('ready-to-show', () => {
  //   win.show()
  // })
  // win.setOpacity(0.9)
  // win.setAlwaysOnTop(true)
  win.removeMenu()
  // win.maximize()
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
      updateUserData({ path: 'reader.main.pos', data: { x, y } })
    })
    .on('resized', () => {
      const [w, h] = win.getSize()
      mainSize = { w, h }
      updateUserData({ path: 'reader.main.size', data: { w, h } })
    })
    .on('closed', () => {
      quit()
    })

  // if (isDev) {
  //   win.webContents.openDevTools({
  //     mode: 'undocked',
  //   })
  // }
}

function setOnTop(win) {
  win.setAlwaysOnTop(true, 'screen-saver')
}

function createReader() {
  reader = new BrowserWindow({
    width: 500,
    height: 160,
    frame: false,
    transparent: true,
    maximizable: false,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
      enableRemoteModule: true,
      preload: __dirname + '/preload.js',
      additionalArguments: ['--route-name=ReaderTimer'],
    },
    icon: path.join(__dirname, 'assets/reader.png'),
    show: false,
  })
  const win = reader
  closedWindows['reader'] = null
  win.setOpacity(0.9)
  setOnTop(win)
  win.removeMenu()
  // reader.maximize()
  win
    .on('closed', (e) => {
      closedWindows['reader'] = win
    })
    .on('hide', (e) => {
      readerSetting.hide()
      readerHistory.hide()
      readerSpotStatistics.hide()
    })
    .on('moved', () => {
      const [x, y] = win.getPosition()
      updateUserData({
        path: 'reader.timer.pos',
        data: { x, y },
      })
    })
    .on('resized', () => {
      const [w, h] = win.getSize()
      readerSize = { w, h }
      updateUserData({
        path: 'reader.timer.size',
        data: { w, h },
      })
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
  if (isDev) {
    win.webContents.openDevTools({
      mode: 'undocked',
    })
  }
}

function updateUserData(updateData) {
  main.webContents.send('updateUserData', updateData)
}

function showReader() {
  if (closedWindows['reader']) {
    createReader()
  }
  reader && reader.show()
}

function showReaderSetting() {
  if (closedWindows['readerSetting']) {
    createReaderSetting()
  }
  readerSetting && readerSetting.show()
}

function toggleReaderHistory() {
  if (closedWindows['readerHistory']) {
    createReaderHistory(reader)
  }
  if (readerHistory.isVisible()) {
    readerHistory.hide()
  } else {
    readerHistory.show()
  }
}

function toggleSpotStatistics() {
  if (closedWindows['readerSpotStatistics']) {
    createReaderSpotStatistics(reader)
  }
  if (readerSpotStatistics.isVisible()) {
    readerSpotStatistics.hide()
  } else {
    readerSpotStatistics.show()
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
        (progress) => main.webContents.send('setupDownload', progress),
        500
      )
      download(SETUP_EXE_DOWNLOAD_LINK, SETUP_PATH).on('downloadProgress', (progress) => {
        // Report download progress
        throttled(progress)
        main.setProgressBar(progress.percent)
        if (progress.percent === 1) {
          // fs.writeFileSync(DOWNLOADED_COMMITHASH_PATH, remoteCommitHash, {encoding: FILE_ENCODING})
          main.webContents.send('checkStartSetup')
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
    app.quit()
  })
}

function quit() {
  FishingDataReader.stop(() => {
    log.info('quit by close')
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
  if (main) {
    if (main.isMinimized()) main.restore()
    if (!main.isVisible()) main.show()
    main.focus()
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
