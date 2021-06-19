import DevelopmentModeUtil from '@/utils/DevelopmentModeUtil'
import * as Cookies from 'js-cookie'

const host = DevelopmentModeUtil.isTest()
  ? 'http://localhost:3100'
  : 'https://rcapi.traveleorzea.com'

export const RC_ACCESS_TOKEN_KEY = 'RC_ACCESS_TOKEN'
export const TEMP_RC_ACCESS_TOKEN_KEY = 'TEMP_RC_ACCESS_TOKEN'

export default {
  signup({ username, nickname, password }) {
    return fetch(host + '/auth/signup', {
      body: JSON.stringify({
        username: username,
        nickname: nickname,
        password: password,
      }),
      headers: {
        'content-type': 'application/json',
      },
      method: 'POST',
    }).then(response => response.json())
  },
  login({ username, password }) {
    return fetch(host + '/auth/login', {
      body: JSON.stringify({
        username: username,
        password: password,
      }),
      headers: {
        'content-type': 'application/json',
      },
      method: 'POST',
    }).then(response => response.json())
  },
  confirmEmail({ token }) {
    return fetch(host + '/auth/confirmEmail', {
      body: JSON.stringify({
        token,
      }),
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${Cookies.get(TEMP_RC_ACCESS_TOKEN_KEY)}`,
      },
      method: 'POST',
    }).then(response => response.json())
  },
  resendConfirmEmail() {
    return fetch(host + '/auth/resendConfirmEmail', {
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${Cookies.get(TEMP_RC_ACCESS_TOKEN_KEY)}`,
      },
      method: 'POST',
    }).then(response => response.json())
  },
}
