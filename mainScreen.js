const {
  app,
  BrowserWindow,
  ipcMain,
  shell,
  dialog,
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
const { callWindowSafe, showAndFocus, callTargetSafe, setOnTop, setMouseThrough } = require("./server/mainSetup/utils");
const { setupDevEnv } = require("./server/mainSetup/setupDevEnv");
const { ScreenSetting } = require("./server/mainSetup/ScreenSetting");
const { ScreenTray } = require("./server/mainSetup/ScreenTray");
const { MessageSender } = require("./server/mainSetup/MessageSender");
const { ScreenReader } = require("./server/mainSetup/ScreenReader");
const { Updater } = require("./server/mainSetup/Updater");
const { HotkeySetting } = require('./server/mainSetup/HotkeySetting')

log.transports.console.level = 'silly'

let tray, setting, sender, dataReader, updater, hotkeySetting
let mainWindowConfig = {}
let SCREEN
let remoteOpcodeVersion = 'latest'

const STATUS = {
  globalClickThrough: false,
  loadingFinished: false,
}

const opcodeUrlOf = (version) => `https://cdn.jsdelivr.net/gh/RicecakeFC/FFXIVOpcodes@${version}/opcodes.min.json`

unhandled({
  logger: log.error,
  reportButton: error => {
    shell.showItemInFolder(path.join(app.getPath('userData'), 'logs/main.log'))
  },
})
contextMenu()

const handleUserDataUpdates = (updateData) => {
  log.debug('handle update user data', updateData)

  const options = {
    region: updateData.data.region,
    monitorType: updateData.data.monitorType,
    opcodeUrl: opcodeUrlOf(remoteOpcodeVersion),
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

const getSoundFilePath = () => {
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
};

const setWindowShape = (win, windowSetting) => {
  if (windowSetting.dialogs.length > 0) {
    win.setShape([])
  } else {
    const windowRectangles = windowSetting.windows.map(w => {
      const l = windowSetting.layouts[w]
      return {
        x: l.x,
        y: l.y,
        width: l.w,
        height: l.h
      }
    })

    const [winWidth, winHeight] = SCREEN.getSize()
    if (windowSetting.alerts.length > 0) {
      const width = 344
      const height = 48
      windowRectangles.push({
        x: Math.floor(winWidth/2-width/2),
        y: Math.floor(winHeight/2-height/2),
        width: width,
        height: height
      })
    }

    if (windowSetting.bottomNotifications.length > 0) {
      const width = 390
      const height = 80
      windowRectangles.push({
        x: Math.floor(winWidth/2-width/2),
        y: Math.floor(winHeight-height),
        width: width,
        height: height
      })
    }

    win.setShape(windowRectangles)
  }
}

const handleFinishLoadingFront = (userData, readerSetting, windowSetting, keybindings, opcodeVersion) => {
  if (!STATUS.loadingFinished) {
    STATUS.loadingFinished = true
    log.info('in finishLoading')
    updater.showUpdateDialogIfNecessary()
    mainWindowConfig = userData.mainWindow
    remoteOpcodeVersion = opcodeVersion

    setWindowShape(SCREEN, windowSetting)

    hotkeySetting = new HotkeySetting(keybindings, {
      toggleReaderTimer: () => {
        sender.send('toggleReaderTimer')
      },
      toggleReaderTimerMini: () => {
        sender.send('toggleReaderTimerMini')
      },
      toggleReaderHistory: () => {
        sender.send('toggleReaderHistory')
      },
      toggleReaderSpotStatistics: () => {
        sender.send('toggleReaderSpotStatistics')
      },
      toggleGlobalClickThrough: () => {
        STATUS.globalClickThrough = !STATUS.globalClickThrough
        sender.send('setGlobalClickThrough', STATUS.globalClickThrough)
        setMouseThrough(SCREEN, STATUS.globalClickThrough)
      }
    })

    const { screen } = require('electron')
    const primaryDisplay = screen.getPrimaryDisplay()
    const {width, height} = primaryDisplay.workAreaSize
    sender.send('showMenuWindow', {width, height})

    dataReader.startReaderOnce({
      region: readerSetting.region,
      monitorType: readerSetting.monitorType,
      opcodeUrl: opcodeUrlOf(remoteOpcodeVersion),
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
    .on('finishLoading', (event, { userData, readerSetting, windowSetting, keybindings, opcodeVersion }) => {
      handleFinishLoadingFront(userData, readerSetting, windowSetting, keybindings, opcodeVersion)
    })
    .on('updateWindowSetting', (event, windowSetting) => {
      setWindowShape(SCREEN, windowSetting)
    })
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
    .on('setClickThrough', (event, isMouseThrough)=> {
      // setMouseThrough(SCREEN, isMouseThrough)
    })
    .on('updateKeybindings', (event, keybindings)=> {
      hotkeySetting.bindHotkey(keybindings)
    })

  ipcMain.handle('showOpenSoundFileDialog', () => {
    return getSoundFilePath()
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
      nativeWindowOpen: true,
    },
    icon: path.join(__dirname, 'assets/icon256.png'),
  })
  SCREEN.removeMenu()
  setOnTop(SCREEN)
  SCREEN.once('ready-to-show', () => {
    SCREEN.show()
    SCREEN.maximize()
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
      // globalShortcut.register('Alt+CommandOrControl+[', () => {
      //   callWindowSafe(win, win =>
      //     win.webContents.openDevTools({
      //       mode: 'undocked',
      //     })
      //   )
      // })
    }
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
