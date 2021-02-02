<template>
  <div class="home">
    <FisherStatus :now="now" />
  </div>
</template>

<script>
// @ is an alias to /src
import FisherStatus from '../components/FisherStatus'

export default {
  name: 'Home',
  components: {
    FisherStatus,
  },
  props: ['now'],
}
</script>
