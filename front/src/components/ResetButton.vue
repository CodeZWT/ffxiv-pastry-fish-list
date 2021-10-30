<template>
  <rc-dialog v-model="value" persistent max-width="290" scrollable>
    <template v-slot:activator="{ on, attrs }">
      <click-helper v-on="on" v-bind="attrs">
        <v-btn color="error" block>{{ $t('importExport.dialog.reset.btn') }}</v-btn>
      </click-helper>
    </template>
    <v-card>
      <v-card-title class="headline">
        {{ $t('importExport.dialog.reset.title') }}
      </v-card-title>
      <v-card-actions>
        <v-spacer></v-spacer>
        <click-helper @click="value = false">
          <v-btn color="default" text>
            {{ $t('importExport.dialog.reset.cancel') }}
          </v-btn>
        </click-helper>
        <click-helper @click="onReset">
          <v-btn color="error" text>
            {{ $t('importExport.dialog.reset.confirm') }}
          </v-btn>
        </click-helper>
      </v-card-actions>
    </v-card>
  </rc-dialog>
</template>

<script>
import { mapMutations } from 'vuex'
import ClickHelper from '@/components/basic/ClickHelper'
import RcDialog from '@/components/basic/RcDialog'

export default {
  name: 'ResetButton',
  components: { RcDialog, ClickHelper },
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
      this.showSnackbar({
        text: this.$t('importExport.dialog.message.resetSuccess'),
        color: 'success',
      })
    },
    ...mapMutations(['showSnackbar', 'setUserDataToDefault']),
  },
}
</script>

<style scoped></style>
