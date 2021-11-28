import { mapGetters, mapMutations } from 'vuex'

export default {
  computed: {
    ...mapGetters(['toBeNotifiedIKDRoutes']),
  },
  methods: {
    ...mapMutations(['setIKDRouteToBeNotified']),
    hasAlarm(routeId) {
      return this.toBeNotifiedIKDRoutes.includes(routeId)
    },
    setAlarm(routeId, toBeNotified) {
      this.setIKDRouteToBeNotified({ routeId, toBeNotified })
    },
    onVoyageSelected(event) {
      this.$emit('onVoyageSelected', event)
    },
  },
}
