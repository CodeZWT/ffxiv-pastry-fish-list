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
const { exec } = require('child_process')
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
const get = require('lodash/get')
const merge = require('lodash/merge')
const unhandled = require('electron-unhandled')
const contextMenu = require('electron-context-menu')
const cloneDeep = require('lodash/cloneDeep')

const COMMIT_HASH_DOWNLOAD_LINK =
  'https://ricecake302-generic.pkg.coding.net/pastry-fish/desktop-version/COMMITHASH?version=latest'
const SETUP_EXE_DOWNLOAD_LINK =
  'https://ricecake302-generic.pkg.coding.net/pastry-fish/desktop-app/PastryFishSetup.exe?version=latest'
log.transports.console.level = 'silly'

const WINDOWS = {}
let tray, configStore, windowSetting, hotkeySetting, region, monitorType
let intervalHandle
let uploadIntervalHandle
let enableMouseThrough = false
// let showReaderOnlyIfFishing = false
const FILE_ENCODING = 'utf8'
const SETUP_PATH = 'setup'
let skipUpdate = false
let updateDownloaded = false
let updateDownloading = false
// const DOWNLOADED_COMMITHASH_PATH = SETUP_PATH + '/DOWNLOADED_COMMITHASH'
// const closedWindows = {}
let loadingFinished = false

let settingVisible = false,
  historyVisible = false,
  spotStatisticsVisible = false
let hideBySwitch = false,
  hideByFishingTrigger = false
let isFishing = false
unhandled({
  logger: log.error,
  reportButton: error => {
    shell.showItemInFolder(path.join(app.getPath('userData'), 'logs/main.log'))
  },
})
contextMenu()
const DEFAULT_HOTKEY_SETTING = {
  mouseThrough: 'L',
  toggleReader: 'K',
}
const DEFAULT_WINDOW_SETTING = {
  main: {
    pos: { x: 100, y: 100 },
    size: { w: 1080, h: 768 },
    opacity: 0.95,
    zoomFactor: 1,
  },
  setting: {
    pos: { x: 100, y: 100 },
    size: { w: 500, h: 500 },
    opacity: 0.95,
    zoomFactor: 1,
  },
  timer: {
    pos: { x: 100, y: 100 },
    size: { w: 500, h: 250 },
    opacity: 0.95,
    zoomFactor: 1,
  },
  timerMini: {
    pos: { x: 100, y: 100 },
    size: { w: 500, h: 120 },
    opacity: 0.95,
    zoomFactor: 1,
    enabled: false,
  },
  history: {
    pos: { x: 100, y: 100 },
    size: { w: 500, h: 800 },
    opacity: 0.95,
    zoomFactor: 1,
  },
  spotStatistics: {
    pos: { x: 100, y: 100 },
    size: { w: 500, h: 500 },
    opacity: 0.95,
    zoomFactor: 1,
  },
}
function initSetting(configStore, key, defaultVal) {
  const setting = configStore.get(key)
  if (!setting) {
    configStore.set(key, defaultVal)
    log.info('Initialize user config in', app.getPath('userData'), 'of', key)
  } else {
    configStore.set(key, merge(cloneDeep(defaultVal), setting))
    log.debug(`Config [${key}] Read`, JSON.stringify(configStore.get(key)))
  }
}

function saveWindowSetting(path, value) {
  set(windowSetting, path, value)
  configStore.set('windowSetting', windowSetting)
}
function saveHotkeySetting(path, value) {
  const old = get(hotkeySetting, path)
  if (value !== old) {
    if (old) {
      globalShortcut.unregister('Alt+Shift+' + old)
    }
    set(hotkeySetting, path, value)
    configStore.set('hotkeySetting', hotkeySetting)
    globalShortcut.register('Alt+Shift+' + hotkeySetting.mouseThrough, () => {
      setMouseThrough(!enableMouseThrough)
    })
    globalShortcut.register('Alt+Shift+' + hotkeySetting.toggleReader, () => {
      toggleReader()
    })
  }
}

function callFirstAvailableWin(windows, callBack) {
  const firstNotNull = windows.find(it => it)
  if (firstNotNull) {
    callBack(firstNotNull)
  }
}

let readerConfig = {}
let mainWindowConfig = {}
let fishingData = undefined

const sendFishingData = data => {
  callWindowSafe(WINDOWS.main, win => {
    win.webContents.send('fishingData', data)
  })
  callWindowSafe(WINDOWS.readerTimer, win => win.webContents.send('fishingData', data))
  callWindowSafe(WINDOWS.timerMini, win => win.webContents.send('fishingData', data))
  callWindowSafe(WINDOWS.readerSpotStatistics, win => {
    win.webContents.send('fishingData', data)
  })
}

