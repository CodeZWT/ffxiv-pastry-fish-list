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
const merge = require('lodash/merge')
const unhandled = require('electron-unhandled')
const contextMenu = require('electron-context-menu')

const COMMIT_HASH_DOWNLOAD_LINK =
  'https://ricecake302-generic.pkg.coding.net/pastry-fish/desktop-version/COMMITHASH?version=latest'
const SETUP_EXE_DOWNLOAD_LINK =
  'https://ricecake302-generic.pkg.coding.net/pastry-fish/desktop-app/PastryFishSetup.exe?version=latest'
log.transports.console.level = 'silly'

const WINDOWS = {}
let tray, loadingForReloadingPage, configStore, windowSetting, region
let readerMini = false
let intervalHandle

const FILE_ENCODING = 'utf8'
const SETUP_PATH = 'setup'
let skipUpdate = isDev || false
// const DOWNLOADED_COMMITHASH_PATH = SETUP_PATH + '/DOWNLOADED_COMMITHASH'
const closedWindows = {}

unhandled({
  logger: log.error,
  reportButton: (error) => {
    shell.showItemInFolder(path.join(app.getPath('userData'), 'logs/main.log'))
  },
})
contextMenu()
const DEFAULT_WINDOW_SETTING = {
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
    size: { w: 500, h: 250 },
    opacity: 0.9,
    zoomFactor: 1,
  },
  timerMini: {
    size: { w: 500, h: 120 },
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
}
function initWindowSetting(configStore) {
  const setting = configStore.get('windowSetting')
  if (!setting) {
    configStore.set('windowSetting', DEFAULT_WINDOW_SETTING)
    log.info('Initialize user config in', app.getPath('userData'))
  } else {
    configStore.set('windowSetting', merge(DEFAULT_WINDOW_SETTING, setting))
    log.debug('Config Read', JSON.stringify(configStore.get('windowSetting')))
  }
}

function saveWindowSetting(path, value) {
  set(windowSetting, path, value)
  configStore.set('windowSetting', windowSetting)
}
let settingVisible = false,
  historyVisible = false,
  spotStatisticsVisible = false
