<template>
  <div>
    <v-row no-gutters v-if="hasTips">
      <v-col cols="12">
        <div class="subtitle-1 mx-4">攻略</div>
      </v-col>
      <v-col cols="12">
        <tip1 :id="fish.id" />
      </v-col>
      <v-col cols="12">
        <tip2 :id="fish.id" />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import Tip1 from '@/components/fish-detail-items/DetailItemTips/Tip1'
import Tip2 from '@/components/fish-detail-items/DetailItemTips/Tip2'
import tip1Data from '@/store/tip1.json'
import tip2Data from '@/store/tip2.json'

export default {
  name: 'DetailItemTips',
  components: { Tip1, Tip2 },
  props: ['fish'],
  computed: {
    hasTips() {
      return tip1Data[this.fish.id] || tip2Data[this.fish.id]
    },
  },
}
</script>

<style lang="sass"></style>
