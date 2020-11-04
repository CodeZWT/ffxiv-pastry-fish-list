<template>
  <v-simple-table dense>
    <template v-slot:default>
      <thead>
        <tr>
          <th class="text-left">{{ $t('tugTable.tugFish') }}</th>
          <th v-for="fish in fishTugList" class="text-left" :key="fish.id">
            <div :class="fish.icon" :title="`${fish.name}#${fish.id}`" />
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="tug in TUGS" :key="tug">
          <td>{{ $t('tug.' + tug) }}</td>
          <th class="text-left" v-for="spotFish in fishTugList" :key="spotFish.id">
            <v-icon v-show="spotFish.tug === tug">mdi-fish</v-icon>
          </th>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
</template>

<script>
import fisher from '@/assets/fisher.png'
import DataUtil from '@/utils/DataUtil'
import _ from 'lodash'

export default {
  name: 'FishTugTable',
  props: {
    value: { type: Array, default: () => [] },
  },
  data() {
    return {
      fisher,
      TUGS: Object.keys(DataUtil.TUG_ICON),
    }
  },
  computed: {
    fishTugList() {
      return this.value.map(it => {
        return {
          id: it.id,
          name: it.name,
          icon: it.icon,
          tug: _.last(it.baits).tug,
        }
      })
    },
  },
}
</script>

<style scoped></style>