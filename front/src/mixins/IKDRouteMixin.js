import { OCEAN_FISHING_BONUS } from 'Data/oceanFishing'
import { mapGetters } from 'vuex'
import DATA_CN from 'Data/translation'
import DataUtil from '@/utils/DataUtil'
import IKDRoute from 'Data/locale/IKDRoute'
import ImgUtil from '@/utils/ImgUtil'
import OceanFishingUtil from '@/utils/OceanFishing54/OceanFishingUtil'
import placeNames from 'Data/locale/placeNames'

export default {
  name: 'IKDRouteMixin',
  computed: {
    ...mapGetters([
      'getItemName',
      'getItemIconClass',
      'getAchievementName',
      'getAchievementIconClass',
    ]),
  },
  methods: {
    assembleVoyages(time, n, types, alwaysShowDay = false) {
      return OceanFishingUtil.voyagesWithTipOf(time, n, types).map(
        (voyageWithTip, index, arr) => {
          const showDay =
            alwaysShowDay ||
            index === 0 ||
            DataUtil.getCNTime(voyageWithTip.time).day !==
              DataUtil.getCNTime(arr[index - 1].time).day
          const targets = voyageWithTip.voyageTip.achievements
            .map(it => this.assembleAchievement(it))
            .concat(
              voyageWithTip.locationTips
                .map(locationTip => {
                  return {
                    blueFish: this.assembleItem(locationTip.blueFish),
                  }
                })
                .flatMap(it => {
                  return [it.blueFish]
                })
            )
            .filter(it => it)
          return {
            showDay,
            // simpleName: voyageWithTip.voyageSimpleName,
            id: voyageWithTip.voyageType,
            milliseconds: voyageWithTip.time,
            day: DataUtil.formatDateTime(voyageWithTip.time, 'MM-dd'),
            time: DataUtil.formatDateTime(voyageWithTip.time, 'HH:mm'),
            shiftIcon: DataUtil.shift2Icon(voyageWithTip.shift.type),
            name: DataUtil.getName(IKDRoute[voyageWithTip.shift.routeId]),
            targets: targets,
            typeMission: voyageWithTip.typeMission,
            starMission: voyageWithTip.starMission,
            tugMission: voyageWithTip.tugMission,
            voyageLocations: voyageWithTip.locationTips.map(it => ({
              id: it.fishingSpots.normal,
              spectralCurrentId: it.fishingSpots.spectralCurrent,
              weatherSet: it.weatherSet,
              shift: it.shift,
              name: DataUtil.getName(placeNames[it.locationName]),
              mainName: DataUtil.getName(placeNames[it.locationMainName]),
              subName: DataUtil.getName(placeNames[it.locationSubName]),
              icon: DataUtil.shift2Icon(it.shift),
              hint: it.locationHint,
            })),
          }
        }
      )
    },

    assembleAchievement(achievementId) {
      if (!achievementId) return null
      const achievement = DATA_CN.OCEAN_FISHING_ACHIEVEMENTS[achievementId]
      return {
        id: achievementId,
        name: this.getAchievementName(achievementId),
        icon: this.getAchievementIconClass(achievementId),
        bonus: achievement.bonus,
        bonusRequirement: OCEAN_FISHING_BONUS[achievement.bonus]?.requirement,
        iconUrl: achievement.iconLocal && ImgUtil.getImgUrl(achievement.iconLocal),
        nonTipOptions: achievement.nonTipOptions,
        type: 'achievement',
      }
    },

    assembleItem(itemId) {
      return (
        itemId && {
          id: itemId,
          name: this.getItemName(itemId),
          icon: this.getItemIconClass(itemId),
          type: 'item',
        }
      )
    },
  },
}
