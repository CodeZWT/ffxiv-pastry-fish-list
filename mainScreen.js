const { app, BrowserWindow, ipcMain, shell, dialog, globalShortcut } = require('electron')
const { exec } = require('child_process')
const isDev = require('electron-is-dev')
const log = require('electron-log')
const fs = require('fs')
const path = require('path')
const ObjectsToCsv = require('objects-to-csv')
const iconv = require('iconv-lite')
const datauri = require('datauri')
// const unhandled = require('electron-unhandled')
const contextMenu = require('electron-context-menu')
const { callWindowSafe, showAndFocus, callTargetSafe, setOnTop, setMouseThrough, callWindowsSafe } = require("./server/mainSetup/utils");
const { setupDevEnv } = require('./server/mainSetup/setupDevEnv')
const { ScreenSetting, CONFIG_MAIN_WINDOW } = require('./server/mainSetup/ScreenSetting')
const { ScreenTray } = require('./server/mainSetup/ScreenTray')
const { MessageSender } = require('./server/mainSetup/MessageSender')
const { ScreenReader, opcodeUrlOf } = require('./server/mainSetup/ScreenReader')
const { Updater } = require('./server/mainSetup/Updater')
const { HotkeySetting } = require('./server/mainSetup/HotkeySetting')
const { DisplayConfig } = require('./server/mainSetup/DisplayConfig')
const process = require('process')
const { Unhandled } = require('./server/mainSetup/unhandled')

log.transports.console.level = 'silly'

let tray, setting, sender, dataReader, updater, hotkeySetting, displayConfig, unhandled
let mainWindowConfig = {}
let WINDOW_SCREEN, WINDOW_LOADING, WINDOW_MAIN
let remoteOpcodeVersion = 'latest'
let screen
let maximizeTimeout

const STATUS = {
  globalClickThrough: false,
  loadingFinished: false,
  exportFilePath: undefined,
}

// unhandled({
//   logger: log.error,
//   reportButton: error => {
//     shell.showItemInFolder(path.join(app.getPath('userData'), 'logs/main.log'))
//   },
// })

// process.on('uncaughtException', function() {
//   log.error('uncaught exception')
//   // log.error('Front-end error:', error)
//   dialog.showMessageBoxSync({
//     type: 'error',
//     message: 'Unexpected error occurred. Restarting the application.',
//     title: 'Error',
//   })
//   app.relaunch()
//   app.quit()
// })

contextMenu()

// const handleReaderSettingUpdate = readerSetting => {
//   log.debug('current status:', STATUS.readerRegion, STATUS.readerMonitorType)
//   log.debug('handle update readerSetting', readerSetting.region, readerSetting.monitorType)
//
//   if (
//     STATUS.readerRegion === readerSetting.region &&
//     STATUS.readerMonitorType === readerSetting.monitorType
//   ) {
//     log.debug("skip restart machina")
//     return
//   } else {
//     STATUS.readerRegion = readerSetting.region
//     STATUS.readerMonitorType = readerSetting.monitorType
//   }
//   const options = {
//     region: readerSetting.region,
//     monitorType: readerSetting.monitorType,
//     opcodeUrl: opcodeUrlOf(remoteOpcodeVersion),
//   }
//   log.debug("try restart machina")
//   // restart machina
//   dataReader.restart(options, () => {
//     log.info('Machina restarted!', options)
//   })
// }

const handleInstallNPCAP = () => {
  const postInstallCallback = () => {
    // after install npcap
    dataReader.restart({}, () => {
      log.info('Machina restarted with same config!')
    }, true)
    sender.send('installNpcapFishined')
    callWindowSafe(WINDOW_SCREEN, win => {
      setOnTop(win, true)
    })
  };

  callWindowSafe(WINDOW_SCREEN, win => {
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

const handleShowExportFileDialog = () => {
  return dialog
    .showSaveDialog({
      title: '导出',
      defaultPath: '鱼糕钓鱼记录.csv',
      buttonLabel: '保存',
      filters: [{ name: 'CSV', extensions: ['csv'] }],
    })
    .then(result => {
      if (!result.canceled) {
        STATUS.exportFilePath = result.filePath
        log.info(STATUS.exportFilePath)
      }
      return !result.canceled
    })
}

const handleExportHistory = data => {
  const csv = new ObjectsToCsv(data)
  csv
    .toString()
    .then(str => {
      fs.writeFileSync(STATUS.exportFilePath, iconv.encode(str, 'gb2312'))
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
        height: l.h,
      }
    })

    const [winWidth, winHeight] = WINDOW_SCREEN.getSize()
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
      const width = 450
      const height = 100
      windowRectangles.push({
        x: Math.floor(winWidth/2-width/2),
        y: Math.floor(winHeight-height),
        width: width,
        height: height
      })
    }

    windowSetting.menus.forEach(menu => {
      windowRectangles.push({
        x: menu.x,
        y: menu.y,
        width: menu.w,
        height: menu.h,
      })
    })

    // TODO check
    // to fix browser not rendered if there is only menu button...
    windowRectangles.push({
      x: -1,
      y: -1,
      width: 1,
      height: 1,
    })
    // console.log('set shape', windowRectangles)
    win.setShape(windowRectangles.map(rec => {
      return {
        x: Math.floor(rec.x),
        y: Math.floor(rec.y),
        width: Math.floor(rec.width),
        height: Math.floor(rec.height),
      }
    }))
  }
}

