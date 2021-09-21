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
const { callWindowSafe, showAndFocus, callTargetSafe, setOnTop } = require("./server/mainSetup/utils");
const { setupDevEnv } = require("./server/mainSetup/setupDevEnv");
const { ScreenSetting } = require("./server/mainSetup/ScreenSetting");
const { ScreenTray } = require("./server/mainSetup/ScreenTray");
const { MessageSender } = require("./server/mainSetup/MessageSender");
const { ScreenReader } = require("./server/mainSetup/ScreenReader");
const { Updater } = require("./server/mainSetup/Updater");

log.transports.console.level = 'silly'

let tray, setting, sender, dataReader, updater
let loadingFinished = false
let mainWindowConfig = {}
let SCREEN

unhandled({
  logger: log.error,
  reportButton: error => {
    shell.showItemInFolder(path.join(app.getPath('userData'), 'logs/main.log'))
  },
})
contextMenu()

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

const handleInstallNPCAP = () => {
  const postInstallCallback = () => {
    // after install npcap
    dataReader.restart({}, () => {
      log.info('Machina restarted with same config!')
    })
    sender.send('installNpcapFishined')
    callWindowSafe(SCREEN, win => {
      setOnTop(win, true)
    })
  };

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
};

const handleExportHistory = () => {
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
        return csv.toString().then(str => {
          fs.writeFileSync(result.filePath, iconv.encode(str, 'gb2312'))
        })
      }
      log.info(result)
    })
    .catch(err => {
      if (err.code === 'EBUSY') {
        sender.send('exportHistoryFailedWithBusyFile')
      }
      log.info(err)
    })
    .finally(() => {
      sender.send('exportHistoryFinished')
    })
}

const showOpenDialog = () => {
  dialog
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
};

const handleFinishLoadingFront = (userData, readerSetting) => {
  if (!loadingFinished) {
    loadingFinished = true
    log.info('in finishLoading')
    updater.showUpdateDialogIfNecessary()
    mainWindowConfig = userData.mainWindow

    dataReader.startReaderOnce({
      region: readerSetting.region,
      monitorType: readerSetting.monitorType,
    })
  }
}

const quitAndSetup = () => {
  try {
    updater.stop()
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
};

const quit = () => {
  try {
    updater.stop()
    dataReader.stop(() => {
      log.info('quit by close')
      callTargetSafe(tray, it => it.destroy())
      app.quit()
    })
  } catch (e) {
    console.error('Error in quit', e)
  }
};

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    log.info('in all closed')
    if (mainWindowConfig.closeMode === 'CLOSE') {
      quit()
    }
  }
})

const setupEvent = () => {
  ipcMain
    .on('maximize', () => {
      callWindowSafe(SCREEN, win => win.maximize())
    })
    .on('unmaximize', () => {
      callWindowSafe(SCREEN, win => win.unmaximize())
    })
    .on('minimize', () => {
      callWindowSafe(SCREEN, win => win.minimize())
    })
    .on('close', () => {
      callWindowSafe(SCREEN, win => win.close())
    })
    .on('startUpdate', () => {
      quitAndSetup()
    })
    .on('updateUserData', (event, updateData) => {
      handleUserDataUpdates(updateData)
    })
    .on('installNpcap', () => {
      handleInstallNPCAP()
    })
    .on('skipUpdate', () => {
      updater.skip()
    })
    .on('updateMainConfig', (event, config) => {
      mainWindowConfig = config
    })
    .on('finishLoading', (event, { userData, readerSetting }) => {
      handleFinishLoadingFront(userData, readerSetting)
    })
    .on('exportHistory', (event, data) => {
      handleExportHistory()
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
      updater.downloadUpdates()
    })

  ipcMain.handle('showOpenSoundFileDialog', () => {
    return showOpenDialog()
  })
};

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
        hash: hash && ('/' + hash),
      }
    )
  }
  SCREEN.on('closed', () => {
    SCREEN = null
  })
  return loadedPromise.then(() => SCREEN)
}

const init = async () => {
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
};

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
