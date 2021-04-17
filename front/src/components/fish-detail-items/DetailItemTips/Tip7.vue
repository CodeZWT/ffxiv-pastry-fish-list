<template>
  <div class="fishing-tip6">
    <v-card v-if="tip" outlined>
      <v-card-subtitle>
        <div class="text-subtitle-1">
          <a :href="meta.link" target="_blank">
            {{ meta.title }}
          </a>
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
            <div class="text-subtitle-2" style="font-weight: bold">钓饵</div>
            <div class="text--primary" v-html="tip.bait"></div>
          </v-col>
          <v-col cols="12">
            <div class="text-subtitle-2" style="font-weight: bold">参考钓法</div>
            <div class="text--primary" v-html="tip.trick"></div>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <div class="text-subtitle-2" style="font-weight: bold">鱼眼被删除后</div>
            <div class="text--primary" v-html="tip.comment"></div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>
<script>
import tip from 'Data/tip7'

export default {
  name: 'tip6',
  props: ['id'],
  data: () => ({
    explanationDialog: false,
  }),
  computed: {
    meta() {
      return tip
    },
    tip() {
      return tip.TIPS[this.id]
    },
  },
}
</script>

<style lang="sass">
.fishing-tip6
  margin-top: 4px
  margin-bottom: 4px

  .tomato
    color: orangered !important
    background-color: unset !important
</style>
