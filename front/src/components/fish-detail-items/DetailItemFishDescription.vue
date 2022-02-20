<template>
  <v-expansion-panels hover flat tile v-model="lazyExpansionValue">
    <v-expansion-panel class="system">
      <v-expansion-panel-header class="system">
        <div style="display: flex; justify-content: center">
          <div>
            <v-icon>{{ mdiBookshelf }}</v-icon>
            {{
              $t('setting.dialog.detailArrangement.itemNames.DetailItemFishDescription')
            }}
          </div>
        </div>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        {{ description }}
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
import { mdiBookshelf } from '@mdi/js'
import EnvMixin from '@/components/basic/EnvMixin'
import garlandService from '@/service/garlandService'

export default {
  name: 'DetailItemFishDescription',
  mixins: [EnvMixin],
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
    mdiBookshelf,
    lazyExpansionValue: vm.expanded ? 0 : undefined,
    description: 'test',
  }),
  async mounted() {
    const fish = garlandService.getItem(this.fish._id)
    this.description = JSON.stringify(fish)
  },
}
</script>

<style scoped></style>
