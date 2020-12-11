<template>
  <v-dialog :value="show" @input="closeDialog" max-width="600px" persistent>
    <v-card>
      <v-card-title> 网站迁移公告 </v-card-title>
      <v-card-text>
        <div class="text-h6">
          为了提供更稳定的服务，鱼糕已迁移至新站点。点击下方按钮，将跳转并同时将数据迁移至新站。
        </div>
        <p />
        <div>数据迁移后，旧站点的数据还会保留。</div>
        <div>旧站点页面也会保留一段时间，但是不会有新的功能更新。</div>
        <div class="mt-2">
          <v-btn color="primary" @click="goMigration" block x-large>
            迁移数据并前往新站点
          </v-btn>
        </div>
      </v-card-text>
      <v-card-text>
        <v-btn block @click="closeDialog" :disabled="migrationCancelCountdown > 0">
          放弃({{ migrationCancelCountdown }})
        </v-btn>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'MigrateToTravelEorzeaDialog',
  model: {
    prop: 'show',
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    source: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      migrationCancelCountdown: 20,
    }
  },
  created() {
    const timerId = setInterval(() => {
      this.migrationCancelCountdown--
      if (this.migrationCancelCountdown <= 0) {
        clearInterval(timerId)
      }
    }, 1000)
  },
  methods: {
    goMigration() {
      window.location.href = `https://ricecake.traveleorzea.com/#/migration?source=${this.source}`
    },
    closeDialog() {
      this.$emit('input', false)
    },
  },
}
</script>

<style scoped></style>
