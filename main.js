const { app, BrowserWindow, ipcMain } = require('electron')
const isDev = require('electron-is-dev')
const FishingDataReader = require('./server/reader')
const log = require('electron-log')
const download = require('download')
const fs = require('fs')
const path = require('path')
const throttle = require('lodash/throttle')
const exec = require('child_process').exec

const COMMIT_HASH_DOWNLOAD_LINK =
  'https://ricecake302-generic.pkg.coding.net/pastry-fish/desktop-version/COMMITHASH?version=latest'
const SETUP_EXE_DOWNLOAD_LINK =
  'https://ricecake302-generic.pkg.coding.net/pastry-fish/desktop-app/PastryFishSetup.exe?version=latest'
log.transports.console.level = 'silly'

let toInstallUpdates = false
let win
const winURL = isDev
  ? `http://localhost:8080`
  : `file://${__dirname}/front-electron-dist/index.html`
console.log(winURL)

const FILE_ENCODING = 'utf8'
const SETUP_PATH = 'setup'

// const DOWNLOADED_COMMITHASH_PATH = SETUP_PATH + '/DOWNLOADED_COMMITHASH'

function createWindow() {
  win = new BrowserWindow({
    width: 1280,
    height: 500,
    frame: true,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      preload: __dirname + '/preload.js',
    },
  })
  // win.setOpacity(0.9)
  // win.setAlwaysOnTop(true)
  win.removeMenu()
  // win.maximize()
  win.loadURL(winURL).then(() => {
    FishingDataReader.onUpdate((data) => {
      win.webContents.send('fishingData', data)
    })
    FishingDataReader.start(() => {
      log.info('Machina started!')
    })


    updateIfNeeded()
    setInterval(updateIfNeeded, 600000)

    ipcMain.on('startUpdate', () => {
      quitAndSetup()
    })
  })
  if (isDev) {
    win.webContents.openDevTools({
      mode: 'undocked',
    })
  }
}

function updateIfNeeded() {
  log.info('Check Update...')
  let LOCAL_COMMIT_HAST_PATH
  if (isDev) {
    LOCAL_COMMIT_HAST_PATH = __dirname + '/front-electron-dist/COMMITHASH'
  } else {
    LOCAL_COMMIT_HAST_PATH = path.join(app.getAppPath(), '../../resources/COMMITHASH')
  }
  const localCommitHash = fs
    .readFileSync(LOCAL_COMMIT_HAST_PATH)
    .toString(FILE_ENCODING)
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
      download(SETUP_EXE_DOWNLOAD_LINK, SETUP_PATH).on(
        'downloadProgress',
        (progress) => {
          // Report download progress
          throttled(progress)
          win.setProgressBar(progress.percent)
          if (progress.percent === 1) {
            // fs.writeFileSync(DOWNLOADED_COMMITHASH_PATH, remoteCommitHash, {encoding: FILE_ENCODING})
            win.webContents.send('checkStartSetup')
          }
        }
      )
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

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    log.info('in all closed')
    FishingDataReader.stop(() => {
      log.info('call quit')
      // if (toInstallUpdates) {
      //   log.info('try install')
      //   exec('./setup/PastryFishSetup.exe')
      // } else {
      app.quit()
      // }
    })
  }
})

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
