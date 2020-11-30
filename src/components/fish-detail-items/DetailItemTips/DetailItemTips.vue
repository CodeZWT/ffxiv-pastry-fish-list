<template>
  <v-row no-gutters>
    <v-col cols="12">
      <div class="subtitle-1 mx-4">攻略</div>
    </v-col>
    <v-col cols="12">
      <tip2 :id="fish.id" />
    </v-col>
  </v-row>
</template>

<script>
import Tip2 from '@/components/fish-detail-items/DetailItemTips/Tip2'

export default {
  name: 'DetailItemTips',
  components: { Tip2 },
  props: ['fish'],
}
</script>

<style lang="sass"></style>
