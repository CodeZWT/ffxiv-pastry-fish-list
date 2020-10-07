<template>
  <v-dialog v-model="value" persistent max-width="290" scrollable>
    <template v-slot:activator="{ on, attrs }">
      <v-btn color="tertiary" block v-bind="attrs" v-on="on">{{ $t('importExport.dialog.reset.btn') }}</v-btn>
    </template>
    <v-card>
      <v-card-title class="headline">
        {{ $t('importExport.dialog.reset.title') }}
      </v-card-title>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="default" text @click="value = false">
          {{ $t('importExport.dialog.reset.cancel') }}
        </v-btn>
        <v-btn color="tertiary" text @click="onReset">
          {{ $t('importExport.dialog.reset.confirm') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  name: 'ResetButton',
  // props: {
  //   value: {
  //     type: Boolean,
  //     default: false,
  //   },
  // },
  data: () => ({
    value: false,
  }),
  methods: {
    onReset() {
      this.setUserDataToDefault()
      this.value = false
      this.showSnackbar({ text: this.$t('importExport.dialog.message.resetSuccess'), color: 'success' })
    },
    ...mapMutations(['showSnackbar', 'setUserDataToDefault']),
  },
}
</script>

<style scoped></style>