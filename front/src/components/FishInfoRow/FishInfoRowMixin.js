import { SystemInfo } from 'Data/version'
import { mapGetters, mapMutations, mapState } from 'vuex'
import DataUtil from '@/utils/DataUtil'
import _ from 'lodash'

export default {
  props: {
    fish: {
      type: Object,
      default: () => ({}),
    },
    fishTimePart: {
      type: Object,
      default: undefined,
    },
    predators: {
      type: Array,
      default: () => [],
    },
    inPredator: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String,
      default: '',
    },
    showDivider: {
      type: Boolean,
      default: true,
    },
    hideSpotColumn: {
      type: Boolean,
      default: false,
    },
    isLast: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: 'normal',
    },
    isIntersecting: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      countDownTimeText: '',
      countDownNextInterval: '',
    }
  },
  computed: {
    isTimeCheckSkipped() {
      return DataUtil.skipTimeCheckOf(this.fish, this.fishEyesUsed)
    },
    isSpearFish() {
      return this.fish.type === 'spear'
    },
    isEndWalker() {
      return SystemInfo.region === 'Global'
    },
    transformedFishPart() {
      const toBeNotified = this.getFishToBeNotified(this.fish.id)
      return {
        completed: this.getFishCompleted(this.fish.id),
        pinned: this.getFishPinned(this.fish.id),
        toBeNotified: toBeNotified,
        notificationHint: toBeNotified
          ? this.$t('list.item.notificationHintOff')
          : this.$t('list.item.notificationHint'),
        toBeNotifiedLocked: this.getFishToBeNotifiedLocked(this.fish.id),
      }
    },
    timePart() {
      return (
        this.fishTimePart ?? {
          id: this.fish.id,
          countDown: { type: DataUtil.ALL_AVAILABLE },
        }
      )
    },
    countDownTime() {
      return this.timePart.countDown?.timePoint - this.now
    },
    nextInterval() {
      return this.timePart.countDown?.nextTimePoint - this.now
    },
    transformedFishTimePart() {
      return {
        countDownType: DataUtil.getCountDownTypeName(this.timePart.countDown?.type),
        countDownTimePoint: this.timePart.countDown?.timePoint,
        countDownTimePointText: this.$t('countDown.timePointHint', {
          timePoint: DataUtil.formatDateTime(this.timePart.countDown?.timePoint),
        }),
        countDownTotal: this.printCountDownTime(
          this.timePart.countDown?.fishWindowTotal,
          1,
          false
        ),
        countDownTotalHint: this.$t('countDown.intervalHint', {
          interval: this.printCountDownTime(this.timePart.countDown?.fishWindowTotal, 2),
        }),
        countDownNextTimePointText: this.$t('countDown.timePointHint', {
          timePoint: DataUtil.formatDateTime(this.timePart.countDown?.nextTimePoint),
        }),
        hasCountDown: DataUtil.hasCountDown(this.timePart.countDown),
        isWaiting: this.timePart.countDown?.type === DataUtil.WAITING,
        isFishing: this.timePart.countDown?.type === DataUtil.FISHING,
      }
    },
    isMobile() {
      return this.$vuetify.breakpoint.mobile
    },
    ...mapState(['showFishPageRightPane', 'now']),
    ...mapGetters([
      'fishEyesUsed',
      'getWeather',
      'getItemIconClass',
      'getItemName',
      'getZoneName',
      'getFishingSpotsName',
      'getBaits',
      'getFishCompleted',
      'getFishPinned',
      'getFishToBeNotified',
      'getFishToBeNotifiedLocked',
    ]),
  },
  watch: {
    countDownTime(countDownTime) {
      const newText = this.printCountDownTime(countDownTime)
      if (!_.isEqual(this.countDownTimeText, newText)) {
        this.countDownTimeText = newText
      }
    },
    nextInterval(nextInterval) {
      const newText = this.$t('countDown.nextInterval', {
        nextInterval: this.printCountDownTime(nextInterval, 1, false),
      })
      if (!_.isEqual(this.countDownNextInterval, newText)) {
        this.countDownNextInterval = newText
      }
    },
  },
  methods: {
    secondsToMinutesString: DataUtil.secondsToMinutesString,
    printCountDownTime: DataUtil.printCountDownTime,
    toItemTitle: DataUtil.toItemTitle,
    setCompleted(completed) {
      this.setFishCompleted({ fishId: this.fish.id, completed })
    },

    setPinned(pinned) {
      this.setFishPinned({ fishId: this.fish.id, pinned })
    },

    setToBeNotified(toBeNotified) {
      this.setFishToBeNotified({ fishId: this.fish.id, toBeNotified })
    },
    setToBeNotifiedLocked(toBeNotifiedLocked) {
      this.setFishToBeNotifiedLocked({ fishId: this.fish.id, toBeNotifiedLocked })
    },
    onFishClicked(components, fishId) {
      this.$emit('click', { fishId: fishId ?? this.fish.id, components })
    },
    toItemIdIfExisted: DataUtil.toItemIdIfExisted,
    ...mapMutations([
      'setFishCompleted',
      'setFishPinned',
      'setFishToBeNotified',
      'showSnackbar',
      'setFishToBeNotifiedLocked',
    ]),
  },
}
