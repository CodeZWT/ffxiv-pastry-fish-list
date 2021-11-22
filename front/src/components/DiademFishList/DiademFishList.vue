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
  props: ['spotData', 'isMobile'],
  computed: {
    component() {
      const mode = this.isMobile ? 'small' : 'large'
      switch (mode) {
        case 'large':
          return 'DiademFishListLarge'
        case 'small':
          return 'DiademFishListSmall'
        default:
          return 'DiademFishListSmall'
      }
    },
  },
}
</script>

<style scoped></style>
