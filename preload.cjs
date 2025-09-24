// preload.cjs
const { contextBridge, ipcRenderer } = require('electron');

console.log('✅ preload.cjs loaded');

contextBridge.exposeInMainWorld('electronAPI', {
  minimize: () => ipcRenderer.send('window-minimize'),
  maximize: () => ipcRenderer.send('window-maximize'),
  close: () => ipcRenderer.send('window-close'),
  // request initial window state
  requestWindowState: () => ipcRenderer.send('request-window-state'),
  // subscribe to window-is-maximized events from main
  onWindowState: (callback) => {
    ipcRenderer.on('window-is-maximized', (_event, isMax) => callback(isMax));
  }
});
