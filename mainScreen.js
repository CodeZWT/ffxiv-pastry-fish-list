const {
  app,
  BrowserWindow,
  ipcMain,
  shell,
  dialog,
  globalShortcut,
} = require('electron')
const { exec } = require('child_process')
const isDev = require('electron-is-dev')
const log = require('electron-log')
const fs = require('fs')
const path = require('path')
const ObjectsToCsv = require('objects-to-csv')
const iconv = require('iconv-lite')
const datauri = require('datauri')
const unhandled = require('electron-unhandled')
const contextMenu = require('electron-context-menu')
const { callWindowSafe, showAndFocus, callTargetSafe } = require("./server/mainSetup/utils");
const { setupDevEnv } = require("./server/mainSetup/setupDevEnv");
const { ScreenSetting } = require("./server/mainSetup/ScreenSetting");
const { ScreenTray } = require("./server/mainSetup/ScreenTray");
const { MessageSender } = require("./server/mainSetup/MessageSender");
const { ScreenReader } = require("./server/mainSetup/ScreenReader");
const { Updater } = require("./server/mainSetup/Updater");

log.transports.console.level = 'silly'

const WINDOWS = {}
let tray
let intervalHandle
let uploadIntervalHandle
let loadingFinished = false
let setting
let sender
let dataReader
let updater

unhandled({
  logger: log.error,
  reportButton: error => {
    shell.showItemInFolder(path.join(app.getPath('userData'), 'logs/main.log'))
  },
})
contextMenu()

let mainWindowConfig = {}

const handleUserDataUpdates = (updateData) => {
  // set hotkey
  setting.saveHotkeySetting(SCREEN, 'mouseThrough', updateData.data.hotkey.mouseThrough || 'L')

  const options = {
    region: updateData.data.region,
    monitorType: updateData.data.monitorType,
  }
  // restart machina
  dataReader.restart(options, () => {
    log.info('Machina restarted!', options)
  })
}

function setupEvent() {
  ipcMain
    .on('maximize', (event, options) => {
      callWindowSafe(SCREEN, win => win.maximize())
    })
    .on('unmaximize', (event, options) => {
      callWindowSafe(SCREEN, win => win.unmaximize())
    })
    .on('minimize', (event, options) => {
      callWindowSafe(SCREEN, win => win.minimize())
    })
    .on('close', (event, options) => {
      callWindowSafe(SCREEN, win => win.close())
    })
    .on('startUpdate', () => {
      quitAndSetup()
    })
    .on('updateUserData', (event, updateData) => {
      handleUserDataUpdates(updateData)
    })
    .on('installNpcap', () => {
      callWindowSafe(SCREEN, win => {
        setOnTop(win, false)
      })
      if (isDev) {
        exec(`"${path.join(__dirname, './npcap/npcap-1.31.exe')}"`, postInstallCallback)
      } else {
        const installPath = path.join(
          app.getAppPath(),
          '../../resources/MachinaWrapper/',
          'npcap-1.31.exe'
        )
        log.info('Try install at', installPath)
        exec(`"${installPath}"`, postInstallCallback)
      }
    })
    .on('skipUpdate', () => {
      updater.skip()
    })
    .on('updateMainConfig', (event, config) => {
      mainWindowConfig = config
    })
    .on('finishLoading', (event, { userData, readerSetting }) => {
      if (loadingFinished) return
      log.info('in finishLoading')
      updater.showUpdateDialogIfNecessary()
      loadingFinished = true
      mainWindowConfig = userData.mainWindow

      dataReader.startReaderOnce({
        region: readerSetting.region,
        monitorType: readerSetting.monitorType,
      })
    })
    .on('exportHistory', (event, data) => {
      dialog
        .showSaveDialog({
          title: '导出',
          defaultPath: '鱼糕钓鱼记录.csv',
          buttonLabel: '保存',
          filters: [{ name: 'CSV', extensions: ['csv'] }],
        })
        .then(result => {
          if (!result.canceled) {
            const csv = new ObjectsToCsv(data)
            // return csv.toDisk(result.filePath, { bom: true })
            return csv.toString().then(str => {
              fs.writeFileSync(result.filePath, iconv.encode(str, 'gb2312'))
            })
          }
          log.info(result)
        })
        .catch(err => {
          if (err.code === 'EBUSY') {
            callWindowSafe(WINDOWS.readerHistory, win =>
              win.webContents.send('exportHistoryFailedWithBusyFile')
            )
          }
          log.info(err)
        })
        .finally(() => {
          callWindowSafe(WINDOWS.readerHistory, win =>
            win.webContents.send('exportHistoryFinished')
          )
        })
    })
    .on('reloadRecords', () => {
      sender.send('reloadRecords')
    })
    .on('getFishingData', () => {
      if (dataReader.fishingData) {
        sender.send('fishingData', dataReader.fishingData)
      }
    })
    .on('downloadUpdate', event => {
      updater.downloadUpdates(intervalHandle)
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
              'mp3', 'mpeg', 'opus', 'ogg', 'oga', 'wav', 'aac', 'caf', 'm4a', 'm4b', 'mp4', 'weba', 'webm', 'dolby', 'flac',
            ],
          },
        ],
      })
      .then(result => {
        if (result.canceled) {
          return { canceled: true }
        } else {
          return datauri(result.filePaths[0]).then(content => {
            return {
              canceled: result.canceled,
              filePath: result.filePaths[0],
              base64: content,
            }
          })
        }
      })
  })
}

