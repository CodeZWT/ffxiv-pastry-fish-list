const log = require("electron-log");
const { callWindowSafe } = require("./utils");
const isDev = require("electron-is-dev");
const CONSTANTS = require("../../data/constants");
const throttle = require("lodash/throttle");
const download = require("download");
const path = require("path");
const { app } = require("electron");
const fs = require("fs");
const SETUP_EXE_DOWNLOAD_LINK =
  'https://ricecake302-generic.pkg.coding.net/pastry-fish/desktop-app/PastryFishSetup.exe?version=latest'
const COMMIT_HASH_DOWNLOAD_LINK =
  'https://ricecake302-generic.pkg.coding.net/pastry-fish/desktop-version/COMMITHASH?version=latest'

const SETUP_PATH = 'setup'
const FILE_ENCODING = 'utf8'

class Updater {
  constructor(win, sender) {
    this.win = win
    this.sender = sender
    this.updateDownloading = false
    this.skipUpdate = false

    this.intervalHandle = setInterval(
      () => this.showUpdateDialogIfNecessary(),
      isDev ? CONSTANTS.INTERVAL_MINUTE : CONSTANTS.INTERVAL_MINUTE * 10
    )
  }

  async showUpdateDialogIfNecessary() {
    if (!this.updateDownloading && this.skipUpdate) {
      log.info('skip update')
      return
    }
    const newVersion = await newVersionAvailable()
    if (newVersion != null) {
      this.sender.send('showUpdateDialog', newVersion)
    }
  }

  skip() {
    log.info('Update skipped')
    this.skipUpdate = true
    callWindowSafe(this.win, win => win.setProgressBar(0))
  }

  async downloadUpdates () {
    clearInterval(this.intervalHandle)
    this.updateDownloading = true
    const throttled = throttle(
      progress => {
        try {
          log.info('progress', progress.percent)
          this.sender.send('setupDownload', progress)
          callWindowSafe(this.win, win => {
            win.setProgressBar(progress.percent)
          })
        } catch (e) {
          log.error('Try set download progress failed.', e)
        }
      },
      500,
      { leading: true, trailing: false }
    )
    await this.downloadSetupFile(throttled, () => {
      try {
        log.info('download setup finished')
        this.updateDownloading = false
        this.sender.send('checkStartSetup')
      } catch (e) {
        log.error('Try open update dialog failed.', e)
      }
    })
  }

  async downloadSetupFile(onDownloadProgress, onFinished) {
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

  stop() {
    clearInterval(this.intervalHandle)
  }
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

const getLocalVersion = () => {
  let LOCAL_COMMIT_HAST_PATH
  if (isDev) {
    LOCAL_COMMIT_HAST_PATH = __dirname + '/../../front-electron-dist/COMMITHASH' // VERSION
  } else {
    LOCAL_COMMIT_HAST_PATH = path.join(app.getAppPath(), '../../resources/COMMITHASH')
  }
  const localCommitHash = fs.readFileSync(LOCAL_COMMIT_HAST_PATH).toString(FILE_ENCODING)
  log.info('Local commit hash', localCommitHash)
  return localCommitHash
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


module.exports = {Updater}
