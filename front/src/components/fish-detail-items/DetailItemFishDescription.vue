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
        <v-skeleton-loader
          v-if="loading"
          type="list-item-three-line, divider, list-item-three-line"
        />
        <template v-else>
          <div class="pb-1">
            <div class="subtitle-2 text--disabled d-flex">
              {{ $t('detail.description.item') }}
              <v-spacer />
              {{ $t('detail.description.ilvl') }}{{ ilvl }}
            </div>
            <div v-html="description"></div>
          </div>
          <v-divider />
          <div class="pt-1">
            <div class="subtitle-2 text--disabled">
              {{ $t('detail.description.fishGuide') }}
            </div>
            <div v-text="fishGuide"></div>
          </div>
          <div class="d-flex justify-end mt-2">
            <a :href="link" target="_blank"> Garland数据</a>
          </div>
        </template>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
import { mdiBookshelf } from '@mdi/js'
import DataUtil from '@/utils/DataUtil'
import EnvMixin from '@/components/basic/EnvMixin'
import garlandService, { toMultiLangDescription, toMultiLangFishGuide } from '@/service/garlandService'

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
    description: '',
    fishGuide: '',
    ilvl: '',
    link: '',
    loading: true,
  }),
  mounted() {},
  watch: {
    'fish._id': {
      handler: async function(itemSpotId) {
        try {
          const id = DataUtil.toItemId(itemSpotId)
          this.loading = true
          const resp = await garlandService.getItem(id)
          this.description = DataUtil.getName(toMultiLangDescription(resp))
          this.fishGuide = DataUtil.getName(toMultiLangFishGuide(resp))
          this.ilvl = resp?.item?.ilvl ?? ''
          this.link = id ? DataUtil.toGarlandItemLink({ id }) : ''
          this.loading = false
        } catch (e) {
          this.description = ''
          this.fishGuide = ''
          this.ilvl = ''
          this.link = ''
        }
      },
      immediate: true,
    },
  },
}
</script>

<style scoped lang="sass">
.emphasis
  font-weight: bold
</style>
