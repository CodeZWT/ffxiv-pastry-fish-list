import { INTERVAL_HOUR } from 'Data/constants'
import { mapGetters, mapState } from 'vuex'
import DataUtil from '@/utils/DataUtil'
import NotificationUtil from '@/utils/NotificationUtil'
import OceanFishingUtil from '@/utils/OceanFishing54/OceanFishingUtil'

export default {
  name: 'AlarmMixin',
  data() {
    return {
      notificationRecords: {},
      IKDRouteNotificationRecords: {},
      fishListTimePart: {},
      fishListWeatherChangePart: {},
      lazyTransformedFishDict: {},
      lazyFishWindowRates: {},
      notifications: [],
      routes: [],
      routesStartTime: 0,
      testCounter: 0,
      alarms: {},
    }
  },
  computed: {
    ...mapState(['sounds']),
    ...mapGetters([
      'notification',
      'isSystemNotificationEnabled',
      'toBeNotifiedFishIds',
      'toBeNotifiedIKDRoutes',
    ]),
    // ...mapState('alarm', ['alarms']),
  },

  methods: {
    // ...mapMutations('alarm', ['setAlarms']),
    checkNotification(now) {
      // TEST
      // const now = new Date('2021/11/27 21:57:55').getTime() + this.testCounter * 1000
      // console.log('time:', new Date(now))
      // this.testCounter++
      this.notifications = []

      this.check(now)

      if (this.notifications.length > 0) {
        console.debug(
          'ring bell for',
          this.notifications.map(it => it.alarmId ?? it.name)
        )
        // ring bell for fish reach alarm time
        this.ringBell(this.notifications.map(it => it.setting.sound))
        // show system notification if enabled
        if (this.isSystemNotificationEnabled) {
          NotificationUtil.showFishNotification(
            this.notifications.filter(it => it.alarmType === 'Fish')
          )
          NotificationUtil.showRouteNotification(
            this.notifications.filter(it => it.alarmType === 'IKDRoute')
          )
        }
      }
    },

    check(now) {
      this.checkFishNew(now)
      this.checkIKDRouteNew(now)

      this.alarms = { ...this.alarms }
      // console.log('alarms', JSON.stringify(this.alarms))
      // this.setAlarms(cloneDeep(this.alarms))
    },
    clearTargetIfRemoved(alarmId, crrTargetIds) {
      const oldAlarmTargets = this.alarms[alarmId] ?? {}
      let newAlarmTargets = {}
      Object.keys(oldAlarmTargets)
        .map(it => +it)
        .forEach(targetId => {
          if (crrTargetIds.includes(targetId)) {
            newAlarmTargets[targetId] = oldAlarmTargets[targetId]
          }
        })
      this.alarms[alarmId] = newAlarmTargets
    },
    checkIKDRouteNew(now) {
      // console.log('start check ikd route')

      const shiftNow = now - (now % (2 * INTERVAL_HOUR))

      if (this.routesStartTime < shiftNow) {
        // console.log('refresh cache')
        this.routes = OceanFishingUtil.voyagesWithTipOf(now, 24)
        // .filter(
        // it => it.time > now
        // )
        this.routesStartTime = this.routes[0].time
        // console.log('current routes', this.routes)
      }
      // console.log('route', JSON.stringify(this.notification.IKDRouteSettings))
      this.notification.IKDRouteSettings.forEach(setting => {
        const alarmType = 'IKDRoute'
        const alarmId = alarmType + '-' + setting.key
        if (setting.enabled) {
          // console.log(alarmId, 'is enabled')
          this.clearTargetIfRemoved(alarmId, this.toBeNotifiedIKDRoutes)

          this.toBeNotifiedIKDRoutes.forEach(routeId => {
            // console.log('check route', routeId)
            const targetRoutes = this.routes.filter(r => r.voyageType === routeId)
            // .filter(r => now <= r.time)
            const route = targetRoutes[0]
            // console.log('route', route, new Date(route.time))

            this.checkTarget(
              now,
              setting,
              alarmType,
              alarmId,
              routeId,
              () => {
                if (targetRoutes.length < 2) {
                  console.warn('targetRoutes', targetRoutes)
                }
                const first =
                  targetRoutes[0].time +
                  (setting.offset - setting.before) * DataUtil.INTERVAL_MINUTE
                if (now < first) {
                  return targetRoutes[0].time
                } else {
                  return targetRoutes[1].time
                }
              },
              id => {
                // console.log('ROUTES', OceanFishingUtil.ROUTES)
                return {
                  id: id,
                  icon: '',
                  name: `${route.shift.name}（${
                    OceanFishingUtil.SHIFTS[route.shift.type]
                  }）`,
                }
              }
            )
          })
        } else {
          // console.log(alarmId, 'is not enabled, remove all alarm')
          this.alarms[alarmId] = {}
        }
      })
    },
    checkFishNew(now) {
      this.notification.settings.forEach(setting => {
        const alarmType = 'Fish'
        const alarmId = alarmType + '-' + setting.key
        if (setting.enabled) {
          this.clearTargetIfRemoved(alarmId, this.toBeNotifiedFishIds)

          this.toBeNotifiedFishIds.forEach(fishId => {
            this.checkTarget(
              now,
              setting,
              alarmType,
              alarmId,
              fishId,
              fishId => {
                const fishWindows =
                  this.fishListWeatherChangePart[fishId]?.fishWindows ?? []

                return (
                  fishWindows
                    .map(it => it[0])
                    .find(
                      window => now <= window - setting.before * DataUtil.INTERVAL_MINUTE
                    ) ?? 0
                )
              },
              id => {
                const fish = this.lazyTransformedFishDict[fishId]

                return {
                  id: id,
                  icon: fish.iconRemoteUrl,
                  name: fish.name,
                }
              }
            )
          })
        } else {
          this.alarms[alarmId] = {}
        }
      })
    },

    checkTarget(
      now,
      setting,
      alarmType,
      alarmId,
      targetId,
      getNextAlarmTime,
      genNotification
    ) {
      const existedTargetAlarm = this.alarms[alarmId]?.[targetId]
      // existedTargetAlarm &&
      // console.log(
      //   'alarm',
      //   alarmId,
      //   'target',
      //   targetId,
      //   'alarm at',
      //   new Date(existedTargetAlarm)
      // )
      // if (existedTargetAlarm) {
      //   console.log(
      //     'check',
      //     new Date(now),
      //     'target',
      //     new Date(existedTargetAlarm - setting.before * DataUtil.INTERVAL_MINUTE)
      //   )
      // }
      if (
        existedTargetAlarm &&
        now >=
          existedTargetAlarm +
            ((setting.offset ?? 0) - setting.before) * DataUtil.INTERVAL_MINUTE
      ) {
        this.notifications.push({
          ...genNotification(targetId),
          alarmType,
          alarmId,
          targetId,
          setting,
        })
        // console.log(alarmId, 'set notifications', alarmId)
        this.alarms[alarmId][targetId] = undefined
      } else {
        this.alarms[alarmId] ??= {}
        this.alarms[alarmId][targetId] = getNextAlarmTime(targetId)
        // console.log(alarmId, 'set alarm time', new Date(this.alarms[alarmId][targetId]))
      }
    },

    ringBell(soundsToPlay) {
      soundsToPlay.forEach(key => {
        this.sounds[key]?.player?.volume(this.notification.volume).play()
      })
    },
  },
}
