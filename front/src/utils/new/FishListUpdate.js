import { ALL_AVAILABLE, FISHING } from 'Data/constants'
import Vue from 'vue'

class FishListUpdateWorker {
  selectedFishId
  searchedFishId
  fishToUpdate = []
  extraFishToUpdate = []
  activeFishCnt = 0
  total = 0
  current = 0
  step = 1
  initCountDownSlotNumber = 1
  updateCountDownSlotNumber = 1
  slot = 0

  constructor(fishList, fishListTimePart, extraFishListTimePart, getCountDownFn) {
    this.fishList = fishList
    this.fishListTimePart = fishListTimePart
    this.extraFishListTimePart = extraFishListTimePart
    this.getCountDownFn = getCountDownFn
  }

  // init all fish time part
  initAllFishTimePart(now) {
    this.fishList.forEach(fish => {
      const countDown = this.fishListTimePart[fish._id]?.countDown
      // if type is all available then skip
      // ALL_AVAILABLE refers to the final result, which means
      // if fish has predators, their constraints are also checked
      if (countDown?.type === ALL_AVAILABLE) {
        return
      }
      Vue.set(this.fishListTimePart, fish._id, {
        id: fish._id,
        countDown: this.getCountDownFn(fish, now),
      })
    })
  }

  genUpdateWorks(now) {
    this.extraFishToUpdate = []
    this.fishToUpdate = []
    this.activeFishCnt = 0
    // source fish list
    this.fishList.forEach((fish, index) => {
      const countDown = this.fishListTimePart[fish._id]?.countDown
      // if type is all available then skip
      // ALL_AVAILABLE refers to the final result, which means
      // if fish has predators, their constraints are also checked
      if (countDown?.type === ALL_AVAILABLE) {
        return
      } else if (countDown?.type === FISHING) {
        this.activeFishCnt++
      }

      // calculate countdown for selected(in fish list) and searched fish
      // to ensure the timer in the search and detail fish pane work correctly
      if (
        (this.selectedFishId != null && fish._id === this.selectedFishId) ||
        (this.searchedFishId != null && fish._id === this.searchedFishId)
      ) {
        this.extraFishToUpdate.push(index)
      }

      const lazyStartTime = countDown?.timePoint
      // const currentInterval = countDown?.time
      // calculate for all fish
      // If timePoint and time are not initialized then calculate first
      // If not, update countDown when the actual countdown text needed to be updated
      // e.g. text '05小时候开始' (start in 05 hours) only be updated 1 time per hour
      if (
        !lazyStartTime ||
        // !currentInterval ||
        lazyStartTime < now
        // DataUtil.shouldUpdate(lazyStartTime - now, currentInterval)
      ) {
        this.fishToUpdate.push(index)
      }
    })

    this.total = this.extraFishToUpdate.length + this.fishToUpdate.length
    this.current = 0
    this.step = Math.ceil(this.total / this.updateCountDownSlotNumber)

    // console.log('gen new work', this.total, this.step)
  }

  doNext() {
    // console.debug('slot', this.slot)
    const now = Date.now()
    // console.log(new Date(now).getSeconds())
    if (this.slot === 0) {
      this.genUpdateWorks(now)
      // console.log(this.step)
    } else if (this.slot > 0) {
      this.updateCountdownNext(now)
    }
    this.slot = (this.slot + 1) % 60
    window.requestAnimationFrame(() => this.doNext())
  }

  doAllOnce() {
    // console.debug('all')
    const now = Date.now()
    this.genUpdateWorks(now)
    this.updateCountdownNext(now)
  }

  updateCountdownNext(now) {
    if (this.current >= this.total) {
      // console.debug('Nothing to do', this.current, this.total)
      return
    }
    const end = Math.min(this.current + this.step, this.total)
    console.debug(`Start Update: [${this.current}, ${end})`)
    for (let i = this.current; i < end; i++) {
      let fish, target
      if (i < this.extraFishToUpdate.length) {
        fish = this.fishList[this.extraFishToUpdate[i]]
        target = this.extraFishListTimePart
      } else {
        fish = this.fishList[this.fishToUpdate[i - this.extraFishToUpdate.length]]
        target = this.fishListTimePart
      }
      const countDown = this.getCountDownFn(fish, now)
      Vue.set(target, fish._id, {
        id: fish._id,
        countDown: countDown,
      })
    }
    this.current += this.step
  }
}

export { FishListUpdateWorker }
