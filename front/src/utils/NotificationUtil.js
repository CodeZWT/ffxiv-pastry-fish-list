import { FISH_NOTIFICATION, IKD_ROUTE_NOTIFICATION } from 'Data/notification'
import _ from 'lodash'
import i18n from '@/i18n'

export default {
  NOTIFICATION_PERMISSIONS: {
    GRANTED: 'granted',
    DENIED: 'denied',
    DEFAULT: 'default,',
  },

  notificationStatus() {
    if (this.isNotificationSupported()) {
      return Notification.permission
    } else {
      return this.NOTIFICATION_PERMISSIONS.DENIED
    }
  },

  isNotificationDefault() {
    return Notification.permission === this.NOTIFICATION_PERMISSIONS.default
  },

  isNotificationGranted() {
    return (
      this.isNotificationSupported() &&
      Notification.permission === this.NOTIFICATION_PERMISSIONS.GRANTED
    )
  },

  isNotificationSupported() {
    return typeof Notification !== 'undefined'
  },
  requestNotificationPermission() {
    return Notification.requestPermission()
  },
  showFishNotification(fishNotifications) {
    if (fishNotifications.length === 0) return
    // console.log(fishNotifications)
    const fishNotificationByKey = _.groupBy(fishNotifications, 'alarmId')
    const firstFish = (fishNotificationByKey['Fish-fishing'] ??
      fishNotificationByKey['Fish-waiting'])?.[0]
    const notificationCandidates = FISH_NOTIFICATION[firstFish.id]?.text ?? []
    notificationCandidates.push('有鱼准备脱钩了！')
    const text =
      notificationCandidates[Math.floor(Math.random() * notificationCandidates.length)]
    const title = i18n.t('notification.fishAlarm.title', {
      text: text,
      count: fishNotifications.length,
    })
    const body = Object.entries(fishNotificationByKey)
      .map(([settingKey, notifications]) => {
        return i18n.t('notification.fishAlarm.body', {
          type: i18n.t('notification.fishAlarm.' + settingKey, {
            minutes: notifications[0]?.setting.before,
          }),
          count: notifications.length,
          fishList: notifications.map(it => it.name).join(', '),
        })
      })
      .join('\n')
    this.showSystemNotification(title, body, firstFish?.icon)
  },
  showRouteNotification(routeNotifications) {
    // console.log(routeNotifications)
    if (routeNotifications.length === 0) return
    const notification = routeNotifications[0]

    // console.log(notification.setting)
    let notificationCandidates = IKD_ROUTE_NOTIFICATION[notification.id]?.text ?? []
    notificationCandidates.push(
      notification.setting.key === 'start' ? '有船准备开走了！' : '扬帆！起航！脱钩！'
    )
    const text =
      notificationCandidates[Math.floor(Math.random() * notificationCandidates.length)]

    const body = i18n.t('notification.IKDRouteAlarm.body', {
      time: i18n.t('notification.IKDRouteAlarm.' + notification.alarmId, {
        minutes: notification.setting.before,
      }),
      text: text,
    })

    this.showSystemNotification(notification.name, body)
  },
  showSystemNotification(title, body) {
    if (this.isNotificationGranted()) {
      new Notification(title, {
        body,
      })
    }
  },
}
