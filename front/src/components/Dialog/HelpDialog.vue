<template>
  <rc-dialog
    :value="showHelpDialog"
    @input="$emit('input', $event)"
    :fullscreen="isMobile"
    max-width="1264px"
    scrollable
  >
    <v-card>
      <v-card-title>
        {{ $t('top.help') }}
      </v-card-title>
      <v-divider />
      <v-card-text>
        <div>
          <h2><a class="md-header-anchor"></a><span>浏览器支持</span></h2>
          <p>
            <strong><span>不支持</span></strong
            ><span>IE浏览器</span>
          </p>
          <p>手机版Safari浏览器可能会出现无法打开的问题</p>
          <h2>
            <a class="md-header-anchor"></a>
            <span>
              在ACT上使用（推荐使用桌面版，ACT只作为一种可行的方法，不支持桌面版特有的功能）
            </span>
          </h2>
          <h3><a class="md-header-anchor"></a><span>步骤</span></h3>
          <p><span>通过使用ACT的ngld悬浮窗插件可以加载本网站。</span></p>
          <ol start="">
            <li>
              <p><span>确保安装了ACT以及ngld悬浮窗插件</span></p>
              <ul>
                <li><span>Advanced Combat Tracker</span></li>
                <li><span>ngld/OverlayPlugin</span></li>
              </ul>
            </li>
            <li>
              <p>
                <span>选择 </span><code>插件</code><span> - </span
                ><code>ngld悬浮窗插件</code><span>，点击下方</span><code>新建</code
                ><span>按钮，在出现的对话框中</span>
              </p>
              <ul>
                <li>
                  <p><span>名称：输入任意字符串</span></p>
                </li>
                <li>
                  <p><span>预设：自订</span></p>
                </li>
                <li>
                  <p><span>种类：数据统计</span></p>
                  <p>
                    <img
                      :src="helpImages[0]"
                      referrerpolicy="no-referrer"
                      alt="act-create-ngld-item"
                    />
                  </p>
                </li>
              </ul>
            </li>
            <li>
              <p>
                <span>在左侧栏位中选择上一步新建的悬浮窗，在 </span>
                <code>悬浮窗路径</code><span>处填入 </span>
                <code>https://ricecake.traveleorzea.com</code>
                <span
                  >，点击重新加载。界面默认会显示在屏幕左上角。将鼠标移动至右下角白色三角处可以调整界面大小。(此处勾选</span
                >
                <code>锁定悬浮窗</code>
                <span>可以正常使用设置中的拖动条)</span>
              </p>
              <p>
                <img :src="helpImages[1]" alt="act-config-ngld-item" style="zoom: 80%" />
              </p>
            </li>
            <li>
              <p>
                <span>点击 </span><code>ACTWS</code>
                <span>，勾选</span>
                <code>此悬浮窗需要使用ACTWebDocket</code>
                <span>，</span>
                <strong><span>不</span></strong> <span>勾选</span>
                <code>不焦点此悬浮窗</code>
                <span>
                  。这样在游戏中点击窗口时会将焦点设置为悬浮窗，这样便能够正常输入了。
                </span>
              </p>
            </li>
          </ol>
          <p>
            <img :src="helpImages[2]" alt="act-config-advance" style="zoom: 80%" />
          </p>
          <h3><a class="md-header-anchor"></a><span>ACT可用的一些配置</span></h3>
          <ul>
            <li>
              <p>
                <span
                  >设置中可以调节透明度(ACT悬浮窗设置中勾选锁定悬浮窗可以正常使用拖动条，也可以直接点击绿线或输入值来设置)</span
                >
              </p>
              <p>
                <img
                  :src="helpImages[3]"
                  referrerpolicy="no-referrer"
                  alt="opacity-setting"
                />
              </p>
            </li>
            <li>
              <p><span>点击钓鱼时钟旁的鱼的图标可以缩小界面</span></p>
              <p>
                <img :src="helpImages[4]" referrerpolicy="no-referrer" alt="collapse" />
              </p>
            </li>
          </ul>
          <h3><a class="md-header-anchor"></a><span>通过ACT使用时的一些限制</span></h3>
          <ul>
            <li>
              <span>
                由于输入会被游戏捕捉，需要设置ACTWS。但是即使设置了，也无法使用输入法，作为后备方案，搜索框同时也支持拼音搜索。
              </span>
            </li>
            <li>
              <span>当网站版本更新时，需要再次使用配置界面中</span><code>重新加载</code
              ><span>功能刷新页面，（浏览器中直接</span><code>F5</code><span>或</span
              ><code>Ctrl+F5</code><span>）。</span>
            </li>
          </ul>
        </div>
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <div class="d-flex flex-column flex-fill">
          <click-helper @click="$emit('input', false)">
            <v-btn color="default" block text>{{ $t('general.dialog.close') }}</v-btn>
          </click-helper>
        </div>
      </v-card-actions>
    </v-card>
  </rc-dialog>
</template>

<script>
import ClickHelper from '@/components/basic/ClickHelper'
import EnvMixin from '@/components/basic/EnvMixin'
import RcDialog from '@/components/basic/RcDialog'

export default {
  name: 'HelpDialog',
  mixins: [EnvMixin],
  components: { RcDialog, ClickHelper },
  model: {
    prop: 'showHelpDialog',
  },
  props: {
    showHelpDialog: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    helpImages() {
      // const images = []
      // for (let i = 1; i <= 5; i++) {
      //   images.push(ImgUtil.getImgUrl(`help-${i}.jpg`))
      // }
      return [null, null, null, null, null]
    },
  },
}
</script>

<style scoped></style>
