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
import { toMultiLangDescription, toMultiLangFishGuide } from '@/service/garlandService'
import DataUtil from '@/utils/DataUtil'
import EnvMixin from '@/components/basic/EnvMixin'

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
    itemExtra: {
      type: Object,
      default: undefined,
    },
    loading: {
      type: Boolean,
      default: true,
    },
  },
  data: vm => ({
    mdiBookshelf,
    lazyExpansionValue: vm.expanded ? 0 : undefined,
    description: '',
    fishGuide: '',
    ilvl: '',
    link: '',
  }),
  watch: {
    itemExtra: {
      handler: function(resp) {
        if (resp) {
          const id = resp.item.id
          this.description = DataUtil.getName(toMultiLangDescription(resp))
          this.fishGuide = DataUtil.getName(toMultiLangFishGuide(resp))
          this.ilvl = resp?.item?.ilvl ?? ''
          this.link = id ? DataUtil.toGarlandItemLink({ id }) : ''
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