async function init() {
  if (isDev) {
    const {
      default: installExtension,
      VUEJS_DEVTOOLS,
    } = require('electron-devtools-installer')
    installExtension(VUEJS_DEVTOOLS)
      .then((name) => log.info(`Added Extension:  ${name}`))
      .catch((err) => log.info('An error occurred: ', err))
    ipcMain
      .on('nextTestEvent', () => {
        FishingDataReader.nextTestEvent()
      })
      .on('resetTest', () => {
        FishingDataReader.resetTest()
      })
  }

  FishingDataReader.onUpdate((data) => {
    WINDOWS.main.webContents.send('fishingData', data)
    WINDOWS.readerTimer && WINDOWS.readerTimer.webContents.send('fishingData', data)
    WINDOWS.timerMini && WINDOWS.timerMini.webContents.send('fishingData', data)
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
      WINDOWS.timerMini.webContents.send('reloadUserData')
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
    .on('miniMode', (event, mainMini) => {
      switchMiniMode(mainMini)
    })
    .on('timerMiniMode', (event, mini) => {
      switchReaderMiniMode(mini)
    })
    .on('startLoading', () => {
      // return createAndShowLoadingWindow().then(win => loadingForReloadingPage = win)
    })
    .on('finishLoading', () => {
      // if (loadingForReloadingPage != null && !loadingForReloadingPage.isDestroyed()) {
      //   return loadingForReloadingPage.close()
      // }
      log.info('in finishLoading')
      WINDOWS.main.show()
      if (!WINDOWS.loading.isDestroyed()) {
        log.info('try close loading window')
        WINDOWS.loading.close()
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
      Object.entries({
        timer: 'readerTimer',
        timerMini: 'timerMini',
        history: 'readerHistory',
        spotStatistics: 'readerSpotStatistics',
      }).forEach(([settingName, windowName]) => {
        if (
          newWindowSetting[settingName] &&
          WINDOWS[windowName] &&
          newWindowSetting[settingName].zoomFactor > 0.3
        ) {
          if (settingName !== 'timerMini') {
            saveWindowSetting(
              settingName + '.opacity',
              newWindowSetting[settingName].opacity
            )
            WINDOWS[windowName].setOpacity(newWindowSetting[settingName].opacity)
          }
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
    .on('listCntUpdated', (event, listCnt) => {
      WINDOWS.mini.send('listCntUpdated', listCnt)
    })
    .on('reloadRecords', () => {
      WINDOWS.readerSpotStatistics.send('reloadRecords')
    })

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
    // WINDOWS.timerMini &&
    //   WINDOWS.timerMini.webContents.openDevTools({
    //     mode: 'undocked',
    //   })
  })

  await createAndShowLoadingWindow()
  configStore = new Store()
  initWindowSetting(configStore)
  windowSetting = configStore.get('windowSetting')
  createMainWindow()
  await createMiniWin(WINDOWS.main)
  updateIfNeeded()
  intervalHandle = setInterval(
    () => updateIfNeeded(intervalHandle),
    CONSTANTS.INTERVAL_MINUTE * 10
  )

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
  WINDOWS.timerMini && WINDOWS.timerMini.setIgnoreMouseEvents(enable, { forward: true })
  WINDOWS.readerHistory &&
    WINDOWS.readerHistory.setIgnoreMouseEvents(enable, { forward: true })
  WINDOWS.readerSpotStatistics &&
    WINDOWS.readerSpotStatistics.setIgnoreMouseEvents(enable, { forward: true })
}

function switchMiniMode(mini) {
  if (mini) {
    const [x, y] = WINDOWS.main.getPosition()
    WINDOWS.mini.setPosition(x, y + MINI_POS_OFFSET)
    WINDOWS.mini.show()
    WINDOWS.main.hide()
  } else {
    WINDOWS.mini.hide()
    WINDOWS.main.show()
  }
}

function switchReaderMiniMode(mini) {
  if (mini) {
    const [x, y] = WINDOWS.readerTimer.getPosition()
    settingVisible = WINDOWS.readerSetting.isVisible()
    historyVisible = WINDOWS.readerHistory.isVisible()
    spotStatisticsVisible = WINDOWS.readerSpotStatistics.isVisible()
    WINDOWS.readerTimer.hide()
    WINDOWS.timerMini.setPosition(x, y + READER_MINI_POS_OFFSET)
    WINDOWS.timerMini.show()
  } else {
    settingVisible = false
    historyVisible = false
    spotStatisticsVisible = false
    WINDOWS.timerMini.hide()
    WINDOWS.readerTimer.show()
  }
}

function createReaderSetting(readTimerWin) {
  const settingName = 'setting'
  const windowName = 'readerSetting'
  closedWindows[settingName] = null
  const win = createWindow(
    windowName,
    settingName,
    'assets/setting.png',
    'reader',
    'setting',
    () => {},
    ['--route-name=ReaderSetting'],
    false,
    true,
    readTimerWin
  )
  win.on('closed', () => {
    closedWindows[windowName] = win
  })
}

function createReaderHistory(readTimerWin) {
  const settingName = 'history'
  const windowName = 'readerHistory'
  closedWindows[settingName] = null
  const win = createWindow(
    windowName,
    settingName,
    'assets/reader.png',
    'reader',
    'history',
    () => {},
    null,
    false,
    true,
    readTimerWin
  )
  win.on('closed', (e) => {
    closedWindows[windowName] = win
  })
}

function createReaderSpotStatistics(readTimerWin) {
  const settingName = 'spotStatistics'
  const windowName = 'readerSpotStatistics'
  closedWindows[settingName] = null
  const win = createWindow(
    windowName,
    settingName,
    'assets/reader.png',
    'reader',
    'spotStatistics',
    () => {},
    ['--route-name=ReaderSpotStatistics'],
    false,
    true,
    readTimerWin
  )
  win.on('closed', (e) => {
    closedWindows[windowName] = win
  })
}

function createTransparentWin(
  windowName,
  page,
  hash,
  width,
  height,
  show,
  additionalArguments = null
) {
  WINDOWS[windowName] = new BrowserWindow({
    width: width,
    height: height,
    frame: false,
    show: true,
    transparent: true,
    resizable: false,
    maximizable: false,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
      enableRemoteModule: true,
      preload: __dirname + '/preload.js',
      additionalArguments: additionalArguments,
    },
    icon: path.join(__dirname, 'assets/icon256.png'),
  })
  const win = WINDOWS[windowName]
  win.removeMenu()
  setOnTop(win)
  if (!show) {
    win.hide()
  }
  win.once('ready-to-show', () => {
    if (show) win.show()
  })
  let loadedPromise
  if (isDev) {
    loadedPromise = win.loadURL(
      `http://localhost:8080/${page}${hash ? '/#/' + hash : ''}`
    )
  } else {
    loadedPromise = win.loadFile(
      path.join(__dirname, `/front-electron-dist/${page}.html`),
      {
        hash: hash && '/' + hash,
      }
    )
  }
  return loadedPromise.then(() => win)
}
const MINI_POS_OFFSET = 20
function createMiniWin(parent) {
  return createTransparentWin('mini', 'mini', null, 150, 100, false)
    .then((win) => {
      win.setParentWindow(parent)
      return win.on('moved', () => {
        const [x, y] = win.getPosition()
        WINDOWS.main.setPosition(x, y - MINI_POS_OFFSET)
        saveWindowSetting('main.pos', { x, y: y - MINI_POS_OFFSET })
      })
    })
    .catch((error) => {
      log.info('caught error in create main mini', error)
    })
}

function createAndShowLoadingWindow() {
  return createTransparentWin('loading', 'loading', null, 250, 250, true).catch(
    (error) => {
      log.info('caught error in create loading', error)
    }
  )
}

const READER_MINI_POS_OFFSET = 56
function createTimerMiniWin(parent) {
  return createTransparentWin(
    'timerMini',
    'reader',
    'timerMini',
    windowSetting.timerMini.size.w,
    windowSetting.timerMini.size.h,
    false,
    ['--route-name=ReaderTimer', '--mode=mini']
  )
    .then((win) => {
      win.setParentWindow(parent)
      win.setResizable(true)
      return win
        .on('moved', () => {
          const [x, y] = win.getPosition()
          WINDOWS.readerTimer.setPosition(x, y - READER_MINI_POS_OFFSET)
          saveWindowSetting('timer.pos', { x, y: y - READER_MINI_POS_OFFSET })
        })
        .on('resized', () => {
          const [w, h] = win.getSize()
          saveWindowSetting('timerMini.size', { w, h })
        })
    })
    .catch((error) => {
      log.info('caught error in create timer mini', error)
    })
}

function createWindow(
  windowName,
  settingName,
  iconPath,
  page,
  hash,
  loadedCallback = () => {},
  additionalArguments = null,
  maximizable = true,
  keepOnTop = false,
  parent = null
) {
  const setting = windowSetting[settingName]
  WINDOWS[windowName] = new BrowserWindow({
    width: setting.size.w,
    height: setting.size.h,
    x: setting.pos.x,
    y: setting.pos.y,
    opacity: setting.opacity,
    frame: false,
    show: false,
    transparent: false,
    maximizable: maximizable,
    icon: path.join(__dirname, iconPath),
    parent: parent,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
      enableRemoteModule: true,
      preload: __dirname + '/preload.js',
      zoomFactor: setting.zoomFactor,
      additionalArguments: additionalArguments,
    },
  })
  const win = WINDOWS[windowName]
  win.removeMenu()
  win.webContents.on('new-window', (e, url) => {
    e.preventDefault()
    shell.openExternal(url)
  })
  if (isDev) {
    win
      .loadURL(`http://localhost:8080/${page}${hash ? '/#/' + hash : ''}`)
      .then(loadedCallback)
  } else {
    win
      .loadFile(path.join(__dirname, `/front-electron-dist/${page}.html`), {
        hash: hash && '/' + hash,
      })
      .then(loadedCallback)
  }

  if (keepOnTop) setOnTop(win)

  return win
    .on('moved', () => {
      const [x, y] = win.getPosition()
      saveWindowSetting(settingName + '.pos', { x, y })
    })
    .on('resized', () => {
      const [w, h] = win.getSize()
      saveWindowSetting(settingName + '.size', { w, h })
    })
}

function createMainWindow() {
  return createWindow(
    'main',
    'main',
    'assets/icon256.png',
    'index',
    null,
    createReader
  ).on('closed', () => {
    quit()
  })
}

function setOnTop(win) {
  win.setAlwaysOnTop(true, 'screen-saver')
  win.setMinimizable(false)
}

function createReader() {
  const settingName = 'timer'
  closedWindows[settingName] = null
  const win = createWindow(
    'readerTimer',
    settingName,
    'assets/reader.png',
    'reader',
    null,
    () => {
      createTimerMiniWin(win)
      createReaderSetting(win)
      createReaderHistory(win)
      createReaderSpotStatistics(win)
    },
    ['--route-name=ReaderTimer', '--mode=normal'],
    false,
    true
  )
  win
    .on('resized', () => {
      const [w, h] = win.getSize()
      if (readerMini) {
        saveWindowSetting('timerMini.size', { w, h })
      } else {
        saveWindowSetting('timer.size', { w, h })
      }
    })
    .on('closed', (e) => {
      closedWindows[settingName] = win
    })
    .on('hide', (e) => {
      settingVisible || WINDOWS.readerSetting.hide()
      historyVisible || WINDOWS.readerHistory.hide()
      spotStatisticsVisible || WINDOWS.readerSpotStatistics.hide()
    })
}

function updateUserData(updateData) {
  WINDOWS.main.webContents.send('updateUserData', updateData)
}

function showReader() {
  if (closedWindows['timer']) {
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

async function downloadCommitHash() {
  return download(COMMIT_HASH_DOWNLOAD_LINK)
    .on('error', (err) => log.error('Error in download commit hash:', err))
    .then((data) => {
      return data.toString(FILE_ENCODING)
    })
    .catch(() => {
      // do nothing
    })
}

async function downloadSetupFile(onDownloadProgress, onFinished) {
  return download(SETUP_EXE_DOWNLOAD_LINK, SETUP_PATH)
    .on('downloadProgress', (progress) => {
      try {
        // Report download progress
        onDownloadProgress(progress)
      } catch (e) {
        log.error('In downloadProgress.', e)
      }
    })
    .on('error', (err) => log.error('Error in download setup:', err))
    .then(() => {
      onFinished()
    })
    .catch(() => {
      // do nothing
    })
}

async function updateIfNeeded(intervalHandle) {
  if (skipUpdate) {
    log.info('Update check skipped')
    return
  }

  log.info('Checking updates...')
  let LOCAL_COMMIT_HAST_PATH
  if (isDev) {
    LOCAL_COMMIT_HAST_PATH = __dirname + '/front-electron-dist/VERSION' //COMMITHASH
  } else {
    LOCAL_COMMIT_HAST_PATH = path.join(app.getAppPath(), '../../resources/COMMITHASH')
  }
  const localCommitHash = fs.readFileSync(LOCAL_COMMIT_HAST_PATH).toString(FILE_ENCODING)
  log.info('Local commit hash', localCommitHash)
  const remoteCommitHash = await downloadCommitHash()
  log.info('Remote commit hash:', remoteCommitHash)
  if (localCommitHash !== remoteCommitHash && remoteCommitHash != null) {
    clearInterval(intervalHandle)
    log.info('New Version Detected!')
    const throttled = throttle(
      (progress) => {
        try {
          log.info('progress', progress.percent)
          if (!WINDOWS.main.isDestroyed()) {
            WINDOWS.main.webContents.send('setupDownload', progress)
            WINDOWS.main.setProgressBar(progress.percent)
          }
        } catch (e) {
          log.error('Try set download progress failed.', e)
        }
      },
      500,
      { leading: true, trailing: false }
    )
    await downloadSetupFile(throttled, () => {
      try {
        log.info('download setup finished')
        WINDOWS.main.webContents.send('checkStartSetup')
      } catch (e) {
        log.error('Try open update dialog failed.', e)
      }
    })
  } else {
    log.info('No Update. Wait 10 minutes to check...')
  }
}

function quitAndSetup() {
  try {
    clearInterval(intervalHandle)
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
  } catch (e) {
    console.error('Error in quitAndSetup', e)
  }
}

function quit() {
  try {
    clearInterval(intervalHandle)
    FishingDataReader.stop(() => {
      log.info('quit by close')
      tray.destroy()
      app.quit()
    })
  } catch (e) {
    console.error('Error in quit', e)
  }
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

  app
    .whenReady()
    .then(() => init())
    .catch((error) => {
      log.error('error in init', error)
    })
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
