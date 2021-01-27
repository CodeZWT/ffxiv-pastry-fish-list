const { app, BrowserWindow } = require('electron')
const isDev = require('electron-is-dev')
const FishingDataReader = require('./server/reader')
const log = require('electron-log')
const download = require('download')
const fs = require('fs')
const path = require('path')
const throttle = require('lodash/throttle')

const COMMIT_HASH_DOWNLOAD_LINK =
  'https://ricecake302-generic.pkg.coding.net/pastry-fish/desktop-app/COMMITHASH?version=latest'
const SETUP_EXE_DOWNLOAD_LINK =
  'https://ricecake302-generic.pkg.coding.net/pastry-fish/desktop-app/PastryFishSetup.exe?version=latest'
log.transports.console.level = 'silly'

let win
const winURL = isDev
  ? `http://localhost:8080`
  : `file://${__dirname}/front-electron-dist/index.html`
console.log(winURL)

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

    let LOCAL_COMMIT_HAST_PATH
    if (isDev) {
      LOCAL_COMMIT_HAST_PATH = __dirname + '/front-electron-dist/COMMITHASH'
    } else {
      LOCAL_COMMIT_HAST_PATH = path.join(app.getAppPath(), '../../resources/COMMITHASH')
    }
    const localCommitHash =fs.readFileSync(LOCAL_COMMIT_HAST_PATH).toString('utf8')
    log.info('Local commit hash', localCommitHash)

    streamToString(download(COMMIT_HASH_DOWNLOAD_LINK)).then((remoteCommitHash) => {
      log.info('Remote commit hash:', remoteCommitHash)
      if (localCommitHash === remoteCommitHash) {
        log.info('New Version Detected!')
        download(SETUP_EXE_DOWNLOAD_LINK, 'setup')
          .on('downloadProgress', progress => {
            // Report download progress
            const throttled = throttle(() => win.webContents.send('setupDownload', progress), 500)
            if (progress.percent < 1) {
              throttled()
            } else {
              win.webContents.send('setupDownload', progress)
            }
          })
      }
    })
  })
  // if (isDev) {
  win.webContents.openDevTools({
    mode: 'undocked',
  })
  // }
}

function streamToString(stream) {
  const chunks = []
  return new Promise((resolve, reject) => {
    stream.on('data', (chunk) => chunks.push(chunk))
    stream.on('error', reject)
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
  })
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    FishingDataReader.stop()
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