function setOnTop(win, alwaysOnTop = true) {
  win.setAlwaysOnTop(alwaysOnTop, 'screen-saver')
  win.setMinimizable(!alwaysOnTop)
}

function quitAndSetup() {
  try {
    clearInterval(intervalHandle)
    clearInterval(uploadIntervalHandle)
    dataReader.stop(() => {
      const installerPath = isDev
        ? path.join(__dirname, 'setup/PastryFishSetup.exe')
        : path.join(__dirname, '../../setup/PastryFishSetup.exe')
      log.info('try open path', installerPath)
      shell.showItemInFolder(installerPath)
      log.info('quit before update')
      callTargetSafe(tray, it => it.destroy())
      app.quit()
    })
  } catch (e) {
    console.error('Error in quitAndSetup', e)
  }
}

function quit() {
  try {
    clearInterval(intervalHandle)
    clearInterval(uploadIntervalHandle)
    dataReader.stop(() => {
      log.info('quit by close')
      callTargetSafe(tray, it => it.destroy())
      app.quit()
    })
  } catch (e) {
    console.error('Error in quit', e)
  }
}

function postInstallCallback(error) {
  // after install npcap
  const options = { region, monitorType }
  dataReader.restart(options, () => {
    log.info('Machina restarted!', options)
  })
  callWindowSafe(WINDOWS.readerSetting, win =>
    win.webContents.send('installNpcapFishined')
  )
  callWindowSafe(SCREEN, win => {
    setOnTop(SCREEN, true)
  })
}

// Main Process
let SCREEN

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    log.info('in all closed')
    if (mainWindowConfig.closeMode === 'CLOSE') {
      quit()
    }
  }
})

const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
  log.info('Try open 2nd instance just quit')
  app.quit()
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
    log.info('Focus main window when try to open 2nd instance')
    showAndFocus(SCREEN)
  })

  app
    .whenReady()
    .then(() => init())
    .catch(error => {
      log.error('error in init', error)
    })
}

async function init() {
  setupDevEnv()
  setting = new ScreenSetting()
  dataReader = new ScreenReader()
  setupEvent()
  createScreen().then(win => {
    tray = new ScreenTray(win, quit)
    sender = new MessageSender(win)
    dataReader.setSender(sender)
    updater = new Updater(win, sender)
    if (isDev) {
      win.webContents.openDevTools({
        mode: 'undocked',
      })
    }

    globalShortcut.register('Alt+CommandOrControl+[', () => {
      callWindowSafe(win, win =>
        win.webContents.openDevTools({
          mode: 'undocked',
        })
      )
    })
  })
}

const createScreen = () => {
  const hash = undefined,
    page = 'screen'
  SCREEN = new BrowserWindow({
    frame: false,
    show: false,
    transparent: true,
    resizable: true,
    maximizable: false,
    skipTaskbar: false,
    // fullscreen: true,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
      preload: __dirname + '/preload.js',
      nativeWindowOpen: true
    },
    icon: path.join(__dirname, 'assets/icon256.png'),
  })
  SCREEN.removeMenu()
  setOnTop(SCREEN)
  SCREEN.once('ready-to-show', () => {
    SCREEN.show()
  })
  let loadedPromise
  if (isDev) {
    loadedPromise = SCREEN.loadURL(
      `http://localhost:8080/${page}${hash ? '/#/' + hash : ''}`
    )
  } else {
    loadedPromise = SCREEN.loadFile(
      path.join(__dirname, `/front-electron-dist/${page}.html`),
      {
        hash: hash && '/' + hash,
      }
    )
  }
  SCREEN.on('closed', () => {
    SCREEN = null
  })
  return loadedPromise.then(() => SCREEN)
}
