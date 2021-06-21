import DevelopmentModeUtil from '@/utils/DevelopmentModeUtil'
import LocalStorageUtil from '@/utils/LocalStorageUtil'

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
        Authorization: `Bearer ${LocalStorageUtil.get(TEMP_RC_ACCESS_TOKEN_KEY)}`,
      },
      method: 'POST',
    }).then(response => response?.json())
  },
  resendConfirmEmail() {
    return fetch(host + '/auth/resendConfirmEmail', {
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${LocalStorageUtil.get(TEMP_RC_ACCESS_TOKEN_KEY)}`,
      },
      method: 'POST',
    }).then(response => response.json())
  },
  getRecords(sortBy, sortDesc, page, itemsPerPage) {
    const paramStr = encodeQueryData({
      sortBy: sortBy,
      sortDesc: sortDesc,
      page: page,
      itemsPerPage: itemsPerPage,
    })
    return fetch(`${host}/records?${paramStr}`, {
      headers: {
        'content-type': 'application/json',
      },
      method: 'GET',
    }).then(response => response.json())
  },
}

function encodeQueryData(data) {
  const ret = []
  for (let d in data) {
    if (Object.prototype.hasOwnProperty.call(data, d)) {
      ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]))
    }
  }
  return ret.join('&')
}
