<template>
  <div v-if="!loading && itemExtra.item.masterpiece" style="background-color: #1e1e1e">
    <v-subheader class="d-flex justify-space-between">
      <div>
        {{ $t('setting.dialog.detailArrangement.itemNames.DetailItemMasterpiece') }}
      </div>
      <div>{{ lvl }}</div>
    </v-subheader>
    <v-skeleton-loader v-if="loading" type="table-row-divider@3" class="mx-1" />
    <v-simple-table v-else dense class="pt-2" style="background-color: #1e1e1e">
      <template>
        <thead>
          <tr>
            <td class="d-flex align-center justify-center">
              <i class="xiv collectables" style="font-size: 22px" title="收藏品" />
              <span class="ml-1">所需收藏价值</span>
            </td>
            <td>
              <div class="d-flex align-center justify-center">
                <v-img :src="scriptIconUrl" max-height="20" max-width="20" />
                <span class="ml-1">工票</span>
              </div>
            </td>
            <td>
              <div class="d-flex align-center justify-center">
                <v-img :src="expIconUrl" max-height="20" max-width="20" />
                <span class="ml-1">经验值</span>
              </div>
            </td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(s, idx) in masterpieceEntries" :key="idx">
            <td style="text-align: center">
              {{ s.ratingMin }} ~ {{ s.ratingMax || '' }}
            </td>
            <td style="text-align: center">{{ s.script }}</td>
            <td style="text-align: center">{{ s.exp }}</td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </div>
</template>

<script>
import ImgUtil from '@/utils/ImgUtil'

export default {
  name: 'DetailItemMasterpiece',
  components: {},
  props: {
    fish: {
      type: Object,
      default: undefined,
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
  data: () => ({}),
  computed: {
    lvl() {
      const mp = this.itemExtra?.item?.masterpiece
      let s = ''
      if (mp) {
        s += '等级 '
        if (mp.lvl.length === 2) {
          if (mp.lvl[0] === mp.lvl[1]) {
            s += mp.lvl[0]
          } else {
            s += mp.lvl.join('-')
          }
        }
        if (mp.stars) {
          s += ' ' + [...new Array(mp.stars)].map(() => '★').join('')
        }
      }
      return s
    },
    masterpieceEntries() {
      const mp = this.itemExtra?.item?.masterpiece
      if (mp) {
        return mp.rating.map((r, idx) => {
          return {
            ratingMin: r,
            ratingMax: mp.rating[idx + 1] - 1,
            script: mp.rewardAmount[idx],
            exp: mp.xp[idx],
          }
        })
      }
      return []
    },
    scriptIconUrl() {
      if (this.itemExtra?.item?.masterpiece) {
        const reward = this.itemExtra?.item?.masterpiece?.reward
        const script = this.itemExtra?.partials?.find(
          p => p.type === 'item' && +p.id === reward
        )
        return ImgUtil.getIconUrl(script?.obj?.c, true)
      }
      return undefined
    },
    expIconUrl() {
      return ImgUtil.getIconUrl(65001, true)
    },
  },
  methods: {},
}
</script>

<style scoped></style>