async function init() {
  if (isDev) {
    const {
      default: installExtension,
      VUEJS_DEVTOOLS,
    } = require('electron-devtools-installer')
    installExtension(VUEJS_DEVTOOLS)
      .then(name => log.info(`Added Extension:  ${name}`))
      .catch(err => log.info('An error occurred: ', err))
    ipcMain
      .on('nextTestEvent', () => {
        FishingDataReader.nextTestEvent()
      })
      .on('resetTest', () => {
        FishingDataReader.resetTest()
      })
  }

  configStore = new Store()
  initSetting(configStore, 'windowSetting', DEFAULT_WINDOW_SETTING)
  windowSetting = configStore.get('windowSetting')
  initSetting(configStore, 'hotkeySetting', DEFAULT_HOTKEY_SETTING)
  hotkeySetting = configStore.get('hotkeySetting')

  FishingDataReader.onUpdate(async data => {
    if (readerConfig.showReaderOnlyIfFishing) {
      if (data.status.isFishing !== isFishing) {
        isFishing = data.status.isFishing
        if (data.status.isFishing) {
          let timerTarget
          if (windowSetting.timerMini.enabled) {
            timerTarget = WINDOWS.timerMini
            if (!WINDOWS.timerMini) {
              await createTimerMiniWin()
              timerTarget = WINDOWS.timerMini
            }
          } else {
            timerTarget = WINDOWS.readerTimer
            if (!WINDOWS.readerTimer) {
              createReader()
              timerTarget = WINDOWS.readerTimer
            }
          }
          callWindowSafe(timerTarget, win => {
            win.showInactive()
          })
        } else {
          const timerTarget = windowSetting.timerMini.enabled
            ? WINDOWS.timerMini
            : WINDOWS.readerTimer
          callWindowSafe(timerTarget, win => {
            hideByFishingTrigger = true
            win.hide()
          })
        }
      }
    }
    fishingData = data
    sendFishingData(data)
  })

  FishingDataReader.onFishCaught(data => {
    // Be care of spear fish!
    const fishId = data.fishId
    const hq = data.hq
    if (
      readerConfig.autoSetCompleted &&
      fishId > 0 &&
      (!readerConfig.autoSetCompletedOnlyHQ || hq)
    ) {
      callFirstAvailableWin([WINDOWS.main, WINDOWS.readerTimer, WINDOWS.timerMini], win =>
        win.webContents.send('fishCaught', data)
      )
    }
  })
  FishingDataReader.onNewRecord(data => {
    callFirstAvailableWin([WINDOWS.readerTimer, WINDOWS.timerMini, WINDOWS.main], win =>
      win.webContents.send('newRecord', data)
    )
    callWindowSafe(WINDOWS.readerHistory, win => win.webContents.send('newRecord', data))
    callWindowSafe(WINDOWS.readerSpotStatistics, win =>
      win.webContents.send('newRecord', data)
    )
  })
  FishingDataReader.onPlayerSetup(data => {
    callWindowSafe(WINDOWS.main, win => {
      win.webContents.send('playerSetup', data)
    })
  })

  ipcMain
    .on('startReader', (event, options) => {
      region = options.region
      monitorType = options.monitorType
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
      // updateUserData(updateData)
      // showReaderOnlyIfFishing = updateData.data.showReaderOnlyIfFishing
      readerConfig = updateData.data

      // set hotkey
      saveHotkeySetting('mouseThrough', updateData.data.hotkey.mouseThrough || 'L')
      saveHotkeySetting('toggleReader', updateData.data.hotkey.toggleReader || 'K')

      // restart machina
      const newRegion = updateData.data.region || 'CN'
      const newMonitorType = updateData.data.monitorType || 'RawSocket'
      if (region !== newRegion || monitorType !== newMonitorType) {
        region = newRegion
        monitorType = newMonitorType

        if (newMonitorType === 'WinPCap') {
          exec('Get-Service -Name Npcap', { shell: 'powershell.exe' }, err => {
            if (err) {
              callWindowSafe(WINDOWS.readerSetting, win =>
                win.webContents.send('installNpcapPrompt')
              )
            } else {
              const options = { region: newRegion, monitorType: newMonitorType }
              FishingDataReader.restart(options, () => {
                log.info('Machina restarted!', options)
              })
            }
          })
        } else {
          const options = { region: newRegion, monitorType: newMonitorType }
          FishingDataReader.restart(options, () => {
            log.info('Machina restarted!', options)
          })
        }
      }

      callWindowSafe(WINDOWS.readerTimer, win => win.webContents.send('reloadUserData'))
      callWindowSafe(WINDOWS.timerMini, win => win.webContents.send('reloadUserData'))
      callWindowSafe(WINDOWS.main, win => win.webContents.send('reloadUserData'))
    })
    // .on('reloadUserData', () => {
    //   callWindowSafe(WINDOWS.readerTimer, win => win.webContents.send('reloadUserData'))
    //   callWindowSafe(WINDOWS.timerMini, win => win.webContents.send('reloadUserData'))
    //   callWindowSafe(WINDOWS.readerSetting, win => win.webContents.send('reloadUserData'))
    // })
    .on('installNpcap', () => {
      ;[
        WINDOWS.readerTimer,
        WINDOWS.timerMini,
        WINDOWS.readerSetting,
        WINDOWS.readerHistory,
        WINDOWS.readerSpotStatistics,
      ].forEach(it =>
        callWindowSafe(it, win => {
          setOnTop(win, false)
        })
      )
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
      skipUpdate = true
      callWindowSafe(WINDOWS.main, win => win.setProgressBar(0))
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
      callWindowSafe(WINDOWS.main, win => {
        win.setOpacity(setting.opacity)
        win.webContents.setZoomFactor(setting.zoomFactor)
      })
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
    .on('updateMainConfig', (event, config) => {
      mainWindowConfig = config
    })
    .on('finishLoading', (event, { userData, readerSetting }) => {
      // if (loadingForReloadingPage != null && !loadingForReloadingPage.isDestroyed()) {
      //   return loadingForReloadingPage.close()
      // }
      if (loadingFinished) return
      log.info('in finishLoading')
      showUpdateDialogIfNecessary()
      loadingFinished = true
      readerConfig = readerSetting
      mainWindowConfig = userData.mainWindow

      // set hotkey
      globalShortcut.register('Alt+Shift+' + hotkeySetting.mouseThrough, () => {
        setMouseThrough(!enableMouseThrough)
      })
      globalShortcut.register('Alt+Shift+' + hotkeySetting.toggleReader, () => {
        toggleReader()
      })

      startReaderOnce({
        region: readerConfig.region,
        monitorType: readerConfig.monitorType,
      })

      callWindowSafe(WINDOWS.main, win => {
        win.show()
      })
      callWindowSafe(WINDOWS.loading, win => {
        log.info('try close loading window')
        win.close()
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
    .on('showSpotPage', (event, spotId) => {
      if (!WINDOWS.main) {
        createMainWindow(win => {
          win.webContents.send('showSpotPage', spotId)
          if (win.isMinimized()) {
            win.restore()
          }
          win.focus()
        })
      } else {
        callWindowSafe(WINDOWS.main, win => {
          win.webContents.send('showSpotPage', spotId)
          if (win.isMinimized()) {
            win.restore()
          }
          win.focus()
        })
      }
    })
    .on('updateWindowSetting', (event, newSetting) => {
      const newWindowSetting = newSetting || windowSetting
      Object.entries({
        timer: 'readerTimer',
        timerMini: 'timerMini',
        history: 'readerHistory',
        spotStatistics: 'readerSpotStatistics',
      }).forEach(([settingName, windowName]) => {
        if (
          newWindowSetting[settingName] &&
          newWindowSetting[settingName].zoomFactor > 0.3
        ) {
          if (settingName !== 'timerMini') {
            saveWindowSetting(
              settingName + '.opacity',
              newWindowSetting[settingName].opacity
            )
            callWindowSafe(WINDOWS[windowName], win =>
              win.setOpacity(newWindowSetting[settingName].opacity)
            )
          }
          saveWindowSetting(
            settingName + '.zoomFactor',
            newWindowSetting[settingName].zoomFactor
          )
          callWindowSafe(WINDOWS[windowName], win =>
            win.webContents.setZoomFactor(newWindowSetting[settingName].zoomFactor)
          )
        }
      })
    })
    .on('listCntUpdated', (event, listCnt) => {
      callWindowSafe(WINDOWS.mini, win => win.send('listCntUpdated', listCnt))
    })
    .on('reloadRecords', () => {
      callWindowSafe(WINDOWS.readerSpotStatistics, win => win.send('reloadRecords'))
    })
    .on('getFishingData', () => {
      if (fishingData) {
        sendFishingData(fishingData)
      }
    })
    .on('setStrictMode', (event, isStrictMode) => {
      readerConfig.isStrictMode = isStrictMode
      callWindowSafe(WINDOWS.readerTimer, win => win.webContents.send('reloadUserData'))
      callWindowSafe(WINDOWS.timerMini, win => win.webContents.send('reloadUserData'))
      callWindowSafe(WINDOWS.main, win => win.webContents.send('reloadUserData'))
    })
    .on('postLogin', (event, isStrictMode) => {
      callWindowSafe(WINDOWS.readerTimer, win => win.webContents.send('reloadUserData'))
      callWindowSafe(WINDOWS.timerMini, win => win.webContents.send('reloadUserData'))
      callWindowSafe(WINDOWS.main, win => win.webContents.send('reloadUserData'))
    })
    .on('postLogout', (event, isStrictMode) => {
      callWindowSafe(WINDOWS.readerTimer, win => win.webContents.send('reloadUserData'))
      callWindowSafe(WINDOWS.timerMini, win => win.webContents.send('reloadUserData'))
      callWindowSafe(WINDOWS.main, win => win.webContents.send('reloadUserData'))
    })
    .on('downloadUpdate', event => {
      downloadUpdates(intervalHandle)
    })

  const upload = async (accessToken, records) => {
    return rcapiService.uploadRecords(accessToken, records)
  }

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
  ipcMain.handle('getWindowSetting', () => {
    return windowSetting
  })
  // ipcMain.handle('uploadRecords', async (event, { accessToken, records }) => {
  //   const now = Date.now()
  //   if (records.length === 100 || lastUploadTime + CONSTANTS.INTERVAL_MINUTE * 10 < now) {
  //     try {
  //       const response = await upload(accessToken, records)
  //       log.info('Uploaded data CNT:', response.data.length)
  //       lastUploadTime = now
  //       return response.data
  //     } catch (e) {
  //       log.error('Upload error', e.message)
  //       lastUploadTime = now
  //     }
  //   }
  //   return []
  // })
  globalShortcut.register('Alt+Shift+Y', () => {
    callWindowSafe(WINDOWS.main, win => win.webContents.send('showRoseModeDialog'))
  })
  globalShortcut.register('Alt+CommandOrControl+]', () => {
    toggleReader()
  })
  globalShortcut.register('Alt+CommandOrControl+[', () => {
    callWindowSafe(WINDOWS.main, win =>
      win.webContents.openDevTools({
        mode: 'right',
      })
    )
    callWindowSafe(WINDOWS.readerTimer, win =>
      win.webContents.openDevTools({
        mode: 'undocked',
      })
    )
  })
  // const win = new BrowserWindow({
  //   width: 800,
  //   height: 600
  // })
  //
  // win.loadFile('index.html')
  createMainWindow()
  await createAndShowLoadingWindow()
  // await createMiniWin(WINDOWS.main)
  // updateIfNeeded()
  intervalHandle = setInterval(
    () => showUpdateDialogIfNecessary(),
    isDev ? CONSTANTS.INTERVAL_MINUTE : CONSTANTS.INTERVAL_MINUTE * 10
  )

  // uploadIfNeeded()
  uploadIntervalHandle = setInterval(() => uploadIfNeeded(), CONSTANTS.INTERVAL_MINUTE)
  tray = new Tray(path.join(__dirname, 'assets/icon256.png'))
  const contextMenu = Menu.buildFromTemplate([
    { label: '打开渔捞鼠标穿透', click: () => setMouseThrough(true) },
    { label: '关闭渔捞鼠标穿透', click: () => setMouseThrough(false) },
    { label: '重置窗口位置', click: () => resetWindowPos() },
    { label: '退出鱼糕程序', click: quit },
  ])

  callTargetSafe(tray, it => it.setToolTip('点击显示鱼糕'))
  callTargetSafe(tray, it => it.setContextMenu(contextMenu))
  callTargetSafe(tray, it => it.on('click', showAndFocusMain))
}
function resetWindowPos() {
  Object.values(WINDOWS).forEach(win => {
    callWindowSafe(win, win => win.setPosition(100, 100))
  })
  Object.keys(DEFAULT_WINDOW_SETTING).forEach(settingName =>
    saveWindowSetting(settingName + '.pos', { x: 100, y: 100 })
  )
}

function setMouseThrough(enable) {
  enableMouseThrough = enable
  callWindowSafe(WINDOWS.readerTimer, win =>
    win.setIgnoreMouseEvents(enable, { forward: true })
  )
  callWindowSafe(WINDOWS.timerMini, win =>
    win.setIgnoreMouseEvents(enable, { forward: true })
  )
  callWindowSafe(WINDOWS.readerHistory, win =>
    win.setIgnoreMouseEvents(enable, { forward: true })
  )
  callWindowSafe(WINDOWS.readerSpotStatistics, win =>
    win.setIgnoreMouseEvents(enable, { forward: true })
  )
}

let switchingMiniMode = false
function switchMiniMode(mini) {
  callWindowSafe(WINDOWS.main, async () => {
    if (switchingMiniMode) return
    switchingMiniMode = true
    if (mini) {
      const [x, y] = WINDOWS.main.getPosition()
      WINDOWS.mini = await createMiniWin(WINDOWS.main)
      WINDOWS.mini.setPosition(x, y + MINI_POS_OFFSET)
      WINDOWS.mini.show()

      WINDOWS.main.hide()
    } else {
      callWindowSafe(WINDOWS.mini, win => {
        win.close()
      })
      // WINDOWS.mini.hide()
      WINDOWS.main.show()
    }
    switchingMiniMode = false
  })
}

let switchReaderMini = false

function switchReaderMiniMode(mini) {
  if (switchReaderMini) return
  switchingMiniMode = true
  if (mini) {
    // hideBySwitch = true
    const { x, y } = windowSetting.timer.pos
    callWindowSafe(WINDOWS.readerTimer, win => win.close())
    if (!WINDOWS.timerMini) {
      createTimerMiniWin().then(win => {
        win.setPosition(x, y + READER_MINI_POS_OFFSET)
        win.show()
        saveWindowSetting('timerMini.pos', { x, y: y + READER_MINI_POS_OFFSET })
        saveWindowSetting('timerMini.enabled', true)
      })
    }
  } else {
    callWindowSafe(WINDOWS.timerMini, win => win.close())
    if (!WINDOWS.readerTimer) {
      createReader()
      callWindowSafe(WINDOWS.readerTimer, win => win.show())
      saveWindowSetting('timerMini.enabled', false)
    }
  }
  switchingMiniMode = false

  // callWindowsSafe(
  //   [
  //     WINDOWS.readerTimer,
  //     WINDOWS.readerSetting,
  //     WINDOWS.readerHistory,
  //     WINDOWS.readerSpotStatistics,
  //     WINDOWS.timerMini,
  //   ],
  //   () => {
  //     hideBySwitch = true
  //     if (mini) {
  //       const [x, y] = WINDOWS.readerTimer.getPosition()
  //       WINDOWS.readerTimer.hide()
  //       WINDOWS.timerMini.setPosition(x, y + READER_MINI_POS_OFFSET)
  //       WINDOWS.timerMini.show()
  //       saveWindowSetting('timerMini.enabled', true)
  //     } else {
  //       WINDOWS.timerMini.hide()
  //       WINDOWS.readerTimer.show()
  //       saveWindowSetting('timerMini.enabled', false)
  //     }
  //   }
  // )
}

function createReaderSetting(readTimerWin) {
  const settingName = 'setting'
  const windowName = 'readerSetting'
  // closedWindows[settingName] = null
  return createWindow(
    windowName,
    settingName,
    'assets/setting.png',
    'reader',
    'setting',
    () => {},
    ['--route-name=ReaderSetting', '--close-mode=CLOSE'],
    false,
    true,
    true,
    readTimerWin
  )
}

function createReaderHistory(readTimerWin) {
  const settingName = 'history'
  const windowName = 'readerHistory'
  // closedWindows[settingName] = null
  return createWindow(
    windowName,
    settingName,
    'assets/reader.png',
    'reader',
    'history',
    () => {},
    null,
    false,
    true,
    true,
    null
  )
}

function createReaderSpotStatistics(readTimerWin) {
  const settingName = 'spotStatistics'
  const windowName = 'readerSpotStatistics'
  // closedWindows[settingName] = null
  return createWindow(
    windowName,
    settingName,
    'assets/reader.png',
    'reader',
    'spotStatistics',
    () => {},
    ['--route-name=ReaderSpotStatistics'],
    false,
    true,
    true,
    null
  )
}

function createTransparentWin(
  windowName,
  page,
  hash,
  width,
  height,
  show,
  additionalArguments = null,
  settingName = null,
) {
  const setting = settingName && windowSetting[settingName]
  WINDOWS[windowName] = new BrowserWindow({
    width: width,
    height: height,
    frame: false,
    show: false,
    transparent: true,
    resizable: false,
    maximizable: false,
    skipTaskbar: true,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
      enableRemoteModule: true,
      preload: __dirname + '/preload.js',
      zoomFactor: (setting && setting.zoomFactor) || 0,
      additionalArguments: additionalArguments,
    },
    icon: path.join(__dirname, 'assets/icon256.png'),
  })
  const win = WINDOWS[windowName]
  win.removeMenu()
  setOnTop(win)
  // if (!show) {
  //   win.hide()
  // }
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
  win.on('closed', () => {
    WINDOWS[windowName] = null
  })
  return loadedPromise.then(() => win)
}
const MINI_POS_OFFSET = 20
function createMiniWin(parent) {
  return createTransparentWin('mini', 'mini', null, 150, 100, false)
    .then(win => {
      win.setParentWindow(parent)
      return win.on('moved', () => {
        const [x, y] = win.getPosition()
        WINDOWS.main.setPosition(x, y - MINI_POS_OFFSET)
        saveWindowSetting('main.pos', { x, y: y - MINI_POS_OFFSET })
      })
    })
    .catch(error => {
      log.info('caught error in create main mini', error)
    })
}

function createAndShowLoadingWindow(parent) {
  return createTransparentWin('loading', 'loading', null, 250, 250, true)
    .then(win => {
      win.setParentWindow(parent)
    })
    .catch(error => {
      log.info('caught error in create loading', error)
    })
}

const READER_MINI_POS_OFFSET = 56
function createTimerMiniWin() {
  return createTransparentWin(
    'timerMini',
    'reader',
    'timerMini',
    windowSetting.timerMini.size.w,
    windowSetting.timerMini.size.h,
    false,
    ['--route-name=ReaderTimerMini', '--mode=mini'],
    'timerMini'
  )
    .then(win => {
      if (windowSetting.timerMini.pos.x && windowSetting.timerMini.pos.y) {
        win.setPosition(windowSetting.timerMini.pos.x, windowSetting.timerMini.pos.y)
      }
      // win.setParentWindow(parent)
      win.setResizable(true)
      return win
        .on('moved', () => {
          const [x, y] = win.getPosition()
          // WINDOWS.readerTimer.setPosition(x, y - READER_MINI_POS_OFFSET)
          saveWindowSetting('timer.pos', { x, y: y - READER_MINI_POS_OFFSET })
          saveWindowSetting('timerMini.pos', { x, y })
        })
        .on('resized', () => {
          const [w, h] = win.getSize()
          saveWindowSetting('timerMini.size', { w, h })
        })
        .on('hide', e => {
          hideReaderWindows()
        })
        .on('show', () => {
          showReaderWindows()
        })
    })
    .catch(error => {
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
  skipTaskbar = false,
  parent = null
) {
  const setting = windowSetting[settingName]
  WINDOWS[windowName] = new BrowserWindow({
    backgroundColor: '#33333d',
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
    skipTaskbar: skipTaskbar,
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
      .then(() => loadedCallback(win))
  } else {
    win
      .loadFile(path.join(__dirname, `/front-electron-dist/${page}.html`), {
        hash: hash && '/' + hash,
      })
      .then(() => loadedCallback(win))
  }

  if (keepOnTop) setOnTop(win)

  setMouseThrough(enableMouseThrough)

  win.once('ready-to-show', () => {
    if (fishingData) {
      sendFishingData(fishingData)
    }
  })

  return win
    .on('moved', () => {
      const [x, y] = win.getPosition()
      saveWindowSetting(settingName + '.pos', { x, y })
    })
    .on('resized', () => {
      const [w, h] = win.getSize()
      saveWindowSetting(settingName + '.size', { w, h })
    })
    .on('closed', () => {
      WINDOWS[windowName] = null
    })
}

function createMainWindow(loadedCallback) {
  return createWindow(
    'main',
    'main',
    'assets/icon256.png',
    'index',
    null,
    loadedCallback
  ).on('closed', () => {
    if (mainWindowConfig.closeMode === 'CLOSE') {
      quit()
    }
  })
}

function setOnTop(win, alwaysOnTop = true) {
  win.setAlwaysOnTop(alwaysOnTop, 'screen-saver')
  win.setMinimizable(!alwaysOnTop)
}

function createReader(loadedCallback) {
  const settingName = 'timer'
  // closedWindows[settingName] = null
  const win = createWindow(
    'readerTimer',
    settingName,
    'assets/reader.png',
    'reader',
    'timer',
    loadedCallback,
    ['--route-name=ReaderTimer', '--mode=normal'],
    false,
    true,
    true,
    null
  )
  return win
    .on('resized', () => {
      const [w, h] = win.getSize()
      if (windowSetting.timerMini.enabled) {
        saveWindowSetting('timerMini.size', { w, h })
      } else {
        saveWindowSetting('timer.size', { w, h })
      }
    })
    .on('hide', e => {
      hideReaderWindows()
    })
    .on('show', () => {
      showReaderWindows()
    })
}

function showReaderWindows() {
  settingVisible && callWindowSafe(WINDOWS.readerSetting, win => win.showInactive())
  historyVisible && callWindowSafe(WINDOWS.readerHistory, win => win.showInactive())
  spotStatisticsVisible &&
    callWindowSafe(WINDOWS.readerSpotStatistics, win => win.showInactive())
}

function hideReaderWindows() {
  // Not used now since timer windows are closed when switching mini mode
  // if (hideBySwitch) {
  // //   do nothing
  // hideBySwitch = false
  // return
  // } else
  if (hideByFishingTrigger) {
    hideByFishingTrigger = false
    // save other window status
    settingVisible = WINDOWS.readerSetting && WINDOWS.readerSetting.isVisible()
    historyVisible = WINDOWS.readerHistory && WINDOWS.readerHistory.isVisible()
    spotStatisticsVisible =
      WINDOWS.readerSpotStatistics && WINDOWS.readerSpotStatistics.isVisible()
  } else {
    // hide together
    settingVisible = false
    historyVisible = false
    spotStatisticsVisible = false
  }

  callWindowSafe(WINDOWS.readerSetting, win => win.hide())
  callWindowSafe(WINDOWS.readerHistory, win => win.hide())
  callWindowSafe(WINDOWS.readerSpotStatistics, win => win.hide())
}

function updateUserData(updateData) {
  callWindowSafe(WINDOWS.main, win => win.webContents.send('updateUserData', updateData))
}

function showReader() {
  if (!windowSetting.timerMini.enabled) {
    if (!WINDOWS.readerTimer) {
      WINDOWS.readerTimer = createReader(win => {
        // createTimerMiniWin(win)
        // createReaderSetting(win)
        // createReaderHistory(win)
        // createReaderSpotStatistics(win)
        win.show()
      })
    } else {
      callWindowSafe(WINDOWS.readerTimer, win => win.show())
    }
  } else {
    if (!WINDOWS.timerMini) {
      createTimerMiniWin().then(win => {
        WINDOWS.timerMini = win
        win.show()
      })
    } else {
      callWindowSafe(WINDOWS.timerMini, win => win.show())
    }
  }
}

function toggleReader() {
  if (!windowSetting.timerMini.enabled) {
    if (!WINDOWS.readerTimer) {
      WINDOWS.readerTimer = createReader()
    }
    toggleWindow(WINDOWS.readerTimer)
  } else {
    if (!WINDOWS.timerMini) {
      createTimerMiniWin().then(win => {
        WINDOWS.timerMini = win
      })
    }
    toggleWindow(WINDOWS.timerMini)
  }
}

function toggleWindow(window) {
  callWindowSafe(window, win => {
    if (win.isVisible()) {
      win.hide()
    } else {
      win.show()
    }
  })
}

function showReaderSetting() {
  if (!WINDOWS.readerSetting) {
    WINDOWS.readerSetting = createReaderSetting(WINDOWS.readerTimer)
  }
  callWindowSafe(WINDOWS.readerSetting, win => win.show())
}

function toggleReaderHistory() {
  if (!WINDOWS.readerHistory) {
    WINDOWS.readerHistory = createReaderHistory(WINDOWS.readerTimer)
  }
  callWindowSafe(WINDOWS.readerHistory, win => {
    if (win.isVisible()) {
      win.hide()
    } else {
      win.show()
    }
  })
}

function toggleSpotStatistics() {
  if (!WINDOWS.readerSpotStatistics) {
    WINDOWS.readerSpotStatistics = createReaderSpotStatistics(WINDOWS.readerTimer)
  }
  callWindowSafe(WINDOWS.readerSpotStatistics, win => {
    if (win.isVisible()) {
      win.hide()
    } else {
      win.show()
    }
  })
}

async function downloadCommitHash() {
  return download(COMMIT_HASH_DOWNLOAD_LINK)
    .on('error', err => log.error('Error in download commit hash:', err))
    .then(data => {
      return data.toString(FILE_ENCODING)
    })
    .catch(() => {
      // do nothing
      return undefined
    })
}

async function downloadSetupFile(onDownloadProgress, onFinished) {
  return download(SETUP_EXE_DOWNLOAD_LINK, SETUP_PATH)
    .on('downloadProgress', progress => {
      try {
        // Report download progress
        onDownloadProgress(progress)
      } catch (e) {
        log.error('In downloadProgress.', e)
      }
    })
    .on('error', err => log.error('Error in download setup:', err))
    .then(() => {
      onFinished()
    })
    .catch(() => {
      // do nothing
    })
}

// let lastUploadTime = 0

async function uploadIfNeeded() {
  callFirstAvailableWin([WINDOWS.readerTimer, WINDOWS.timerMini, WINDOWS.main], win => {
    win.webContents.send('getUploadRecords')
  })
}

const getLocalVersion = () => {
  let LOCAL_COMMIT_HAST_PATH
  if (isDev) {
    LOCAL_COMMIT_HAST_PATH = __dirname + '/front-electron-dist/COMMITHASH' // VERSION
  } else {
    LOCAL_COMMIT_HAST_PATH = path.join(app.getAppPath(), '../../resources/COMMITHASH')
  }
  const localCommitHash = fs.readFileSync(LOCAL_COMMIT_HAST_PATH).toString(FILE_ENCODING)
  log.info('Local commit hash', localCommitHash)
  return localCommitHash
}

const newVersionAvailable = async () => {
  log.info('Checking updates...')
  const localCommitHash = getLocalVersion()
  const remoteCommitHash = await downloadCommitHash()
  log.info('Remote commit hash:', remoteCommitHash)
  if (localCommitHash !== remoteCommitHash && remoteCommitHash != null) {
    return remoteCommitHash
  } else {
    return undefined
  }
}

const showUpdateDialogIfNecessary = async () => {
  if (!updateDownloading && skipUpdate) {
    log.info('skip update')
    return
  }
  const newVersion = await newVersionAvailable()
  if (newVersion != null) {
    callWindowSafe(WINDOWS.main, win => {
      win.webContents.send('showUpdateDialog', newVersion)
    })
  }
}

const downloadUpdates = async intervalHandle => {
  clearInterval(intervalHandle)
  updateDownloading = true
  const throttled = throttle(
    progress => {
      try {
        log.info('progress', progress.percent)
        callWindowSafe(WINDOWS.main, win => {
          win.webContents.send('setupDownload', progress)
          win.setProgressBar(progress.percent)
        })
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
      updateDownloading = false
      updateDownloaded = true
      callWindowSafe(WINDOWS.main, win => win.webContents.send('checkStartSetup'))
    } catch (e) {
      log.error('Try open update dialog failed.', e)
    }
  })
}

async function updateIfNeeded(intervalHandle) {
  if (skipUpdate || updateDownloaded || updateDownloading) {
    log.info('Update check skipped')
    if (skipUpdate) {
      callWindowSafe(WINDOWS.main, win => {
        win.setProgressBar(0)
      })
    }
    return
  }

  log.info('Checking updates...')
  const localCommitHash = getLocalVersion()
  const remoteCommitHash = await downloadCommitHash()
  log.info('Remote commit hash:', remoteCommitHash)
  if (localCommitHash !== remoteCommitHash && remoteCommitHash != null) {
    clearInterval(intervalHandle)
    log.info('New Version Detected!')
    updateDownloading = true
    const throttled = throttle(
      progress => {
        try {
          log.info('progress', progress.percent)
          callWindowSafe(WINDOWS.main, win => {
            win.webContents.send('setupDownload', progress)
            win.setProgressBar(progress.percent)
          })
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
        updateDownloading = false
        updateDownloaded = true
        callWindowSafe(WINDOWS.main, win => win.webContents.send('checkStartSetup'))
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
    clearInterval(uploadIntervalHandle)
    FishingDataReader.stop(() => {
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
    FishingDataReader.stop(() => {
      log.info('quit by close')
      callTargetSafe(tray, it => it.destroy())
      app.quit()
    })
  } catch (e) {
    console.error('Error in quit', e)
  }
}

function streamToString(stream) {
  const chunks = []
  return new Promise((resolve, reject) => {
    stream.on('data', chunk => chunks.push(chunk))
    stream.on('error', reject)
    stream.on('end', () => resolve(Buffer.concat(chunks).toString(FILE_ENCODING)))
  })
}

function postInstallCallback(error) {
  // after install npcap
  const options = { region, monitorType }
  FishingDataReader.restart(options, () => {
    log.info('Machina restarted!', options)
  })
  callWindowSafe(WINDOWS.readerSetting, win =>
    win.webContents.send('installNpcapFishined')
  )
  ;[
    WINDOWS.readerTimer,
    WINDOWS.timerMini,
    WINDOWS.readerSetting,
    WINDOWS.readerHistory,
    WINDOWS.readerSpotStatistics,
  ].forEach(it =>
    callWindowSafe(it, win => {
      setOnTop(win, true)
    })
  )
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
    .catch(error => {
      log.error('error in init', error)
    })
}

function showAndFocusMain() {
  if (!WINDOWS.main) {
    createMainWindow()
  }
  callWindowSafe(WINDOWS.main, win => {
    if (win.isMinimized()) win.restore()
    if (!win.isVisible()) win.show()
    win.focus()
  })
}

function callWindowSafe(win, winCallback) {
  if (win && !win.isDestroyed()) {
    winCallback(win)
  }
}
function callWindowsSafe(wins, winCallback) {
  if (wins.every(it => it) && wins.every(it => !it.isDestroyed())) {
    winCallback(wins)
  }
}

function callTargetSafe(target, targetCallback) {
  if (target) {
    targetCallback(target)
  } else {
    log.error('call target when it is undefined')
  }
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    log.info('in all closed')
    if (mainWindowConfig.closeMode === 'CLOSE') {
      // FishingDataReader.stop(() => {
      //   log.info('call quit')
      //   // if (toInstallUpdates) {
      //   //   log.info('try install')
      //   //   exec('./setup/PastryFishSetup.exe')
      //   // } else {
      //   app.quit()
      //   // }
      // })
      quit()
    }
  }
})

// app.on("activate", () => {
//   if (BrowserWindow.getAllWindows().length === 0) {
//     createMainWindow();
//   }
// });

let machinaStarted = false
function startReaderOnce(options) {
  if (!machinaStarted) {
    machinaStarted = true
    region = options.region
    monitorType = options.monitorType
    FishingDataReader.restart(options, () => {
      log.info('Machina started!', options)
    })
  }
}


app.on('ready', () => app.setAppUserModelId("ffxiv-pastry-fish"));
