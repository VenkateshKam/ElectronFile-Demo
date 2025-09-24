import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow, splashWindow;

const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

function createSplash() {
  splashWindow = new BrowserWindow({
    width: 400,
    height: 300,
    frame: false,
    alwaysOnTop: true,
    transparent: true,
    resizable: false,
  });

  splashWindow.loadFile(path.join(__dirname, 'src/assets/splash.html'));

  // Close splash after 2 sec and open main window
  setTimeout(() => {
    splashWindow.close();
    createMainWindow();
  }, 2000);
}

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    frame: false,
    resizable: true,
    icon: path.join(__dirname, 'src/assets/logo.icns'), // Window & taskbar icon
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.cjs'),
      webviewTag: true
    }
  });

  // Set dock icon for macOS
  if (process.platform === 'darwin') {
    app.dock.setIcon(path.join(__dirname, 'src/assets/logo.icns'));
  }

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'));
  }

  // Send window state to renderer
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.send('window-is-maximized', mainWindow.isMaximized());
  });

  mainWindow.on('maximize', () => {
    mainWindow.webContents.send('window-is-maximized', true);
  });

  mainWindow.on('unmaximize', () => {
    mainWindow.webContents.send('window-is-maximized', false);
  });
}

app.whenReady().then(() => {
  createSplash(); // show splash first
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
});

// IPC handlers
ipcMain.on('window-minimize', () => {
  if (mainWindow) mainWindow.minimize();
});

ipcMain.on('window-maximize', () => {
  if (!mainWindow) return;
  if (mainWindow.isMaximized()) mainWindow.unmaximize();
  else mainWindow.maximize();
  mainWindow.webContents.send('window-is-maximized', mainWindow.isMaximized());
});

ipcMain.on('window-close', async () => {
  if (!mainWindow) return;
  const choice = await dialog.showMessageBox(mainWindow, {
    type: 'question',
    buttons: ['Yes', 'No'],
    defaultId: 1,
    title: 'Confirm',
    message: 'Are you sure you want to quit ActiveCollab?'
  });
  if (choice.response === 0) mainWindow.close();
});

ipcMain.on('request-window-state', () => {
  if (mainWindow) mainWindow.webContents.send('window-is-maximized', mainWindow.isMaximized());
});
