<template>
  <rc-dialog :value="show" @input="$emit('input', $event)" max-width="300" autofocus>
    <v-card v-if="!isRoseMode">
      <v-card-title>请输入暗号</v-card-title>
      <v-card-text>
        <v-text-field v-model="code" autofocus />
      </v-card-text>
      <v-card-actions>
        <v-btn block @click="check">确认</v-btn>
      </v-card-actions>
    </v-card>

    <v-card v-else>
      <v-card-title>内部测试</v-card-title>
      <v-card-text v-if="mode === 'LoginSignup'">
        <v-tabs v-model="loginRegisterIndex" fixed-tabs>
          <v-tab> 登录 </v-tab>
          <v-tab> 注册 </v-tab>
        </v-tabs>
        <v-tabs-items v-model="loginRegisterIndex">
          <v-tab-item>
            <div class="ma-2">
              <validation-observer ref="login" v-slot="{ invalid, handleSubmit }">
                <form @submit.prevent="handleSubmit(login)">
                  <validation-provider
                    v-slot="{ errors }"
                    name="username"
                    rules="required|email"
                  >
                    <v-text-field
                      v-model="username"
                      :error-messages="errors"
                      label="邮箱"
                      required
                    ></v-text-field>
                  </validation-provider>

                  <validation-provider
                    v-slot="{ errors }"
                    name="password"
                    rules="required"
                  >
                    <v-text-field
                      v-model="password"
                      :error-messages="errors"
                      type="password"
                      label="密码"
                      required
                    ></v-text-field>
                  </validation-provider>

                  <v-btn
                    class="mr-4"
                    type="submit"
                    :disabled="invalid"
                    color="primary"
                    block
                    :loading="loading"
                  >
                    登录
                  </v-btn>
                </form>
              </validation-observer>
            </div>
          </v-tab-item>
          <v-tab-item>
            <div class="ma-2">
              <validation-observer ref="signup" v-slot="{ invalid, handleSubmit }">
                <form @submit.prevent="handleSubmit(signup)">
                  <validation-provider
                    v-slot="{ errors }"
                    name="username"
                    rules="required|email"
                  >
                    <v-text-field
                      v-model="username"
                      :error-messages="errors"
                      label="邮箱"
                      required
                    ></v-text-field>
                  </validation-provider>
                  <validation-provider
                    v-slot="{ errors }"
                    name="nickname"
                    rules="required|max:10"
                  >
                    <v-text-field
                      v-model="nickname"
                      :counter="10"
                      :error-messages="errors"
                      label="昵称"
                      required
                    ></v-text-field>
                  </validation-provider>
                  <validation-provider
                    v-slot="{ errors }"
                    name="password"
                    rules="required|password"
                  >
                    <v-text-field
                      v-model="password"
                      :error-messages="errors"
                      type="password"
                      label="密码"
                      required
                    ></v-text-field>
                  </validation-provider>

                  <validation-provider
                    v-slot="{ errors }"
                    name="confirmPassword"
                    rules="required|confirm:@password"
                  >
                    <v-text-field
                      v-model="confirmPassword"
                      :error-messages="errors"
                      type="password"
                      label="再次输入密码"
                      required
                    ></v-text-field>
                  </validation-provider>

                  <v-btn
                    class="mr-4"
                    type="submit"
                    :disabled="invalid"
                    color="primary"
                    block
                    :loading="loading"
                  >
                    注册
                  </v-btn>
                </form>
              </validation-observer>
            </div>
          </v-tab-item>
        </v-tabs-items>
      </v-card-text>
      <v-card-text v-else-if="mode === 'ConfirmEmail'">
        验证邮件已发送至注册邮箱
        <validation-observer ref="confirmEmail" v-slot="{ invalid, handleSubmit }">
          <form @submit.prevent="handleSubmit(confirmEmail)">
            <validation-provider
              v-slot="{ errors }"
              name="confirmEmailToken"
              rules="required"
            >
              <v-text-field
                v-model="confirmEmailToken"
                :error-messages="errors"
                label="请输入验证邮件中的验证码"
                required
              ></v-text-field>
            </validation-provider>

            <v-btn
              class="mr-4"
              type="submit"
              :disabled="invalid"
              color="primary"
              block
              :loading="loading"
            >
              验证
            </v-btn>

            <v-btn
              class="mr-4 my-1"
              type="submit"
              color="default"
              text
              block
              :loading="loading"
              :disabled="nextSendInterval > 0"
              @click="resendConfirmEmailToken"
            >
              重新发送验证码 {{ nextSendInterval > 0 ? `(${nextSendInterval})` : '' }}
            </v-btn>
          </form>
        </validation-observer>
      </v-card-text>
      <v-card-text v-else-if="mode === 'LoginSuccess'">
        <div class="d-flex flex-column align-center">
          <div class="my-2">
            <v-icon>mdi-check-circle</v-icon>
            <span class="ml-1 subtitle-1">登录成功</span>
          </div>
          <template v-if="isElectron">
            <div>
              <v-sheet outlined class="pa-5 d-flex flex-column align-center">
                <div class="text-h6">已上传/总数</div>
                <div class="text-h6">{{ uploadStatus }}</div>
                <v-tooltip bottom color="secondary">
                  <template v-slot:activator="{ on, attrs }">
                    <div v-bind="attrs" v-on="on">
                      <v-btn @click="refreshUploadStatus">
                        <v-icon>mdi-refresh</v-icon>
                        刷新
                      </v-btn>
                    </div>
                  </template>
                  <div style="min-height: 32px" class="d-flex align-center">
                    打开对话框时也会重新统计
                  </div>
                </v-tooltip>
              </v-sheet>
            </div>
            <div class="my-1">* 上传功能更新前的数据忽略</div>
          </template>
        </div>
        <v-btn block @click="close" class="mt-4">关闭</v-btn>
        <v-btn block @click="logout" class="mt-4" color="error">登出</v-btn>
      </v-card-text>
      <v-card-actions v-if="isTest">
        <v-btn @click="exit">退出上传模式</v-btn>
      </v-card-actions>
    </v-card>
  </rc-dialog>
