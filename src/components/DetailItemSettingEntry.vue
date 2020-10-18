<template>
  <v-card outlined class="rounded-lg my-1">
    <v-card-text class="d-flex justify-space-between align-center">
      <span>{{ $t(`setting.dialog.detailArrangement.itemNames.${setting.name}`) }}</span>
      <v-switch
        v-if="setting.expandedEnabled"
        v-model="setting.expanded"
        :label="$t('setting.dialog.detailArrangement.expand')"
        inset
      />
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'DetailItemSettingEntry',
  props: {
    setting: { type: Object, default: undefined },
  },
}
</script>

<style scoped></style>