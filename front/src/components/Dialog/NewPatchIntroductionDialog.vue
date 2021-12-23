<template>
  <rc-dialog v-model="show" persistent max-width="600">
    <v-card>
      <v-card-title>欢迎来到新版鱼糕</v-card-title>
      <v-card-text>
        <div>在<v-badge inline content="1.0.0"></v-badge>中，桌面版进行了较大的改动</div>
        <ul>
          <li>
            现除主窗口以外的所有窗口支持与游戏同步操作。如：可以在鼠标点击窗口的同时操作游戏内角色。
          </li>
          <li>
            渔捞中的输入框获取焦点后需要点击游戏界面才可以恢复游戏焦点接受键盘操作，但如果游戏使用“窗口全屏模式”则可以避免这个问题。
          </li>
          <li>
            增加功能菜单，主窗口，所有渔捞窗口以及设置窗口均可由此访问。
          </li>
          <li>
            <div>
              <div class="d-inline">
                <span>增加功能菜单可以通过鼠标点击渔捞图标</span>
                <img
                  style="height: 24px; width: 24px"
                  src="https://rcstatic.traveleorzea.com/pastry-fish-static-files/img/logo/pastry-fish.webp"
                /><span>或使用快捷键访问。（具体请查看键位设置）</span>
              </div>
            </div>
          </li>
          <li>
            渔捞界面现与主界面深浅色模式配置同步。（渔捞现在也可设置为浅色模式）
          </li>
          <li>
            <div>
              <div>
                {{
                  `窗口默认显示在系统主屏幕，多屏幕用户可在“${$t(
                    'top.screen'
                  )}”中配置显示的屏幕。`
                }}
              </div>
              <v-btn
                color="primary"
                @click="setShowDialog({ dialog: 'screenSettingDialog', show: true })"
              >
                打开 {{ $t('top.screen') }}
              </v-btn>
            </div>
          </li>
          <li>
            主界面可以在多屏幕间自由拖动，其他窗口只会显示在“屏幕设置”配置的屏幕中。
          </li>
        </ul>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="close" text block>关闭</v-btn>
      </v-card-actions>
    </v-card>
  </rc-dialog>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import RcDialog from '@/components/basic/RcDialog'
export default {
  name: 'NewPatchIntroductionDialog',
  components: { RcDialog },
  data() {
    return {
      step: 1,
    }
  },
  computed: {
    ...mapState('dialog', ['newPatchIntroductionDialog']),
    show: {
      get() {
        return this.newPatchIntroductionDialog
      },
      set(show) {
        this.setShowDialog({
          dialog: 'newPatchIntroductionDialog',
          show: show,
        })
      },
    },
  },

  methods: {
    ...mapMutations('flag', ['setFlag']),
    ...mapMutations('dialog', ['setShowDialog']),
    close() {
      this.setFlag({
        key: 'newPatchIntroductionFlag',
        value: true,
      })
      this.show = false
    },
  },
}
</script>

<style scoped></style>
