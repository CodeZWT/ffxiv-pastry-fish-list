<template>
  <div class="fishing-tip6">
    <v-card v-if="tip" outlined tile>
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
          <v-col cols="4">
            <div class="text-subtitle-2" style="font-weight: bold">
              咬钩时间
            </div>
            <div class="text--primary" v-html="tip.biteTime"></div>
          </v-col>
          <v-col cols="8">
            <div class="text-subtitle-2" style="font-weight: bold">
              难度
            </div>
            <v-rating :value="tip.rating" half-increments readonly />
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
import tip6 from 'Data/tip6'

export default {
  name: 'tip6',
  props: ['id'],
  data: () => ({
    explanationDialog: false,
  }),
  computed: {
    meta() {
      return tip6
    },
    tip() {
      return tip6.TIPS[this.id]
    },
  },
}
</script>

<style lang="sass">
.fishing-tip6
  margin-top: 4px
  margin-bottom: 4px

  .red
    color: orangered !important
    background-color: unset !important
</style>
