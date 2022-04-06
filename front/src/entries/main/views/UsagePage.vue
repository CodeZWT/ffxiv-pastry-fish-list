<template>
  <page-template>
    <v-container>
      <v-tabs v-model="tabIndex" grow>
        <v-tab>{{
          $t('setting.dialog.detailArrangement.itemNames.DetailItemMasterpiece')
        }}</v-tab>
      </v-tabs>
      <v-tabs-items v-model="tabIndex">
        <v-tab-item>
          <v-data-table
            :headers="headers"
            :items="entries"
            multi-sort
            class="elevation-1"
            :items-per-page="-1"
            :sort-by="sortBy"
            :sort-desc="sortDesc"
            item-key="itemId"
            :expanded.sync="expanded"
            @click:row="handleClickRow"
            mobile-breakpoint="0"
          >
            <template v-slot:item.itemId="{ item: { fish, itemIconClass } }">
              <div class="d-flex align-center" style="min-width: 60px">
                <div v-if="isMobile">
                  {{ fish.name }}
                </div>
                <link-list
                  v-else
                  :id="fish.id"
                  :angler-id="fish.anglerFishId"
                  :name="fish.name"
                  :names="fish.names"
                  mode="fish"
                >
                  <v-hover v-slot="{ hover }">
                    <div class="d-flex align-center">
                      <item-icon :icon-class="itemIconClass"> </item-icon>
                      <div
                        :class="`${hover ? 'text-decoration-underline' : ''}`"
                        style="cursor: pointer"
                      >
                        {{ fish.name }}
                      </div>
                    </div>
                  </v-hover>
                </link-list>
              </div>
            </template>
            <template v-slot:item.level="{ item }">
              <div class="d-flex align-center" style="min-width: 40px">
                <div>{{ item.levelText }}</div>
              </div>
            </template>
            <template v-slot:item.collectability="{ item }">
              <div class="d-flex align-center" style="min-width: 50px">
                <div>{{ item.collectabilityText }}</div>
              </div>
            </template>
            <template v-slot:item.scripRewardSort="{ item }">
              <div class="d-flex align-center">
                <div class="mr-1">{{ item.scripReward }}</div>
                <v-img :src="item.currencyIconUrl" max-height="20" max-width="20"></v-img>
              </div>
            </template>
            <template v-slot:item.expReward="{ item }">
              <div class="d-flex align-center">
                <div class="d-flex align-center">
                  <div class="mr-1">{{ item.expReward }}</div>
                  <v-img
                    v-if="!isMobile"
                    :src="item.expIconUrl"
                    max-height="20"
                    max-width="20"
                  ></v-img>
                </div>
              </div>
            </template>

            <template v-slot:expanded-item="{ item }">
              <td :colspan="isMobile ? 1 : 2"></td>

              <td :colspan="isMobile ? 2 : 1">
                <div>{{ item.lowCollectability }} ~ {{ item.midCollectability - 1 }}</div>
                <div>
                  {{ item.midCollectability }} ~ {{ item.highCollectability - 1 }}
                </div>
                <div>{{ item.highCollectability }} ~</div>
              </td>

              <td>
                <div>{{ item.lowScripReward }}</div>
                <div>{{ item.midScripReward }}</div>
                <div>{{ item.highScripReward }}</div>
              </td>

              <td>
                <div>
                  {{ item.lowExpReward.toLocaleString() }}
                </div>
                <div>
                  {{ item.midExpReward.toLocaleString() }}
                </div>
                <div>{{ item.highExpReward.toLocaleString() }}</div>
              </td>
            </template>
          </v-data-table>
        </v-tab-item>
      </v-tabs-items>
    </v-container>
  </page-template>
</template>

<script>
import CollectsShop from 'Data/collectablesShop'
import DataUtil from '@/utils/DataUtil'
import EnvMixin from '@/components/basic/EnvMixin'
import ImgUtil from '@/utils/ImgUtil'
import ItemIcon from '@/components/basic/ItemIcon'
import LinkList from '@/components/basic/LinkList'
import PageTemplate from '@/entries/main/views/PageTemplate'
import _ from 'lodash'

export default {
  name: 'UsagePage',
  components: { PageTemplate, ItemIcon, LinkList },
  mixins: [EnvMixin],
  props: {
    lazyTransformedFishDict: {
      type: Object,
      default: undefined,
    },
  },
  inheritAttrs: false,
  data() {
    return {
      expanded: [],
      tabIndex: 0,
      sortBy: ['level', 'scripRewardSort'],
      sortDesc: [true, true],
      headers: [
        {
          text: '道具',
          align: 'start',
          sortable: true,
          value: 'itemId',
          width: '30%',
        },
        {
          text: '等级',
          align: 'start',
          sortable: true,
          value: 'level',
          width: '10%',
        },
        {
          text: '收藏价值',
          align: 'start',
          sortable: true,
          value: 'collectability',
          width: '20%',
        },
        {
          text: '工票报酬',
          align: 'start',
          sortable: true,
          value: 'scripRewardSort',
          width: '20%',
        },
        {
          text: '经验值报酬',
          align: 'start',
          sortable: true,
          value: 'expReward',
          width: '20%',
        },
      ],
      simpleFishDict: _.keyBy(Object.values(this.lazyTransformedFishDict), it =>
        DataUtil.toItemId(it._id)
      ),
    }
  },
  computed: {
    entries() {
      return CollectsShop.map(it => {
        const fish = this.simpleFishDict[it.Item]
        return {
          fish: fish,
          itemId: it.Item,
          itemIconClass: fish.icon,
          itemText: DataUtil.getItemName(it.Item),
          level: it.LevelMin * 10 + it.Stars,
          levelText:
            (it.LevelMin === it.LevelMax
              ? it.LevelMin
              : it.LevelMin + ' - ' + it.LevelMax) +
            ' ' +
            [...new Array(it.Stars)].map(() => '★').join(''),
          collectability: it.HighCollectability,
          collectabilityText: it.HighCollectability + ' ~',
          scripRewardSort: it.Currency * 10000 + it.HighReward,
          scripReward: it.HighReward,
          currencyIconUrl: ImgUtil.getIconUrl(it.Currency === 4 ? 65069 : 65087, true),
          expIconUrl: ImgUtil.getIconUrl(65001, true),
          expReward: it.ExpHigh.toLocaleString(),

          lowCollectability: it.LowCollectability,
          midCollectability: it.MidCollectability,
          highCollectability: it.HighCollectability,

          lowScripReward: it.LowReward,
          midScripReward: it.MidReward,
          highScripReward: it.HighReward,

          lowExpReward: it.ExpLow,
          midExpReward: it.ExpMid,
          highExpReward: it.ExpHigh,
        }
      })
    },
  },
  methods: {
    handleClickRow(all, { item }) {
      if (this.expanded[0]?.itemId === item.itemId) {
        this.expanded = []
      } else {
        this.expanded = [item]
      }
    },
  },
}
</script>

<style lang="sass" scoped>
.v-data-table::v-deep
  tr
    cursor: pointer
</style>
