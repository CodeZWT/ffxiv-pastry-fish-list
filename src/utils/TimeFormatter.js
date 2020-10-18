import i18n from '@/i18n'

export default {
  toUnitLabel(unit) {
    return i18n.t(`time.${unit}`)
  },
  millisecondsToText(milliseconds, showCnt = 1, forceShowEndingZeros = true, paddingZero = true) {
    if (milliseconds == null) return undefined
    const units = this.millisecondsToUnits(milliseconds)
    const indexOfFirstNotZero = units.findIndex(it => it > 0)
    const unitLen = UNITS.length
    let unitPairs = []
    if (indexOfFirstNotZero === -1) {
      unitPairs.push({ number: 0, unit: UNITS_TEXT[unitLen - 1] })
    } else {
      for (let i = indexOfFirstNotZero; i < unitLen && unitPairs.length < showCnt; i++) {
        unitPairs.push({ number: units[i], unit: UNITS_TEXT[i] })
      }
      if (!forceShowEndingZeros) {
        const lastNotZeroIndex = unitPairs.map(it => it.number).lastIndexOf(0) - 1
        if (lastNotZeroIndex >= 0) {
          unitPairs = unitPairs.slice(0, lastNotZeroIndex + 1)
        }
      }
    }
    if (unitPairs.length > 1 && unitPairs[unitPairs.length - 1].unit === UNITS_TEXT[unitLen - 1]) {
      unitPairs = unitPairs.slice(0, unitPairs.length - 1)
    }

    return unitPairs
      .map(it => `${it.number.toString().padStart(2, paddingZero ? '0' : '')}${this.toUnitLabel(it.unit)}`)
      .join('')
  },
  millisecondsToUnits(milliseconds) {
    let tmp = milliseconds
    const unitQuantity = []
    for (const unit of UNITS) {
      if (tmp >= unit) {
        const number = parseInt((tmp / unit).toString())
        unitQuantity.push(number)
        tmp -= number * unit
      } else {
        unitQuantity.push(0)
      }
    }
    return unitQuantity
  },
}

const MILLISECOND = 1
const SECOND = 1000 * MILLISECOND
const MINUTE = SECOND * 60
const HOUR = MINUTE * 60
const DAY = HOUR * 24
const UNITS = [DAY, HOUR, MINUTE, SECOND]
const UNITS_TEXT = ['DAY', 'HOUR', 'MINUTE', 'SECOND']
