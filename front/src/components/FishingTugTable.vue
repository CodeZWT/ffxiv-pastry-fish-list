<template>
  <v-simple-table dense class="rounded-lg pt-2 elevation-4 inner">
    <template v-slot:default>
      <thead>
        <tr>
          <th class="text-left">{{ $t('tugTable.tugFish') }}</th>
          <th
            v-for="(fish, index) in fishTugList"
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
        <tr v-for="tug in TUGS" :key="tug">
          <td>{{ $t('tug.' + tug) }}</td>
          <td
            v-for="(spotFish, index) in fishTugList"
            :key="spotFish.id"
            @mouseover="onCellHover(index)"
            @mouseout="onCellHoverEnd(index)"
            class="text-center"
          >
            <v-icon v-show="spotFish.tug === tug">mdi-fish</v-icon>
          </td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
</template>

<script>
import DataUtil from '@/utils/DataUtil'
import ItemIcon from '@/components/basic/ItemIcon'
import _ from 'lodash'

export default {
  name: 'FishTugTable',
  components: { ItemIcon },
  props: {
    value: { type: Array, default: () => [] },
  },
  data() {
    return {
      TUGS: Object.keys(DataUtil.TUG_ICON),
      currentCol: -1,
    }
  },
  computed: {
    fishTugList() {
      return this.value.map(it => {
        return {
          id: it.id,
          name: it.name,
          icon: it.icon,
          tug: _.last(it.baits)?.tug,
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
