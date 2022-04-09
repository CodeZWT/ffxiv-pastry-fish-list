<template>
  <v-expansion-panels hover flat tile v-model="lazyExpansionValue">
    <v-expansion-panel>
      <v-expansion-panel-header>
        <div style="display: flex; justify-content: center">
          <div>
            <v-icon>{{ mdiFishbowl }}</v-icon>
            {{ $t('setting.dialog.detailArrangement.itemNames.DetailItemAquarium') }}
          </div>
        </div>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <fish-aquarium :fish="fish.aquarium" class="mt-2" :is-mobile="isMobile" />
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
import { mdiFishbowl } from '@mdi/js'
import EnvMixin from '@/components/basic/EnvMixin'
import FishAquarium from '@/components/FishAquarium'

export default {
  name: 'DetailItemAquarium',
  mixins: [EnvMixin],
  components: { FishAquarium },
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
    mdiFishbowl,
    lazyExpansionValue: vm.expanded ? 0 : undefined,
  }),
  created() {},
}
</script>

<style scoped></style>
