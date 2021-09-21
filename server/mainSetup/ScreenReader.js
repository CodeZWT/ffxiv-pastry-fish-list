const FishingDataReader = require("../reader");
const log = require("electron-log");

class ScreenReader {
  constructor() {
    this.fishingData = undefined
    this.machinaStarted = false
  }

  setSender(sender) {
    FishingDataReader.onUpdate(async data => {
      this.fishingData = data
      sender.send('fishingData', data)
    })

    FishingDataReader.onFishCaught(data => {
      sender.send('fishCaught', data)
    })
    FishingDataReader.onNewRecord(data => {
      sender.send('newRecord', data)
    })
    FishingDataReader.onPlayerSetup(data => {
      sender.send('playerSetup', data)
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