</template>

<script>
import {
  ValidationObserver,
  ValidationProvider,
  extend,
  setInteractionMode,
} from 'vee-validate'
import { email, max, required } from 'vee-validate/dist/rules'
import { mapGetters, mapMutations } from 'vuex'
import EnvMixin from '@/components/basic/EnvMixin'
import LocalStorageUtil from '@/utils/LocalStorageUtil'
import RcDialog from '@/components/basic/RcDialog'
import UploadUtil from '@/utils/UploadUtil'
import rcapiService, {
  RC_ACCESS_TOKEN_KEY,
  TEMP_RC_ACCESS_TOKEN_KEY,
} from '@/service/rcapiService'

setInteractionMode('eager')

extend('required', {
  ...required,
  message: '不能为空',
})

extend('max', {
  ...max,
  message: '最多{length}个字符',
})

extend('email', {
  ...email,
  message: '邮箱地址格式不正确',
})

extend('password', value => {
  const regexp = new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$')
  if (regexp.test(value)) return true

  return '至少8位，至少包括1个小写字母，1个大写字母，一个数字'
})

extend('confirm', {
  params: ['target'],
  validate(value, { target }) {
    return value === target
  },
  message: '两次输入密码不同',
})

const DEFAULT_RESEND_TIME = 60000

