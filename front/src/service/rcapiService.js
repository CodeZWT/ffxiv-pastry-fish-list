import DevelopmentModeUtil from '@/utils/DevelopmentModeUtil'
import LocalStorageUtil from '@/utils/LocalStorageUtil'
import { INTERVAL_MINUTE, UPLOAD_LIMIT } from 'Data/constants'

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
    const paramStr = [
      { name: 'sortBy', value: sortBy },
      { name: 'sortDesc', value: sortDesc },
      { name: 'page', value: page },
      { name: 'itemsPerPage', value: itemsPerPage },
    ]
      .map(({ name, value }) => toParamStr(name, value))
      .join('&')
    return fetch(`${host}/records?${paramStr}`, {
      headers: {
        'content-type': 'application/json',
      },
      method: 'GET',
    }).then(response => response.json())
  },
  getSpotRecords(spotId) {
    return fetch(`${host}/spots/${spotId}/records`, {
      headers: {
        'content-type': 'application/json',
      },
      method: 'GET',
    }).then(response => response.json())
  },
  getUserSpotStats() {
    return fetch(`${host}/user/stats`, {
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${LocalStorageUtil.get(RC_ACCESS_TOKEN_KEY)}`,
      },
      method: 'GET',
    }).then(response => response.json())
  },
  getTotalSpotStats() {
    return fetch(`${host}/stats`, {
      headers: {
        'content-type': 'application/json',
      },
      method: 'GET',
    }).then(response => response.json())
  },
  async uploadRecords(records) {
    const now = Date.now()
    if (
      records.length === UPLOAD_LIMIT ||
      this.lastUploadTime + INTERVAL_MINUTE * 10 < now
    ) {
      this.lastUploadTime = now
      try {
        const response = await fetch(`${host}/records`, {
          headers: {
            'content-type': 'application/json',
            Authorization: `Bearer ${LocalStorageUtil.get(RC_ACCESS_TOKEN_KEY)}`,
          },
          method: 'POST',
          body: JSON.stringify(records),
        })
        if (response.ok) {
          const data = response.json()
          console.info('Uploaded data CNT:', data.length)
          return data
        } else {
          console.error('Upload error', response.status, response)
        }
      } catch (e) {
        console.error('Network error', e)
      }
    }
    return []
  },
  lastUploadTime: 0,
}

const toParamStr = (name, value) => {
  if (typeof value === 'object') {
    if (value.length === 0) {
      return name + '='
    } else {
      return value.map(it => name + '=' + it).join('&')
    }
  } else {
    return name + '=' + value
  }
}
