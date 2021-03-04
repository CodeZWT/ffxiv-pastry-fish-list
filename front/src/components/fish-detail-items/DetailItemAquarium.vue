<template>
  <v-expansion-panels hover flat tile v-model="lazyExpansionValue">
    <v-expansion-panel class="system">
      <v-expansion-panel-header class="system">
        <div style="display: flex; justify-content: center">
          <div>
            <v-icon>mdi-fishbowl</v-icon>
            水族箱
          </div>
        </div>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <fish-aquarium :fish="fish.aquarium" />
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
import FishAquarium from '@/components/FishAquarium'
export default {
  name: 'DetailItemAquarium',
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
    lazyExpansionValue: vm.expanded ? 0 : undefined,
  }),
}
</script>

<style scoped></style>
