const isDev = require('electron-is-dev')
const log = require('electron-log')

const setupDevEnv = () => {
  if (isDev) {
  //   const {
  //     default: installExtension,
  //     VUEJS_DEVTOOLS,
  //   } = require('electron-devtools-installer')
  //   installExtension(VUEJS_DEVTOOLS)
  //     .then(name => log.info(`Added Extension:  ${name}`))
  //     .catch(err => log.info('An error occurred: ', err))
  }
}

module.exports = { setupDevEnv }

