/* eslint-disable no-console */
const { app, BrowserWindow } = require('electron');
const path = require('path');

// This is replaced by
// const { ipcMain } = require('electron-postman')
// in a real application.
const { ipcMain } = require('..'); // eslint-disable-line import/no-unresolved

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
      // Sandbox doesn't works in this example (cannot find module '..')
      // Should work, if electron-postman is installed via npm/yarn
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

  // Promise.all([promiseA, promiseB, promiseC]).then(() => {
  //   // All three browser windows are registered for IPC communication at this point

  //   ipcMain.send('window-a', 'test-send-from-main', 'Send a message from main');
  //   ipcMain.invoke('window-b', 'test-invoke-from-main', 'Square this number', 5)
  //     .then((result) => {
  //       console.log(`test-main-invoke: result=${result}`);
  //     });
  //   ipcMain.handle('window-c', 'test-renderer-invoke', (msg, n) => {
  //     console.log(`test-renderer-invoke: msg=${msg}, n=${n}`);
  //     return n + 5;
  //   });
  //   ipcMain.on('window-c', 'test-renderer-invoke', (msg, n) => {
  //     console.log(`test-renderer-invoke: msg=${msg}, n=${n}`);
  //     return n + 5;
  //   });
  // });
});

app.on('window-all-closed', () => {
  app.quit();
});
