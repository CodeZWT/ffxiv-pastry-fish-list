<template>
  <div
    :title="title"
    style="width: 48px; height: 48px; position: relative"
    :class="{ 'zoom-in': small }"
    @click.stop="onClicked"
  >
    <div v-if="!iconUrl" :class="`${iconClass} ${iconPositionClass}`" />
    <div
      v-else
      :class="iconPositionClass"
      :style="`background: url('${iconUrl}') no-repeat;`"
    />
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
      achievementFrame48: ImgUtil.getImgUrl('achievement-icon-frame-48x48.png'),
      checkedCover48: ImgUtil.getImgUrl('item-icon-checked-48x48.png'),
      hatCover48: ImgUtil.getImgUrl('item-cover-hat-48x48.png'),
    }
  },
  computed: {
    coverClass() {
      return this.type === 'item' ? 'item-cover-48' : 'achievement-cover-48'
    },
    iconPositionClass() {
      return this.type === 'item' ? 'item-icon-48' : 'achievement-icon-48'
    },
    cover() {
      return this.type === 'item' ? this.itemCover48 : this.achievementFrame48
    },
  },
  methods: {
    onClicked() {
      this.$emit('checked-updated', !this.checked)
    },
  },
}
</script>

<style scoped>
.zoom-in {
  zoom: 0.75;
  -moz-transform: scale(0.75);
  -moz-transform-origin: 0 0;
}

/*.db-list__item__icon__cover {*/
/*  width: 48px;*/
/*  height: 48px;*/
/*  background: url(/lds/h/J/-A7DYl4vvLtvGz_nshoUsqtrEc.png) no-repeat;*/
/*  position: absolute;*/
/*  top: 0;*/
/*  left: 0;*/
/*}*/
.item-cover-48 {
  width: 48px;
  height: 48px;
  position: absolute;
  top: 0;
  left: 0;
}

/*.db-view__achievement__icon__frame {*/
/*  position: absolute;*/
/*  z-index: 10;*/
/*  width: 48px;*/
/*  height: 48px;*/
/*  background: url(/lds/h/Y/g9-WRQ9Mxx6c37ekifgjQ-nQwY.png) repeat-y 0 0;*/
/*  display: block;*/
/*}*/
.achievement-cover-48 {
  width: 48px;
  height: 48px;
  position: absolute;
}

/*.db-view__achievement__icon__image {*/
/*  position: absolute;*/
/*  z-index: 1;*/
/*  top: 4px;*/
/*  left: 4px;*/
/*}*/
.achievement-icon-48 {
  position: absolute;
  width: 40px;
  height: 40px;
  top: 4px;
  left: 4px;
}

/*.db-list__item__icon__item_image {*/
/*  position: absolute;*/
/*  top: 0px;*/
/*  left: 0px;*/
/*  margin: 2px 0 0 4px;*/
/*}*/
.item-icon-48 {
  position: absolute;
  width: 40px;
  height: 40px;
  top: 0;
  left: 0;
  margin: 2px 0 0 4px;
}

.item-checked-icon-48 {
  width: 48px;
  height: 48px;
  position: absolute;
  top: -2px;
  left: 0;
}
</style>
