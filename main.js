const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const { spawn, execSync, exec } = require('child_process');
const path = require('path');
const fs = require('fs');

let backendProcess = null;
let backendReady = false;

const isDev = !app.isPackaged;

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });
  win.loadFile('index.html');
  win.webContents.on('did-finish-load', () => {
    win.webContents.send('backend-status', backendReady ? 'ready' : 'loading');
  });
}

function killBackendIfRunning() {
  try {
    execSync('taskkill /IM python.exe /F');
  } catch (e) {}
}

function startBackend() {
  killBackendIfRunning();
  backendReady = false;

  let backendExe;
  if (isDev) {
    backendExe = path.join(__dirname, "dist", "backend-scriptly.exe");
  } else {
    backendExe = path.join(process.resourcesPath, "backend-scriptly.exe");
  }

  if(isDev) {
    //exec with .py file in development mode
    exec(
      `start cmd /k "python ${path.join(
        __dirname,
        "backend",
        "backend-scriptly.py"
      )}"`,
      (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
        }
      }
    );
  }else{
    backendProcess = spawn(backendExe, [], {
      cwd: path.dirname(backendExe),
      stdio: ["pipe", "pipe", "pipe"],
      detached: false,
    });
  }

  const check = setInterval(() => {
    const axios = require("axios");
    axios
      .get("http://127.0.0.1:8000/health")
      .then(() => {
        backendReady = true;
        clearInterval(check);
        BrowserWindow.getAllWindows().forEach((win) => {
          win.webContents.send("backend-status", "ready");
        });
      })
      .catch(() => {});
  }, 1000);
}

app.whenReady().then(() => {
  startBackend();
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (backendProcess) {
    try { process.kill(-backendProcess.pid); } catch (e) {}
  }
  if (process.platform !== 'darwin') app.quit();
});

// --- Diğer IPC handler kodların aynı kalabilir ---
const axios = require('axios');
const FormData = require('form-data');

ipcMain.handle('select-video', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    filters: [{ name: 'Videos', extensions: ['mp4', 'mov', 'avi', 'mkv'] }],
    properties: ['openFile']
  });
  if (canceled) return null;
  return filePaths[0];
});

ipcMain.handle('send-video', async (event, videoPath) => {
  try {
    const form = new FormData();
    form.append('video', fs.createReadStream(videoPath));
    const response = await axios.post('http://127.0.0.1:8000/transcribe', form, {
      headers: form.getHeaders(),
      maxBodyLength: Infinity
    });
    if (response.data && response.data.text) {
      return { status: 'ok', message: response.data.text };
    } else {
      console.error('Beklenmeyen yanıt:', response.data);
      return { status: 'error', message: 'Beklenmeyen yanıt.' };
    }
  } catch (err) {
    console.error('Backend bağlantı hatası:', err);
    return { status: 'error', message: 'Backend bağlantı hatası veya işlenemeyen dosya.' };
  }
});

ipcMain.on('app-quit', (event, info) => {
  if (backendProcess) {
    try { process.kill(-backendProcess.pid); } catch (e) {}
  }
});
