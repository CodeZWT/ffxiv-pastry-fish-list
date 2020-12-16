import ItemIcon from '@/components/basic/ItemIcon'
import _ from 'lodash'
import PinyinMatch from 'pinyin-match'

export default {
  components: { ItemIcon },
  props: {
    voyages: {
      type: Array,
      default: () => [],
    },
    targetOptions: {
      type: Array,
      default: () => [],
    },
  },
  data: () => ({
    voyageNLazy: 13,
    targets: [],
  }),
  computed: {
    selectionOptions() {
      return this.targetOptions.flatMap((group, index) => {
        if (index) {
          return [{ divider: true }, { header: group.type }, ...group.options]
        } else {
          return [{ header: group.type }, ...group.options]
        }
      })
    },
    voyageN: {
      get() {
        return this.voyageNLazy
      },
      set(voyageN) {
        this.voyageNLazy = voyageN
        this.$nextTick(() => {
          let int = Math.floor(+voyageN)
          if (int < 1) int = 1
          else if (int > 100) int = 100
          this.voyageNLazy = int
          this.filterChanged(int, this.targets)
        })
      },
    },
  },
  methods: {
    targetsChanged(targets) {
      this.filterChanged(this.voyageN, targets)
    },
    filterOptions(item, searchText, itemText) {
      if (this.$i18n.locale === 'zh-CN') {
        return PinyinMatch.match(itemText, searchText) !== false
      } else {
        return itemText.toLowerCase().indexOf(searchText.toLowerCase()) > -1
      }
    },
    filterChanged(voyageN, targets) {
      this.$emit('filterChanged', {
        voyageN: voyageN,
        voyageTypes: _.uniq(targets.flatMap(it => it.voyageTypes)),
      })
    },
  },
}
