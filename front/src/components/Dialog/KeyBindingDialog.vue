<template>
  <rc-dialog v-model="showDialog" max-width="600">
    <v-card>
      <v-card-title>
        {{ $t('top.keybinding') }}
      </v-card-title>
      <v-card-text>
        <v-simple-table>
          <tbody>
            <tr v-for="(key, item) in keybindings" :key="item">
              <template v-if="!hiddenItems.includes(item)">
                <td>
                  {{ $t(`keybinding.item.${item}`) }}
                </td>
                <td>{{ key }}</td>
                <td>
                  <rc-tooltip message="修改">
                    <v-btn icon text @click="editHotkey(item, key)"
                      ><v-icon small>{{ mdiPencil }}</v-icon></v-btn
                    >
                  </rc-tooltip>
                </td>
              </template>
            </tr>
          </tbody>
        </v-simple-table>
      </v-card-text>
      <v-card-actions class="d-flex justify-end">
        <v-btn text @click="$emit('input', false)">关闭</v-btn>
      </v-card-actions>
    </v-card>
    <rc-dialog v-model="showEditDialog" max-width="300" persistent autofocus>
      <v-card>
        <v-card-title> 修改快捷键 </v-card-title>
        <v-card-text>
          <div class="d-flex align-center justify-center" style="width: 100%">
            <template v-for="(key, i) in currentControlKeys">
              <kbd :key="key">
                {{ key }}
              </kbd>
              <span class="mx-1" :key="`sep-${i}`">+</span>
            </template>
            <v-text-field
              readonly
              :value="currentMainKey"
              @keydown="setHotkey($event)"
              style="max-width: 36px"
              placeholder="]"
              outlined
              dense
              hide-details
              autofocus
              :error="hasBindingError"
            ></v-text-field>
          </div>
          <div v-show="hasBindingError" class="error--text mt-2">
            设置的快捷键与已有的快捷键冲突
          </div>
        </v-card-text>
        <v-card-actions class="d-flex justify-end">
          <v-btn text @click="cancelSetHotkey">关闭</v-btn>
        </v-card-actions>
      </v-card>
    </rc-dialog>
  </rc-dialog>
</template>

<script>
import { HiddenItems } from '@/entries/screen/store/keybinding'
import { mapMutations, mapState } from 'vuex'
import { mdiPencil } from '@mdi/js'
import RcDialog from '@/components/basic/RcDialog'
import RcTooltip from '@/components/basic/RcTooltip'

export default {
  name: 'KeyBindingDialog',
  components: { RcDialog, RcTooltip },
  model: {
    prop: 'show',
    event: 'input',
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      mdiPencil,
      showEditDialog: false,
      currentControlKeys: [],
      currentMainKey: '',
      hasBindingError: false,
    }
  },
  computed: {
    ...mapState('keybinding', ['keybindings']),
    hiddenItems() {
      return HiddenItems
    },
    showDialog: {
      get() {
        return this.show
      },
      set(show) {
        this.$emit('input', show)
      },
    },
  },
  methods: {
    ...mapMutations('keybinding', ['saveKeybindings']),
    editHotkey(item, hotkey) {
      this.showEditDialog = true
      this.currentControlKeys = hotkey.slice(0, -2).split('+')
      this.currentMainKey = hotkey.slice(-1)
      this.currentItem = item
    },
    setHotkey(event) {
      const hotkey = event.key
      if (hotkey.match(/^[a-zA-Z0-9[\]`;',./\\]$/)) {
        const upperCasedKey = hotkey.toUpperCase()
        const newHotkey = this.currentControlKeys.join('+') + '+' + upperCasedKey
        this.currentMainKey = upperCasedKey
        this.hasBindingError = Object.entries(this.keybindings).some(([item, key]) => {
          return item !== this.currentItem && key === newHotkey
        })
        if (!this.hasBindingError) {
          this.saveKeybindings({
            [this.currentItem]: newHotkey,
          })
          this.showEditDialog = false
        }
      }
    },
    cancelSetHotkey() {
      this.hasBindingError = false
      this.showEditDialog = false
    },
  },
}
</script>

<style scoped></style>
