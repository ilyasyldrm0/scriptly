const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  selectVideo: () => ipcRenderer.invoke("select-video"),
  sendVideo: (videoPath) => ipcRenderer.invoke("send-video", videoPath),

  // Backend durumunu dinleme
  onBackendStatus: (callback) =>
    ipcRenderer.on("backend-status", (event, status) => callback(status)),
});
