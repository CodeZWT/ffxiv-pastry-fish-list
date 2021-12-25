<template>
  <rc-dialog :value="show" @input="$emit('input', $event)" max-width="600" scrollable>
    <v-card>
      <v-card-title>
        <div>桌面版下载</div>

        <v-btn block>
          <a
            href="https://ricecake302-generic.pkg.coding.net/pastry-fish/desktop-app/PastryFishSetup.exe?version=latest"
            target="_blank"
            class="text-h5"
          >
            <span class="download-link">点击下载最新版本</span>
          </a>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-divider />

        <div class="my-2">
          <div>疑难解答</div>
          <v-expansion-panels :value="undefined" accordion class="my-2 rounded-lg">
            <v-expansion-panel>
              <v-expansion-panel-header>
                已被阻止，因为可能危害你的设备
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <div>
                  如显示：“已被阻止，因为可能危害你的设备。” <br />
                  请点击 ... 按钮并选择“保留”以正常下载。
                </div>
                <v-img :src="keep" />
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-header>
                此应用可能会威胁你的设备
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <div>
                  如显示：“此应用可能会威胁你的设备” <br />
                  请点击 “显示详细信息” 按钮并选择“仍然保留”。
                </div>
                <v-img :src="stillKeep" />
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-header>
                Windows已保护你的电脑
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <div>
                  如显示：“Windows已保护你的电脑” <br />
                  请点击 “更多信息” 按钮并选择“仍要运行”以正常安装。
                </div>
                <v-img :src="stillRun" />
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="$emit('input', false)" color="primary" block>
          关闭
        </v-btn>
      </v-card-actions>
    </v-card>
  </rc-dialog>
</template>

<script>
import ImgUtil from '@/utils/ImgUtil'
import RcDialog from '@/components/basic/RcDialog'

export default {
  name: 'DesktopVersionDialog',
  components: { RcDialog },
  model: {
    prop: 'show',
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      keep: ImgUtil.getImgUrl('keep.webp'),
      stillKeep: ImgUtil.getImgUrl('still-keep.webp'),
      stillRun: ImgUtil.getImgUrl('still-run.webp'),
    }
  },
}
</script>

<style scoped lang="sass"></style>