export default {
  name: 'RoseModeDialog',
  mixins: [EnvMixin],
  components: { RcDialog, ValidationObserver, ValidationProvider },
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
      code: undefined,
      nickname: undefined,
      password: undefined,
      confirmPassword: undefined,
      username: undefined,
      loginRegisterIndex: undefined,
      loading: false,
      mode: 'LoginSignup',
      confirmEmailToken: undefined,
      nextSendTime: 0,
      now: Date.now(),
      uploadStatus: '-/-',
    }
  },
  computed: {
    nextSendInterval() {
      if (this.now > this.nextSendTime) {
        return 0
      } else {
        return Math.floor((this.nextSendTime - this.now) / 1000)
      }
    },
    ...mapGetters(['isRoseMode']),
  },
  watch: {
    show(show) {
      if (show) {
        this.mode = LocalStorageUtil.get(RC_ACCESS_TOKEN_KEY)
          ? 'LoginSuccess'
          : 'LoginSignup'
        this.refreshUploadStatus()
      }
    },
  },
  created() {
    setInterval(() => (this.now = Date.now()), 500)
  },
  methods: {
    close() {
      this.$emit('input', false)
    },
    check() {
      if (this.code === '野玫瑰') {
        this.setRoseMode(true)
      }
    },
    exit() {
      this.setRoseMode(false)
      this.$emit('input', false)
    },
    async signup() {
      this.loading = true
      try {
        const result = await rcapiService.signup({
          username: this.username,
          password: this.password,
          nickname: this.nickname,
        })
        if (result === 0) {
          this.$refs.signup.setErrors({
            username: ['邮箱已被注册'],
          })
        } else {
          this.loginRegisterIndex = 0
          this.username = undefined
          this.password = undefined
          this.confirmPassword = undefined
          this.nickname = undefined
          this.$refs.signup.reset()
        }
      } catch (e) {
        console.error(e)
      } finally {
        this.loading = false
      }
    },
    async login() {
      this.loading = true
      try {
        const result = await rcapiService.login({
          username: this.username,
          password: this.password,
        })
        if (result.accountStatus === 'CONFIRM_EMAIL') {
          LocalStorageUtil.set(TEMP_RC_ACCESS_TOKEN_KEY, result.access_token, {
            expires: 3650,
          })
          this.mode = 'ConfirmEmail'
          this.nextSendTime = Date.now() + DEFAULT_RESEND_TIME
        } else if (result.accountStatus === 'ACTIVE') {
          LocalStorageUtil.remove(TEMP_RC_ACCESS_TOKEN_KEY)
          LocalStorageUtil.set(RC_ACCESS_TOKEN_KEY, result.access_token, {
            expires: 3650,
          })
          this.setReaderSetting({ path: 'isUploadMode', value: true })
          this.setReaderSetting({ path: 'isStrictMode', value: false })
          this.sendElectronEvent('broadcast', { source: this.$route.name })
          // this.mode = 'LoginSuccess'
          // setTimeout(() => this.$emit('input', false), 1000)
          this.showSnackbar({
            text: '登录成功',
            color: 'success',
            timeout: 1000,
          })
          this.$emit('input', false)
        } else if (result.statusCode === 401) {
          this.showSnackbar({
            text: '用户名或密码错误',
            color: 'error',
            timeout: 1000,
          })
        }
      } catch (e) {
        console.error(e)
      } finally {
        this.loading = false
      }
    },
    async confirmEmail() {
      this.loading = true

      const response = await rcapiService.confirmEmail({
        token: this.confirmEmailToken,
      })
      if (response?.statusCode) {
        if (response.error === 'WrongToken') {
          this.$refs.confirmEmail.setErrors({
            confirmEmailToken: ['验证码错误'],
          })
        }
        if (response.error === 'TokenExpired') {
          this.$refs.confirmEmail.setErrors({
            confirmEmailToken: ['验证码过期'],
          })
          this.nextSendTime = 0
        }
      } else {
        // this.mode = 'LoginSuccess'
        // setTimeout(() => this.$emit('input', false), 1000)
        // this.mode = 'ConfirmEmail'
        LocalStorageUtil.set(
          RC_ACCESS_TOKEN_KEY,
          LocalStorageUtil.get(TEMP_RC_ACCESS_TOKEN_KEY),
          {
            expires: 3650,
          }
        )
        LocalStorageUtil.remove(TEMP_RC_ACCESS_TOKEN_KEY)
        this.showSnackbar({
          text: '邮箱验证成功',
          color: 'success',
          timeout: 1000,
        })
        this.$emit('input', false)
      }

      this.loading = false
    },
    async resendConfirmEmailToken() {
      this.loading = true
      try {
        this.nextSendTime = await rcapiService.resendConfirmEmail()
      } catch (e) {
        console.error(e)
        this.nextSendTime = Date.now() + DEFAULT_RESEND_TIME
      }
      this.loading = false
    },
    async logout() {
      await rcapiService.logout()
      this.setReaderSetting({ path: 'isUploadMode', value: false })
      this.setReaderSetting({ path: 'isStrictMode', value: false })
      this.sendElectronEvent('broadcast', { source: this.$route.name })
      this.$emit('input', false)
      this.showSnackbar({
        text: '已登出',
        color: 'default',
        timeout: 1000,
      })
    },
    async refreshUploadStatus() {
      const { total, uploaded } = await UploadUtil.getUploadStatus()
      this.uploadStatus = `${uploaded} / ${total}`
    },
    ...mapMutations(['setRoseMode', 'showSnackbar', 'setReaderSetting']),
  },
}
</script>

<style scoped></style>
