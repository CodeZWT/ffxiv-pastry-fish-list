import { mapMutations } from 'vuex'
import ClickHelper from '@/components/basic/ClickHelper'
import DataUtil from '@/utils/DataUtil'
import DetailItemMap from '@/components/fish-detail-items/DetailItemMap'
import FishBaitList from '@/components/FishBaitList'
import ImgUtil from '@/utils/ImgUtil'
import ItemIcon from '@/components/basic/ItemIcon'

export default {
  components: { ClickHelper, FishBaitList, DetailItemMap, ItemIcon },
  props: ['spotData'],
  data() {
    return {
      scripsIcon: ImgUtil.getImgUrl('skybuilders-scrips-065073-36x36.png'),
    }
  },
  methods: {
    toFishingSpotData(fishingSpot) {
      return {
        id: -1,
        fishingSpots: [fishingSpot],
      }
    },
    toItemTitle: DataUtil.toItemTitle,
    ...mapMutations(['showSnackbar']),
  },
}
