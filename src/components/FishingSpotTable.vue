<template>
  <v-simple-table>
    <template v-slot:default>
      <thead>
        <tr>
          <th class="text-left">Tug/Fish</th>
          <th v-for="spotFish in value" class="text-left" :key="spotFish.id">
            <v-img :lazy-src="fisher" :src="spotFish.icon" width="36" height="36" />
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="tug in TUGS" :key="tug">
          <td>{{ tug }}</td>
          <th class="text-left" v-for="spotFish in value" :key="spotFish.id">
            {{ spotFish.tug === tug ? 'x' : '' }}
          </th>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
</template>

<script>
import fisher from '@/assets/fisher.png'
import DataUtil from '@/utils/DataUtil'

export default {
  name: 'FishingSpotTable',
  props: {
    value: { type: Array, default: () => [] },
  },
  data() {
    return {
      fisher,
      TUGS: Object.keys(DataUtil.TUG_ICON),
    }
  },
}
</script>

<style scoped></style>
