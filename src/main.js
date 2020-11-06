const { app, BrowserWindow } = require('electron')
const { is, setContentSecurityPolicy } = require('electron-util');
const config = require('./config');


function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false
    }
  })

// load the URL
if (is.development) {
    win.loadURL(config.LOCAL_WEB_URL);
    } else {
    win.loadURL(config.PRODUCTION_WEB_URL);
    }

  //win.loadURL('http://localhost:1234');
//   win.loadFile('./index.html')

if (is.development) { win.webContents.openDevTools() }

// set the CSP in production mode
if (!is.development) {
    setContentSecurityPolicy(`
    default-src 'none';
    script-src 'self';
    img-src 'self' https://www.gravatar.com;
    style-src 'self' 'unsafe-inline';
    font-src 'self';
    connect-src 'self' ${config.PRODUCTION_API_URL};
    base-uri 'none';
    form-action 'none';
    frame-ancestors 'none';
    `);
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
