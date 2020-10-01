<template>
  <div ref="iconWrapper" :style="style"></div>
</template>

<script>
import lottie from 'lottie-web'

export default {
  name: 'lottie-icon',
  props: {
    value: {
      type: Object,
      default: undefined,
      required: true,
    },
    width: {
      type: String, Number,
      default: '100%',
    },
    height: {
      type: String, Number,
      default: '100%',
    },
    playOnLoaded: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    style() {
      return {
        width: isNaN(+this.width) ? this.width : this.width + 'px',
        height: isNaN(+this.height) ? this.height : this.height + 'px',
      }
    },
  },
  mounted() {
    const animation = lottie.loadAnimation({
      container: this.$refs.iconWrapper, // the dom element that will contain the animation
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: this.value,
    })
    if (this.playOnLoaded) {
      animation.play()
    }
  },
}
</script>

<style scoped></style>