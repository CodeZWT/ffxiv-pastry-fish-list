import * as cjson from 'compressed-json'
import { INTERVAL_MINUTE, UPLOAD_LIMIT } from 'Data/constants'
import { decode, decodeAsync } from '@msgpack/msgpack'
import DevelopmentModeUtil from '@/utils/DevelopmentModeUtil'
import LocalStorageUtil from '@/utils/LocalStorageUtil'

const host = DevelopmentModeUtil.isTest()
  ? 'https://rcapi.traveleorzea.com' //'http://localhost:3100'
  : 'https://rcapi.traveleorzea.com'
const DATA_HOST = 'https://cdn.jsdelivr.net/gh/ricecake404/pastry-fish-static-files'
export const RC_ACCESS_TOKEN_KEY = 'RC_ACCESS_TOKEN'
export const TEMP_RC_ACCESS_TOKEN_KEY = 'TEMP_RC_ACCESS_TOKEN'
export const RC_USER_PROFILE_KEY = 'RC_USER_PROFILE'

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
  logout() {
    LocalStorageUtil.remove(RC_ACCESS_TOKEN_KEY)
    LocalStorageUtil.remove(RC_USER_PROFILE_KEY)
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
  isLogin() {
    return !!LocalStorageUtil.get(RC_ACCESS_TOKEN_KEY)
  },
  async getUserProfile() {
    if (!this.isLogin()) return { userId: 0 }
    const userProfile = LocalStorageUtil.get(RC_USER_PROFILE_KEY)
    if (userProfile) {
      return userProfile
    }

    const response = await fetch(`${host}/user/profile`, {
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${LocalStorageUtil.get(RC_ACCESS_TOKEN_KEY)}`,
      },
      method: 'GET',
    })
    if (response.ok) {
      const userProfile = await response.json()
      LocalStorageUtil.set(RC_USER_PROFILE_KEY, userProfile, {
        expires: 3650,
      })
      return userProfile
    }
  },
  async getRecords(
    sortBy,
    sortDesc,
    page,
    itemsPerPage,
    startTime,
    endTime,
    strictMode,
    filterSelf,
    spotId,
    fishId,
    baitId
  ) {
    let strictModeFilterType = 'all'
    if (strictMode.length === 1) {
      if (strictMode[0] === 'strict') {
        strictModeFilterType = 'strict'
      } else {
        strictModeFilterType = 'normal'
      }
    }
    const userProfile = await this.getUserProfile()
    const paramStr = [
      { name: 'sortBy', value: sortBy },
      { name: 'sortDesc', value: sortDesc },
      { name: 'page', value: page },
      { name: 'itemsPerPage', value: itemsPerPage },
      { name: 'startTime', value: startTime ?? '' },
      { name: 'endTime', value: endTime ?? '' },
      { name: 'strictMode', value: strictModeFilterType },
      { name: 'userId', value: filterSelf ? userProfile.userId : 0 },
      { name: 'spot', value: spotId == null ? '' : spotId },
      { name: 'fish', value: fishId == null ? '' : fishId },
      { name: 'bait', value: baitId == null ? '' : baitId },
    ]
      .map(({ name, value }) => toParamStr(name, value))
      .join('&')
    const response = await fetch(`${host}/records?${paramStr}`, {
      headers: {
        'content-type': 'application/json',
      },
      method: 'GET',
    })
    if (response.ok) {
      return await response.json()
    }
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
          const data = await response.json()
          console.debug('Uploaded data CNT:', data.length)
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
  async getPatchInfo(hash) {
    return fetch(`${host}/patch/${hash}`, {
      headers: {
        'content-type': 'application/json',
      },
      method: 'GET',
    }).then(response => {
      if (response.ok) {
        return response.json()
      } else {
        return { content: '{}' }
      }
    })
  },
  async getSpotRecordCount(spotId, type = 'record-count') {
    const version = await this.getDataFilesVersion()
    return fetch(`${DATA_HOST}@${version}/${type}/${spotId}.data`, {
      method: 'GET',
    }).then(async resp => {
      if (resp.ok) {
        const data = await decodeAsync(resp.body)
        const decompressedData = cjson.decompress(data)
        // console.log(decompressedData)
        return decompressedData
      } else {
        console.debug('404 return empty')
        return { items: [] }
      }
    })
  },
  async getSpotBiteInterval(spotId) {
    const version = await this.getDataFilesVersion()
    return fetch(`${DATA_HOST}@${version}/bite-interval/${spotId}.data`, {
      method: 'GET',
    }).then(async resp => {
      if (resp.ok) {
        const data = await decodeAsync(resp.body)
        const decompressedData = cjson.decompress(data)
        // console.log(decompressedData)
        return decompressedData
      } else {
        console.debug('404 return empty')
        return { items: [] }
      }
    })
  },
  async decodeFromBlob(blob) {
    if (blob.stream) {
      // Blob#stream(): ReadableStream<Uint8Array> (recommended)
      return await decodeAsync(blob.stream())
    } else {
      // Blob#arrayBuffer(): Promise<ArrayBuffer> (if stream() is not available)
      return decode(await blob.arrayBuffer())
    }
  },
  async setOwnRecordStrictMode(recordId, isStrictMode) {
    const response = await fetch(
      `${host}/records/${recordId}?isStrictMode=${!!isStrictMode}`,
      {
        headers: {
          'content-type': 'application/json',
          Authorization: `Bearer ${LocalStorageUtil.get(RC_ACCESS_TOKEN_KEY)}`,
        },
        method: 'PUT',
      }
    )
    return response.ok
  },
  async removeOwnRecord(recordId) {
    const response = await fetch(`${host}/records/${recordId}`, {
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${LocalStorageUtil.get(RC_ACCESS_TOKEN_KEY)}`,
      },
      method: 'DELETE',
    })
    return response.ok
  },
  async getDataFilesVersion() {
    // if (DevelopmentModeUtil.isTest()) {
    //   return 'fc4c9776f3490f2377f3e9f237b7343288cdca94'
    // }
    if (this.dataFilesVersion != null) {
      return this.dataFilesVersion
    }
    return fetch(`${host}/records/dataFilesVersion`, {
      headers: {
        'content-type': 'application/json',
      },
      method: 'GET',
    }).then(async response => {
      if (response.ok) {
        this.dataFilesVersion = await response.text()
        return this.dataFilesVersion
      } else {
        return 'records'
      }
    })
  },
  lastUploadTime: 0,
  dataFilesVersion: undefined,

  async getOpcodeFileVersion() {
    // if (DevelopmentModeUtil.isTest()) {
    //   return ''
    // }
    if (this.opcodeFileVersion != null) {
      return this.opcodeFileVersion
    }
    return fetch(`${host}/records/opcodeFileVersion`, {
      headers: {
        'content-type': 'application/json',
      },
      method: 'GET',
    })
      .then(async response => {
        if (response.ok) {
          this.opcodeFileVersion = await response.text()
          return this.opcodeFileVersion
        } else {
          console.error('failed to get opcode file version, using default latest')
          return 'latest'
        }
      })
      .catch(() => {
        console.error('failed to get opcode file version in catch, using default latest')
        return 'latest'
      })
  },
  opcodeFileVersion: undefined,
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
