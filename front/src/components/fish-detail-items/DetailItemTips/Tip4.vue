<template>
  <div class="fishing-tip4">
    <v-card v-if="tip" outlined>
      <v-card-subtitle>
        <div class="text-subtitle-1">
          {{ meta.title }}
        </div>
        <div class="d-flex">
          <div>
            <div>{{ meta.author }}</div>
            <div>更新时间：{{ meta.lastUpdate }}</div>
          </div>
        </div>
      </v-card-subtitle>
      <v-divider />
      <v-card-text>
        <v-row>
          <v-col cols="12">
            <div class="text-subtitle-2" style="font-weight: bold">
              咬钩时间（包括脱钩）
            </div>
            <div class="text--primary" v-html="tip.biteTime"></div>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <div class="text-subtitle-2" style="font-weight: bold">参考钓法</div>
            <div class="text--primary" v-html="tip.trick"></div>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <div class="text-subtitle-2" style="font-weight: bold">其他</div>
            <div class="text--primary" v-html="tip.comment"></div>
            <div class="text--primary mt-1" v-html="tip.comment2"></div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>
<script>
import tip4 from 'Data/tip4'

export default {
  name: 'tip4',
  props: ['id'],
  data: () => ({
    explanationDialog: false,
  }),
  computed: {
    meta() {
      return tip4
    },
    tip() {
      return tip4.TIPS[this.id]
    },
  },
}
</script>

<style lang="sass">
.fishing-tip4
  margin-top: 4px
  margin-bottom: 4px

  .red
    color: orangered !important
    background-color: unset !important
</style>
