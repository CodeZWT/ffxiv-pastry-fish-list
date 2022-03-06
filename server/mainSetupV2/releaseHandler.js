const axios = require('axios')

module.exports = {
  getRelease() {
    return axios
      .get(
        'https://gitee.com/api/v5/repos/ricecake500/pastry-fish-desktop/releases/latest'
      )
      .then(response => {
        return response.data
      })
  },
}
