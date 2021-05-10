<template>
  <div>
    <div :class="`meter rounded justify-center`" style="display: flex">
      <!--      <div-->
      <!--        :class="`range-block ${color}`"-->
      <!--        :style="`left: ${left}%; width: ${length}%;`"-->
      <!--      ></div>-->
      <div class="theme--dark" style="z-index: 2; font-weight: bolder">
        {{ value }} / {{ total }}
      </div>
      <template v-for="(tick, index) in ticks">
        <div
          :key="index"
          :class="`range-block error`"
          :style="
            `left: ${posOfTick(tick.data[0])}%; width: ${pointerWidth}%;z-index: 1;`
          "
        ></div>
      </template>
      <div
        :class="`range-block rounded-l ${color}`"
        :style="`left: 0; width: ${pointerPos}%;z-index: 0;`"
      />
    </div>
    <div class="d-flex justify-center" style="height: 25px; position: relative">
      <template v-for="(tick, index) in ticks">
        <v-menu
          :key="index"
          open-on-hover
          open-delay="300"
          close-deplay="300"
          bottom
          offset-y
        >
          <template v-slot:activator="{ on, attrs }">
            <div
              v-bind="attrs"
              v-on="on"
              class="tick-text"
              :style="
                `position: absolute; right: ${100 - posOfTick(tick.data[0])}%; top: ${
                  tick.nextLine ? '16px' : 0
                }`
              "
            >
              {{ tick.data[0] }}
            </div>
          </template>
          <v-card max-width="300">
            <v-card-title>
              {{ tick.name_chs }}
            </v-card-title>
            <v-card-subtitle>
              {{ tick.description }}
            </v-card-subtitle>
            <v-card-text>
              <template v-if="tick.item">
                <v-subheader class="pl-0">
                  获得物品
                </v-subheader>
                <div
                  class="d-flex align-center"
                  :data-ck-item-id="toItemIdIfExisted(tick.item.id, tick.item.title)"
                >
                  <item-icon :icon-url="tick.item.iconUrl" />
                  <span>{{ tick.item.title }}</span>
                </div>
              </template>
              <div v-if="tick.title">
                <v-subheader class="pl-0">
                  获得称号
                </v-subheader>
                <div class="subtitle-1" style="text-align: center">
                  {{ tick.title }}
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-menu>
      </template>
    </div>
  </div>
</template>

<script>
// import DataUtil from '@/utils/DataUtil'

import ItemIcon from '@/components/basic/ItemIcon'
import DataUtil from '@/utils/DataUtil'
export default {
  name: 'AchievementProgress',
  components: { ItemIcon },
  props: {
    value: {
      type: Number,
      default: 0,
    },
    color: {
      type: String,
      default: 'info',
    },
    total: {
      type: Number,
      default: 0,
    },
    ticks: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    pointerWidth() {
      return 0.4
    },
    // left() {
    //   return (this.min / this.total) * 100
    // },
    // length() {
    //   return Math.max(((this.max - this.min) / this.total) * 100, 0.5)
    // },
    pointerPos() {
      const pos = (this.value / this.total) * 100
      return pos > 100 ? 100 : pos
    },
  },
  methods: {
    posOfTick(value) {
      const pos = (value / this.total) * 100
      return pos > 100 ? 100 : pos
    },
    toItemIdIfExisted: DataUtil.toItemIdIfExisted,
  },
}
</script>

<style lang="sass" scoped>
.meter
  height: 25px
  position: relative
  background: rgba(151, 157, 172, 0.42)

.tick-wrapper
  height: 25px
  position: relative
  display: flex

.tick-text
  position: absolute
  height: 100%

.range-block
  position: absolute
  height: 100%
  text-align: center

  &.pointer
    background: #ff006e
    box-shadow: 0 0 6px 2px #ff006e
</style>
