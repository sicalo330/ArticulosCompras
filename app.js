const {BrowserWindow, app} = require('electron')

let appWindow

function  createWindow() {
    appWindow = new BrowserWindow({
        width:1000,
        height:800
    })
    appWindow.loadFile('dist/articulos-compra/index.html');//Esta línea es importante

    appWindow.on('closed', function(){
        appWindow = null;
    })
}

app.whenReady().then(() => {
    createWindow()
})
