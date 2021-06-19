const isDev = require('electron-is-dev')
const axios = require('axios')

const host = isDev
  ? 'http://localhost:3100'
  : 'https://rcapi.traveleorzea.com'

const http = axios.create({
  baseURL: host,
  headers: {'content-type': 'application/json',}
});

module.exports = {
   uploadRecords(accessToken, records) {
    return http.post('/records', records, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
  },
}
