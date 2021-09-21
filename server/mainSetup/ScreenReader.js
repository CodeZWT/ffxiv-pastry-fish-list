const FishingDataReader = require("../reader");
const log = require("electron-log");
const { exec } = require("child_process");
const { callWindowSafe } = require("./server/mainSetup/utils");

class ScreenReader {
  constructor(region, monitorType) {
    this.fishingData = undefined
    this.machinaStarted = false
    this.region = region
    this.monitorType = monitorType
  }

  setSender(sender) {
    this.sender = sender

    FishingDataReader.onUpdate(async data => {
      this.fishingData = data
      this.sender.send('fishingData', data)
    })
    FishingDataReader.onFishCaught(data => {
      this.sender.send('fishCaught', data)
    })
    FishingDataReader.onNewRecord(data => {
      this.sender.send('newRecord', data)
    })
    FishingDataReader.onPlayerSetup(data => {
      this.sender.send('playerSetup', data)
    })
  }

  startReaderOnce(options) {
    if (!this.machinaStarted) {
      this.machinaStarted = true
      this.region = options.region
      this.monitorType = options.monitorType
      FishingDataReader.restart(options, () => {
        log.info('Machina started!', options)
      })
    }
  }

  restart(options, fn) {
    const newRegion = options.region || 'CN'
    const newMonitorType = options.monitorType || 'RawSocket'
    if (
      this.machinaStarted &&
      (this.region !== newRegion || this.monitorType !== newMonitorType)
    ) {
      this.region = newRegion
      this.monitorType = newMonitorType

      if (newMonitorType === 'WinPCap') {
        exec('Get-Service -Name Npcap', { shell: 'powershell.exe' }, err => {
          if (err) {
            this.sender.send('installNpcapPrompt')
          } else {
            const options = { region: newRegion, monitorType: newMonitorType }
            FishingDataReader.restart(options, fn)
          }
        })
      } else {
        const options = { region: newRegion, monitorType: newMonitorType }
        FishingDataReader.restart(options, fn)
      }
    }
    this.machinaStarted = true
    FishingDataReader.restart(options, fn)
  }

  stop(fn) {
    FishingDataReader.stop(() => {
      this.machinaStarted = false
      fn()
    })
  }
}

module.exports = { ScreenReader }
