/* eslint-disable no-console */
const { app, BrowserWindow } = require('electron');
const { ipcMain } = require('electron-postman');
const path = require('path');

function createWindow(title) {
  const window = new BrowserWindow({
    width: 500,
    height: 600,
    x: title === 'Window A' ? 50 : 600,
    y: 100,
    title,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      // Sandbox doesn't works in this example (module not found: electron-postman)
      // Should work, if a bundler like webpack is used.
      // sandbox: true,
    },
  });
  window.webContents.openDevTools();

  // Show correct window title
  window.on('page-title-updated', (e) => {
    e.preventDefault();
  });

  return window;
}

app.whenReady().then(() => {
  ipcMain.on('window-a', 'msg', (...args) => {
    console.log(`Receive message from window A: ${args}`);
  });

  ipcMain.handle('window-a', 'invoke', (n) => n ** 2);

  ipcMain.on('window-b', 'msg', (...args) => {
    console.log(`Receive message from window B: ${args}`);
  });

  ipcMain.handle('window-b', 'invoke', (n) => n ** 3);

  const windowA = createWindow('Window A');
  ipcMain.registerBrowserWindow('window-a', windowA);
  windowA.loadFile('index.html');

  const windowB = createWindow('Window B');
  ipcMain.registerBrowserWindow('window-b', windowB);
  windowB.loadFile('index.html');
});

app.on('window-all-closed', () => {
  app.quit();
});
