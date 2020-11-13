import { groupBy } from 'lodash'
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
    return this.isNotificationSupported() && Notification.permission === this.NOTIFICATION_PERMISSIONS.GRANTED
  },

  isNotificationSupported() {
    return typeof Notification !== 'undefined'
  },
  requestNotificationPermission() {
    return Notification.requestPermission()
  },
  showFishNotification(fishNotifications) {
    const fishNotificationByKey = groupBy(fishNotifications, 'setting.key')
    const firstFish = (fishNotificationByKey['fishing'] ?? fishNotificationByKey['waiting'])?.[0]?.fish
    const title = i18n.t('notification.fishAlarm.title', { count: fishNotifications.length })
    const body = Object.entries(fishNotificationByKey)
      .map(([settingKey, notifications]) => {
        return i18n.t('notification.fishAlarm.body', {
          type: i18n.t('notification.fishAlarm.' + settingKey, { minutes: notifications[0]?.setting.before }),
          count: notifications.length,
          fishList: notifications.map(it => it.fish.name).join(', '),
        })
      })
      .join('\n')
    if (this.isNotificationGranted()) {
      new Notification(title, {
        icon: firstFish?.iconRemoteUrl,
        body,
      })
    }
  },
}
