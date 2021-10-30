const FishingDataReader = require('../reader')
const log = require('electron-log')
const { exec } = require('child_process')
const _ = require('lodash')

const opCodeRepo = 'RicecakeFC/FFXIVOpcodes'
const opcodeUrlOf = (version = 'latest') =>
  `https://cdn.jsdelivr.net/gh/${opCodeRepo}@${version}/opcodes.min.json`

class ScreenReader {
  constructor(region, monitorType) {
    this.fishingData = undefined
    this.machinaStarted = false
    this.region = region
    this.monitorType = monitorType
    this.opcodeUrl = opcodeUrlOf()
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
      this.sender.sendMain('playerSetup', data)
    })
  }

  startReaderOnce(options) {
    if (!this.machinaStarted) {
      this.machinaStarted = true
      this.region = options.region
      this.monitorType = options.monitorType
      this.opcodeUrl = options.opcodeUrl
      FishingDataReader.restart(options, () => {
        log.info('Machina started!', options)
      })
    }
  }

  restart(optionsPart, fn, force) {
    // log.debug('in screen reader restart')

    if (!this.machinaStarted) {
      log.error('Call restart before start once. Skipped!')
      return
    }

    const options = _.merge({
      region: optionsPart.region || this.region,
      monitorType: optionsPart.monitorType || this.monitorType,
      opcodeUrl: optionsPart.opcodeUrl || this.opcodeUrl,
    })

    if (
      this.region !== options.region ||
      this.monitorType !== options.monitorType ||
      this.opcodeUrl !== options.opcodeUrl ||
      force
    ) {
      this.region = options.region
      this.monitorType = options.monitorType
      this.opcodeUrl = options.opcodeUrl

      if (options.monitorType === 'WinPCap') {
        exec('Get-Service -Name Npcap', { shell: 'powershell.exe' }, err => {
          if (err) {
            this.sender.send('installNpcapPrompt')
          } else {
            FishingDataReader.restart(options, fn)
          }
        })
      } else {
        FishingDataReader.restart(options, fn)
      }
    } else {
      // log.debug('Same config. Skipped restarting.')
    }
  }

  stop(fn) {
    FishingDataReader.stop(() => {
      this.machinaStarted = false
      fn()
    })
  }
}

module.exports = { ScreenReader, opcodeUrlOf }
