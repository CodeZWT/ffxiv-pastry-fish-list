<template>
  <v-expansion-panels hover flat tile v-model="lazyExpansionValue">
    <v-expansion-panel>
      <v-expansion-panel-header>
        <div style="display: flex; justify-content: center">
          <div>
            <v-icon>{{ mdiBook }}</v-icon>
            攻略
          </div>
        </div>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <div v-if="!hasTips(fish.id)" class="text-center">暂无攻略</div>
        <div v-else style="margin: 0 -24px 0 -24px">
          <tip7 :id="fish.id" />
          <tip5 :id="fish.id" />
          <tip3 :id="fish.id" />
          <tip2 :id="fish.id" />
          <tip1 :id="fish.id" />
          <tip4 :id="fish.id" />
          <tip6 :id="fish.id" />
        </div>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
import { BIG_FISH } from 'Data/translation'
import { mdiBook } from '@mdi/js'
import DataUtil from '@/utils/DataUtil'

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
    mdiBook,
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
  methods: {
    hasTips(fishId) {
      return (
        BIG_FISH.includes(fishId) ||
        DataUtil.TIP3_FISH_IDS.includes(fishId) ||
        DataUtil.TIP5_FISH_IDS.includes(fishId)
      )
    },
  },
}
</script>

<style lang="sass"></style>
