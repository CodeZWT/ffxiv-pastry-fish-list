<template>
  <v-simple-table dense class="rounded-lg pt-2 elevation-2 inner">
    <template v-slot:default>
      <thead>
        <tr>
          <th class="text-left">{{ $t('gigTable.gigFish') }}</th>
          <th
            v-for="(fish, index) in fishGigList"
            :key="fish.id"
            :class="{ primary: currentCol === index }"
          >
            <item-icon
              :icon-class="fish.icon"
              :title="`${fish.name}#${fish.id}`"
              style="margin: auto"
            />
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="gig in GIGS" :key="gig">
          <td><item-icon :icon-class="GIG_ICON[gig]" :title="$t('gig.' + gig)" /></td>
          <td
            v-for="(spotFish, index) in fishGigList"
            :key="spotFish.id"
            @mouseover="onCellHover(index)"
            @mouseout="onCellHoverEnd(index)"
            class="text-center"
          >
            <v-icon v-show="spotFish.gig === 'all' || spotFish.gig === gig">{{
              mdiFish
            }}</v-icon>
          </td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
</template>

<script>
import { mdiFish } from '@mdi/js'
import DataUtil from '@/utils/DataUtil'
import ItemIcon from '@/components/basic/ItemIcon'

export default {
  name: 'FishGigTable',
  components: { ItemIcon },
  props: {
    value: { type: Array, default: () => [] },
  },
  data() {
    return {
      mdiFish,
      GIGS: Object.keys(DataUtil.GIG_ICON).filter(it => it !== 'all'),
      GIG_ICON: DataUtil.GIG_ICON,
      currentCol: -1,
    }
  },
  computed: {
    fishGigList() {
      return this.value.map(it => {
        return {
          id: it.id,
          name: it.name,
          icon: it.icon,
          gig: it.gig.type,
        }
      })
    },
  },
  methods: {
    onCellHover(index) {
      this.currentCol = index
    },
    onCellHoverEnd(index) {
      if (this.currentCol === index) {
        this.currentCol = -1
      }
    },
  },
}
</script>

<style lang="sass" scoped>
.highlight-cell
  background-color: grey
</style>