const handleFinishLoadingFront = (userData, readerSetting, windowSetting, keybindings, opcodeVersion) => {
  if (!STATUS.loadingFinished) {
    STATUS.loadingFinished = true
    log.info('in finishLoading')

    updater.showUpdateDialogIfNecessary()
    mainWindowConfig = userData.mainWindow
    remoteOpcodeVersion = opcodeVersion

    setWindowShape(WINDOW_SCREEN, windowSetting)

    hotkeySetting = new HotkeySetting(keybindings, {
      toggleMenu: () => {
        sender.send('toggleMenu')
      },
      toggleMain: () => {
        sender.send('toggleMain')
      },
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
        setMouseThrough(WINDOW_SCREEN, STATUS.globalClickThrough)
      },
      showSearch: () => {
        sender.send('showSearch')
      },
      showRoseDialog: () => {
        sender.send('showRoseDialog')
      },
    })

    STATUS.readerRegion = readerSetting.region
    STATUS.readerMonitorType = readerSetting.monitorType
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
    updater && updater.stop()
    dataReader && dataReader.stop(() => {
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
    .on(
      'finishLoading',
      (event, { userData, readerSetting, windowSetting, keybindings, opcodeVersion }) => {
        if (WINDOW_SCREEN !== null && WINDOW_MAIN !== null) {
          callWindowSafe(WINDOW_LOADING, win => {
            // log.info('try close loading window')
            win.close()
          })
          callWindowSafe(WINDOW_MAIN, win => {
            win.show()
          })
          callWindowSafe(WINDOW_SCREEN, win => {
            WINDOW_SCREEN.setPosition(displayConfig.x, displayConfig.y)
            WINDOW_SCREEN.show()
            WINDOW_SCREEN.maximize()
          })
        }

        handleFinishLoadingFront(
          userData,
          readerSetting,
          windowSetting,
          keybindings,
          opcodeVersion
        )
      }
    )
    .on('updateWindowSetting', (event, windowSetting) => {
      callWindowSafe(WINDOW_SCREEN, win => {
        setWindowShape(win, windowSetting)
      })
      callWindowSafe(WINDOW_MAIN, win => {
        win.setOpacity(windowSetting.layouts['MAIN'].opacity)
      })
    })
    .on('maximize', () => {
      callWindowSafe(WINDOW_MAIN, win => win.maximize())
    })
    .on('unmaximize', () => {
      callWindowSafe(WINDOW_MAIN, win => win.unmaximize())
    })
    .on('minimize', () => {
      callWindowSafe(WINDOW_MAIN, win => win.minimize())
    })
    .on('hide', () => {
      callWindowSafe(WINDOW_MAIN, win => win.hide())
    })
    .on('close', () => {
      callWindowSafe(WINDOW_MAIN, win => win.close())
    })
    .on('quit', () => {
      callWindowSafe(WINDOW_MAIN, win => win.close())
      callWindowSafe(WINDOW_SCREEN, win => win.close())
    })
    .on('alwaysOnTop', (event, alwaysOnTop) => {
      callWindowSafe(WINDOW_MAIN, win => {
        setOnTop(win, alwaysOnTop)
      })
    })
    .on('startUpdate', () => {
      quitAndSetup()
    })
    // .on('updateUserData', (event, updateData) => {
    //   handleReaderSettingUpdate(updateData)
    // })
    .on('installNpcap', () => {
      handleInstallNPCAP()
    })
    .on('skipUpdate', () => {
      updater.skip()
    })
    .on('updateMainConfig', (event, config) => {
      mainWindowConfig = config
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
    .on('setClickThrough', (event, isMouseThrough) => {
      // setMouseThrough(WINDOW_SCREEN, isMouseThrough)
    })
    .on('updateKeybindings', (event, keybindings) => {
      hotkeySetting.bindHotkey(keybindings)
    })
    .on('setFocused', (event, focused) => {
      WINDOW_SCREEN.setFocusable(focused)
      if (focused) {
        WINDOW_SCREEN.focus()
      } else {
        WINDOW_SCREEN.blur()
      }
    })

  ipcMain.handle('showOpenSoundFileDialog', () => {
    return getSoundFilePath()
  })

  ipcMain.handle('getAllDisplays', () => {
    WINDOW_SCREEN.maximize()
    return displayConfig.getDisplayInfo()
  })
  ipcMain.on('setDisplay', (event, displayId) => {
    displayConfig.setTargetDisplay(displayId)
    WINDOW_SCREEN.setPosition(displayConfig.x, displayConfig.y)
    WINDOW_SCREEN.maximize()
  })
  screen.on('display-metrics-changed', () => {
    maximizeTimeout && clearTimeout(maximizeTimeout)
    maximizeTimeout = setTimeout(() => {
      WINDOW_SCREEN.maximize()
    }, 1000)
  })

  ipcMain.handle('showExportFileDialog', async () => {
    return await handleShowExportFileDialog()
  })
  ipcMain.on('exportHistory', (event, data) => {
    handleExportHistory(data)
  })

  ipcMain.on('broadcast', (event, data) => {
    if (data.source === 'main') {
      sender.send('broadcast', data)
    } else {
      sender.sendMain('broadcast', data)
    }
    if (data.type === 'reloadSetting') {
      const {
        data: { readerSetting },
      } = data
      const options = {
        region: readerSetting.region,
        monitorType: readerSetting.monitorType,
      }
      dataReader.restart(options, () => {
        log.info('Machina restarted!', options)
      })
    }
  })

  ipcMain.on('relaunch', () => {
    app.relaunch()
    quit()
  })

  ipcMain.on('showMainWindow', () => {
    return showMainWindow()
  })

  ipcMain.on('showSpotPage', (event, spotId) => {
    return showMainWindow().then(win => win.webContents.send('showSpotPage', spotId))
  })
}

const createMainWindow = (mainWindowConfig, show = false) => {
  const hash = null,
    page = 'index'
  WINDOW_MAIN = new BrowserWindow({
    x: mainWindowConfig.x,
    y: mainWindowConfig.y,
    width: mainWindowConfig.w,
    height: mainWindowConfig.h,
    frame: false,
    show: false,
    transparent: false,
    resizable: true,
    maximizable: true,
    skipTaskbar: false,
    focusable: true,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
      preload: __dirname + '/preload.js',
      nativeWindowOpen: true,
    },
    icon: path.join(__dirname, 'assets/icon256.png'),
  })
  WINDOW_MAIN.removeMenu()
  WINDOW_MAIN.once('ready-to-show', () => {
    if (show) {
      WINDOW_MAIN.show()
    }
  })
  WINDOW_MAIN.webContents.setWindowOpenHandler(details => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })
  const updateWindowPosSize = () => {
    const [x, y] = WINDOW_MAIN.getPosition()
    const [w, h] = WINDOW_MAIN.getSize()
    setting.updateSetting(CONFIG_MAIN_WINDOW, { x, y, w, h })
  }
  WINDOW_MAIN.on('moved', () => {
    updateWindowPosSize()
  }).on('resized', () => {
    updateWindowPosSize()
  })
  let loadedPromise
  if (isDev) {
    loadedPromise = WINDOW_MAIN.loadURL(
      `http://localhost:8080/${page}${hash ? '/#/' + hash : ''}`
    )
  } else {
    loadedPromise = WINDOW_MAIN.loadFile(
      path.join(__dirname, `/front-electron-dist/${page}.html`),
      {
        hash: hash && '/' + hash,
      }
    )
  }
  WINDOW_MAIN.on('closed', () => {
    WINDOW_MAIN = null
  })
  return loadedPromise.then(() => WINDOW_MAIN)
}

const showMainWindow = async () => {
  if (WINDOW_MAIN && !WINDOW_MAIN.isDestroyed()) {
    showAndFocus(WINDOW_MAIN)
    return WINDOW_MAIN
  } else {
    return createMainWindow(setting.getSetting(CONFIG_MAIN_WINDOW), true)
  }
}

const createScreen = () => {
  const hash = undefined,
    page = 'screen'
  WINDOW_SCREEN = new BrowserWindow({
    frame: false,
    show: false,
    transparent: true,
    resizable: false,
    maximizable: false,
    skipTaskbar: true,
    focusable: false,
    // fullscreen: true,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
      preload: __dirname + '/preload.js',
      nativeWindowOpen: true,
    },
    icon: path.join(__dirname, 'assets/icon256.png'),
  })
  WINDOW_SCREEN.removeMenu()
  setOnTop(WINDOW_SCREEN)
  WINDOW_SCREEN.once('ready-to-show', () => {
    // WINDOW_SCREEN.setPosition(displayConfig.x, displayConfig.y)
    // WINDOW_SCREEN.show()
    // WINDOW_SCREEN.maximize()
  })
  let loadedPromise
  if (isDev) {
    loadedPromise = WINDOW_SCREEN.loadURL(
      `http://localhost:8080/${page}${hash ? '/#/' + hash : ''}`
    )
  } else {
    loadedPromise = WINDOW_SCREEN.loadFile(
      path.join(__dirname, `/front-electron-dist/${page}.html`),
      {
        hash: hash && '/' + hash,
      }
    )
  }
  WINDOW_SCREEN.on('closed', () => {
    WINDOW_SCREEN = null
  })
  return loadedPromise.then(() => WINDOW_SCREEN)
}

const mainWindowInSomeDisplay = (screen, windowArea) => {
  return  screen.getAllDisplays().some(d => {
    const workArea = d.workArea
    return (
      windowArea.x >= workArea.x &&
      windowArea.x <= workArea.x + workArea.width &&
      windowArea.y >= workArea.y &&
      windowArea.y <= workArea.y + workArea.height
    )
  })
}

const init = async () => {
  setupDevEnv()
  screen = require('electron').screen
  setting = new ScreenSetting()

  const mainWindowConfig  = setting.getSetting(CONFIG_MAIN_WINDOW)
  if (!mainWindowInSomeDisplay(screen,mainWindowConfig )) {
    setting.updateSetting(CONFIG_MAIN_WINDOW, {
      x: 100,
      y: 100,
      w: mainWindowConfig.w,
      h: mainWindowConfig.h
    })
  }

  displayConfig = new DisplayConfig(screen, setting)
  dataReader = new ScreenReader()
  setupEvent()
  createMainWindow(setting.getSetting(CONFIG_MAIN_WINDOW), false).then(win => {
    win.webContents.setBackgroundThrottling(false)
  })
  createScreen().then(win => {
    win.webContents.setBackgroundThrottling(false)

    if (isDev) {
      win.webContents.openDevTools({
        mode: 'undocked',
      })
    }

    globalShortcut.register('Alt+CommandOrControl+[', () => {
      callWindowSafe(WINDOW_SCREEN, win =>
        win.webContents.openDevTools({
          mode: 'undocked',
        })
      )
    })
  })
  unhandled = new Unhandled([WINDOW_SCREEN, WINDOW_LOADING, WINDOW_MAIN])
  tray = new ScreenTray(WINDOW_SCREEN, quit, displayConfig)
  sender = new MessageSender(WINDOW_SCREEN, WINDOW_MAIN)
  dataReader.setSender(sender)
  updater = new Updater(WINDOW_SCREEN, sender)
};

const showLoadingWindow = () => {
  const page = 'loading'
  const hash = 'loading'
  WINDOW_LOADING = new BrowserWindow({
    width: 350,
    height: 400,
    frame: false,
    show: false,
    transparent: true,
    resizable: false,
    maximizable: false,
    skipTaskbar: true,
    icon: path.join(__dirname, 'assets/icon256.png'),
    webPreferences: {
      nativeWindowOpen: true,
    },
  })
  const win = WINDOW_LOADING
  win.removeMenu()
  setOnTop(win)
  win.once('ready-to-show', () => {
    win.show()
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
  win.on('closed', () => {
    WINDOW_LOADING = null
  })
  return loadedPromise.then(() => win)
}

const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
  log.info('Try open 2nd instance just quit')
  app.quit()
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
    log.info('Focus main window when try to open 2nd instance')
    showAndFocus(WINDOW_SCREEN)
  })

  app
    .whenReady()
    .then(() => {
      return showLoadingWindow()
    })
    .then(() => init())
    .catch(error => {
      log.error('error in init', error)
      app.quit()
    })
}
