<template>
  <div
    :title="title"
    :class="{
      'zoom-in': small,
      'item-icon-style': !large,
      'item-icon-style-large': large,
    }"
    @click="onClicked"
  >
    <div v-if="!iconUrl" :class="`${iconClass} ${iconPositionClass}`" />
    <v-img v-else :class="iconPositionClass" :src="iconUrl" />
    <div
      v-if="cover && !checked"
      :class="coverClass"
      :style="`background: url('${cover}') no-repeat;`"
    />
    <div
      v-if="checked"
      class="item-checked-icon-48"
      :style="`background: url('${checkedCover48}') no-repeat;`"
    />
    <div
      v-if="hat"
      class="item-checked-icon-48"
      :style="`background: url('${hatCover48}') no-repeat;`"
    />
  </div>
</template>

<script>
import ImgUtil from '@/utils/ImgUtil'

export default {
  name: 'ItemIcon',
  props: {
    iconClass: {
      type: String,
    },
    iconUrl: {
      type: String,
    },
    title: {
      type: String,
    },
    small: {
      type: Boolean,
      default: false,
    },
    large: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: 'item',
    },
    checked: {
      type: Boolean,
      default: false,
    },
    hat: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      itemCover48: ImgUtil.getImgUrl('item-icon-cover-48x48.png'),
      itemCover96: ImgUtil.getImgUrl('item-icon-cover-96x96.png'),
      achievementFrame48: ImgUtil.getImgUrl('achievement-icon-frame-48x48.png'),
      checkedCover48: ImgUtil.getImgUrl('item-icon-checked-48x48.png'),
      hatCover48: ImgUtil.getImgUrl('item-cover-hat-48x48.png'),
    }
  },
  computed: {
    coverClass() {
      switch (this.type) {
        case 'item':
          return this.large ? 'item-cover-96' : 'item-cover-48'
        case 'action':
        case 'icon':
          return ''
        default:
          return 'achievement-cover-48'
      }
      // return this.type === 'item' ? 'item-cover-48' : 'achievement-cover-48'
    },
    iconPositionClass() {
      switch (this.type) {
        case 'item':
        case 'action':
        case 'icon':
          return this.large ? 'item-icon-96' : 'item-icon-48 item-margin-moz'
        default:
          return 'achievement-icon-48 achievement-margin-moz'
      }
      // return this.type === 'item' ? 'item-icon-48' : 'achievement-icon-48'
    },
    cover() {
      return this.type === 'item'
        ? this.large
          ? this.itemCover96
          : this.itemCover48
        : this.achievementFrame48
    },
  },
  methods: {
    onClicked() {
      this.$emit('checked-updated', !this.checked)
    },
  },
}
</script>

<style lang="sass" scoped>
.zoom-in
  zoom: 0.75
  -moz-transform: scale(0.75)
  -moz-transform-origin: 0 0
.item-icon-style
  position: relative
  height: 48px
  width: 48px
  min-height: 48px
  min-width: 48px
.item-icon-style-large
  position: relative
  height: 96px
  width: 96px
  min-height: 96px
  min-width: 96px
.item-cover-48
  width: 48px
  height: 48px
  position: absolute
  top: 0
  left: 0
.item-cover-96
  width: 96px
  height: 96px
  position: absolute
  top: 0
  left: 0
.achievement-cover-48
  width: 48px
  height: 48px
  position: absolute
.achievement-icon-48
  position: absolute
  width: 80px
  height: 80px
  min-width: 80px
  min-height: 80px
  margin: 8px
  zoom: 0.5
  -moz-transform: scale(0.5)
  -moz-transform-origin: 0 0
.item-icon-48
  position: absolute
  min-width: 80px
  min-height: 80px
  width: 80px
  height: 80px
  top: 0
  left: 0
  margin: 4px 0 0 8px
  zoom: 0.5
  -moz-transform: scale(0.5)
  -moz-transform-origin: 0 0

@-moz-document url-prefix()
  .item-margin-moz
    margin: 2px 0 0 4px !important
  .achievement-margin-moz
    margin: 4px !important
    min-width: 80px
    min-height: 80px

.item-icon-96
  position: absolute
  width: 80px
  height: 80px
  top: 0
  left: 0
  margin: 4px 0 0 8px
.item-checked-icon-48
  width: 48px
  height: 48px
  position: absolute
  top: -2px
  left: 0
</style>
