<template>
  <div>
    <component :is="component" :spot-data="spotData" />
  </div>
</template>

<script>
import DiademFishListLarge from '@/components/DiademFishList/DiademFishListLarge'
import DiademFishListSmall from '@/components/DiademFishList/DiademFishListSmall'

export default {
  name: 'DiademFishList',
  components: { DiademFishListLarge, DiademFishListSmall },
  props: ['spotData'],
  computed: {
    isMobile() {
      return this.$vuetify.breakpoint.mobile
    },
    component() {
      const mode = this.isMobile ? 'small' : 'large'
      switch (mode) {
        case 'large':
          return 'DiademFishListLarge'
        case 'small':
          return 'DiademFishListSmall'
        default:
          return 'FishInfoRowLarge'
      }
    },
  },
}
</script>

<style scoped></style>
