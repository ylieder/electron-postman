// eslint-disable-next-line import/no-unresolved
const { ipcRenderer } = require('..');

ipcRenderer.exposeInMainWorld('ipcB');
