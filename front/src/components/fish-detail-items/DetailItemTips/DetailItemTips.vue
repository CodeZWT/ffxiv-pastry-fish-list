<template>
  <v-expansion-panels hover flat tile v-model="lazyExpansionValue">
    <v-expansion-panel class="system">
      <v-expansion-panel-header class="system">
        <div style="display: flex; justify-content: center">
          <div>
            <v-icon>mdi-book</v-icon>
            查看攻略
          </div>
        </div>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-row no-gutters>
          <v-col cols="12">
            <tip7 :id="fish.id" />
          </v-col>
          <v-col cols="12">
            <tip5 :id="fish.id" />
          </v-col>
          <v-col cols="12">
            <tip3 :id="fish.id" />
          </v-col>
          <v-col cols="12">
            <tip2 :id="fish.id" />
          </v-col>
          <v-col cols="12">
            <tip1 :id="fish.id" />
          </v-col>
          <v-col cols="12">
            <tip4 :id="fish.id" />
          </v-col>
          <v-col cols="12">
            <tip6 :id="fish.id" />
          </v-col>
        </v-row>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
export default {
  name: 'DetailItemTips',
  components: {
    Tip1: () => import('@/components/fish-detail-items/DetailItemTips/Tip1'),
    Tip2: () => import('@/components/fish-detail-items/DetailItemTips/Tip2'),
    Tip3: () => import('@/components/fish-detail-items/DetailItemTips/Tip3'),
    Tip4: () => import('@/components/fish-detail-items/DetailItemTips/Tip4'),
    Tip5: () => import('@/components/fish-detail-items/DetailItemTips/Tip5'),
    Tip6: () => import('@/components/fish-detail-items/DetailItemTips/Tip6'),
    Tip7: () => import('@/components/fish-detail-items/DetailItemTips/Tip7'),
  },
  props: {
    fish: {
      type: Object,
      default: undefined,
    },
    expanded: {
      type: Boolean,
      default: false,
    },
  },
  data: vm => ({
    lazyExpansionValue: vm.expanded ? 0 : undefined,
  }),
  watch: {
    expanded(expanded) {
      this.lazyExpansionValue = expanded ? 0 : undefined
    },
    'fish.id': function() {
      this.lazyExpansionValue = this.expanded ? 0 : undefined
    },
  },
}
</script>

<style lang="sass"></style>
