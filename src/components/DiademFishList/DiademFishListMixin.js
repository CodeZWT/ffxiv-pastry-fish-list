import ClickHelper from '@/components/basic/ClickHelper'
import FishBaitList from '@/components/FishBaitList'
import DetailItemMap from '@/components/fish-detail-items/DetailItemMap'
import ItemIcon from '@/components/basic/ItemIcon'
import DataUtil from '@/utils/DataUtil'
import ImgUtil from '@/utils/ImgUtil'

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
    goToFishAngelPage: DataUtil.goToFishAngelPage,
  },
}
