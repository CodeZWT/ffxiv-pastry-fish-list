import DataUtil from '@/utils/DataUtil'
import { mapGetters, mapMutations, mapState } from 'vuex'

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
  },
  computed: {
    isTimeCheckSkipped() {
      return DataUtil.skipTimeCheckOf(this.fish, this.fishEyesUsed)
    },
    isSpearFish() {
      return this.fish.type === 'spear'
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
      }
    },
    transformedFishTimePart() {
      const fishTimePart = this.fishTimePart ?? {
        id: this.fish.id,
        countDown: { type: DataUtil.ALL_AVAILABLE },
      }
      return {
        countDownType: DataUtil.getCountDownTypeName(fishTimePart.countDown?.type),
        countDownTime: fishTimePart.countDown?.time,
        countDownTimeText: this.printCountDownTime(fishTimePart.countDown?.time),
        countDownTimePoint: fishTimePart.countDown?.timePoint,
        countDownTimePointText: this.$t('countDown.timePointHint', {
          timePoint: DataUtil.formatDateTime(fishTimePart.countDown?.timePoint),
        }),
        countDownTotal: this.printCountDownTime(
          fishTimePart.countDown?.fishWindowTotal,
          1,
          false
        ),
        countDownTotalHint: this.$t('countDown.intervalHint', {
          interval: this.printCountDownTime(fishTimePart.countDown?.fishWindowTotal, 2),
        }),
        countDownNextInterval: this.$t('countDown.nextInterval', {
          nextInterval: this.printCountDownTime(
            fishTimePart.countDown?.nextInterval,
            1,
            false
          ),
        }),
        countDownNextTimePointText: this.$t('countDown.timePointHint', {
          timePoint: DataUtil.formatDateTime(fishTimePart.countDown?.nextTimePoint),
        }),
        hasCountDown: DataUtil.hasCountDown(fishTimePart.countDown),
        isWaiting: fishTimePart.countDown?.type === DataUtil.WAITING,
        isFishing: fishTimePart.countDown?.type === DataUtil.FISHING,
      }
    },
    isMobile() {
      return this.$vuetify.breakpoint.mobile
    },
    ...mapState(['showFishPageRightPane']),
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
    ]),
  },
  methods: {
    printCountDownTime: DataUtil.printCountDownTime,
    goToFishAngelPage(angelId, name) {
      DataUtil.goToFishAngelPage(angelId, name, this.isMobile, this.showSnackbar)
    },
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
    onFishClicked(components) {
      this.$emit('click', { fishId: this.fish.id, components })
    },
    goToFishingSpotAngelPage() {
      DataUtil.goToFishingSpotAngelPage(
        this.fish.fishingSpots[0].fishingSpot.anglerLocationId,
        this.fish.fishingSpots[0].fishingSpotName,
        this.isMobile,
        this.showSnackbar
      )
    },
    toItemIdIfExisted: DataUtil.toItemIdIfExisted,
    ...mapMutations([
      'setFishCompleted',
      'setFishPinned',
      'setFishToBeNotified',
      'showSnackbar',
    ]),
  },
}
