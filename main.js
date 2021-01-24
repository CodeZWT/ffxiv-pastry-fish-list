const {app, BrowserWindow} = require('electron')
const isDev = require('electron-is-dev')
const FishingDataReader = require('./server/reader')

const winURL = isDev
    ? `http://localhost:8080`
    : `file://${__dirname}/front-dist/index.html`
console.log(winURL)

function createWindow() {
    const win = new BrowserWindow({
        width: 1280,
        height: 500,
        frame: false,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
            preload: __dirname + '/preload.js'
        }
    })

    win.setOpacity(0.9)
    win.setAlwaysOnTop(true)

    win.loadURL(winURL)
        .then(() => {
            FishingDataReader.onUpdate((data) => {
                win.webContents.send('fishingData', data)
            })
            FishingDataReader.start(() => {
                console.log("Machina started!")
            })
        })
    if (isDev) {
        win.webContents.openDevTools({
            mode: 'undocked'
        })
    }
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})
