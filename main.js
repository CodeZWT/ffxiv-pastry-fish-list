const { app, BrowserWindow, ipcMain, shell, globalShortcut } = require('electron')
const isDev = require('electron-is-dev')
const FishingDataReader = require('./server/reader')
const log = require('electron-log')
const download = require('download')
const fs = require('fs')
const path = require('path')
const throttle = require('lodash/throttle')
const CONSTANTS = require("./data/constants");
const exec = require('child_process').exec

const COMMIT_HASH_DOWNLOAD_LINK =
  'https://ricecake302-generic.pkg.coding.net/pastry-fish/desktop-version/COMMITHASH?version=latest'
const SETUP_EXE_DOWNLOAD_LINK =
  'https://ricecake302-generic.pkg.coding.net/pastry-fish/desktop-app/PastryFishSetup.exe?version=latest'
log.transports.console.level = 'silly'

let win, reader, readerSetting, readerHistory, readerSpotStatistics
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

function init() {
  createMainWindow()

  FishingDataReader.onUpdate((data) => {
    win.webContents.send('fishingData', data)
    reader && reader.webContents.send('fishingData', data)
    readerSpotStatistics && readerSpotStatistics.webContents.send('fishingData', data)
  })
  FishingDataReader.start(() => {
    log.info('Machina started!')
  })
  FishingDataReader.onFishCaught(data => {
    win.webContents.send('fishCaught', data)
  })
  FishingDataReader.onNewRecord(data => {
    reader && reader.webContents.send('newRecord', data)
    readerHistory && readerHistory.webContents.send('newRecord', data)
    readerSpotStatistics && readerSpotStatistics.webContents.send('newRecord', data)
  })

  updateIfNeeded()
  setInterval(updateIfNeeded, CONSTANTS.INTERVAL_MINUTE * 10)

  ipcMain
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
      win.webContents.send('updateUserData', updateData)
      reader.setOpacity(updateData.data.timerOpacity)
      readerHistory.setOpacity(updateData.data.historyOpacity)
    })
    .on('reloadUserData', () => {
      reader.webContents.send('reloadUserData')
    })
    .on('skipUpdate', () => {
      skipUpdate = true
      win.setProgressBar(0)
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
      win.webContents.setZoomFactor(zoomFactor)
    })


  globalShortcut.register('Alt+CommandOrControl+L', () => {
    showReader()
  })
  globalShortcut.register('Alt+CommandOrControl+T', () => {
    win && win.webContents.openDevTools({
      mode: 'undocked',
    })
  })
}

function createReaderSetting(readTimerWin) {
  readerSetting = new BrowserWindow({
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
      additionalArguments: ['--route-name=ReaderSetting']
    },
    icon: path.join(__dirname, 'assets/setting.png'),
    show: false,
    parent: readTimerWin,
  })
  closedWindows['readerSetting'] = null
  readerSetting.setOpacity(1)
  setOnTop(readerSetting)
  readerSetting.removeMenu()
  readerSetting.loadURL(readerURL).then(() => {
    readerSetting.webContents.on('new-window', function (e, url) {
      e.preventDefault()
      shell.openExternal(url)
    })
  })
  readerSetting.on('closed', (e) => {
    closedWindows['readerSetting'] = readerSetting
  })

  if (isDev) {
    readerSetting.webContents.openDevTools({
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
      additionalArguments: ['--route-name=ReaderHistory']
    },
    icon: path.join(__dirname, 'assets/reader.png'),
    show: false,
    parent: readTimerWin,
  })
  closedWindows['readerHistory'] = null
  readerHistory.setOpacity(0.9)
  setOnTop(readerHistory)
  readerHistory.removeMenu()
  readerHistory.loadURL(readerURL).then(() => {
    readerHistory.webContents.on('new-window', function (e, url) {
      e.preventDefault()
      shell.openExternal(url)
    })
  })
  readerHistory.on('closed', (e) => {
    closedWindows['readerHistory'] = readerHistory
  })
  // if (isDev) {
  //   readerHistory.webContents.openDevTools({
  //     mode: 'undocked',
  //   })
  // }
}

function createReaderSpotStatistics(readTimerWin) {
  readerSpotStatistics = new BrowserWindow({
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
      additionalArguments: ['--route-name=ReaderSpotStatistics']
    },
    icon: path.join(__dirname, 'assets/reader.png'),
    show: false,
    parent: readTimerWin,
  })
  closedWindows['readerSpotStatistics'] = null
  readerSpotStatistics.setOpacity(0.9)
  setOnTop(readerSpotStatistics)
  readerSpotStatistics.removeMenu()
  readerSpotStatistics.loadURL(readerURL).then(() => {
    readerSpotStatistics.webContents.on('new-window', function (e, url) {
      e.preventDefault()
      shell.openExternal(url)
    })
  })
  readerSpotStatistics.on('closed', (e) => {
    closedWindows['readerSpotStatistics'] = readerSpotStatistics
  })
  if (isDev) {
    readerSpotStatistics.webContents.openDevTools({
      mode: 'undocked',
    })
  }
}

function createMainWindow() {
  win = new BrowserWindow({
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
  win.once('ready-to-show', () => {
    win.show()
  })
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
  win.on("closed", () => {
    FishingDataReader.stop(() => {
      log.info('quit by close')
      app.quit()
    })
  })

  if (isDev) {
    win.webContents.openDevTools({
      mode: 'right',
    })
  }
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
      additionalArguments: ['--route-name=ReaderTimer']
    },
    icon: path.join(__dirname, 'assets/reader.png'),
    show: false
  })
  closedWindows['reader'] = null
  reader.setOpacity(0.8)
  setOnTop(reader)
  reader.removeMenu()
  // reader.maximize()
  reader
    .on('closed', (e) => {
      closedWindows['reader'] = reader
    })
    .on('hide', (e) => {
      readerSetting.hide()
      readerHistory.hide()
    })
  reader.loadURL(readerURL).then(() => {
    reader.webContents.on('new-window', function (e, url) {
      e.preventDefault()
      shell.openExternal(url)
    })

    createReaderSetting(reader)
    createReaderHistory(reader)
    createReaderSpotStatistics(reader)

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
    reader.webContents.openDevTools({
      mode: 'bottom',
    })
  }
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
        (progress) => win.webContents.send('setupDownload', progress),
        500
      )
      download(SETUP_EXE_DOWNLOAD_LINK, SETUP_PATH).on('downloadProgress', (progress) => {
        // Report download progress
        throttled(progress)
        win.setProgressBar(progress.percent)
        if (progress.percent === 1) {
          // fs.writeFileSync(DOWNLOADED_COMMITHASH_PATH, remoteCommitHash, {encoding: FILE_ENCODING})
          win.webContents.send('checkStartSetup')
        }
      })
    } else {
      log.info('No Update. Wait 10 minutes to check...')
    }
  })
}

function quitAndSetup() {
  FishingDataReader.stop(() => {
    log.info('try install')
    exec('start "" "setup"', () => app.quit())
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

app.whenReady()
  .then(init)

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
