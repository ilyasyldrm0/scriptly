const { ipcRenderer } = window.require ? window.require('electron') : { on:()=>{} };

// Backend hazır olana kadar yükleniyor mesajı göster
window.electronAPI && window.electronAPI.selectVideo && ipcRenderer && ipcRenderer.on && ipcRenderer.on('backend-status', (event, status) => {
  const uploadStatus = document.getElementById('uploadStatus');
  if (status === 'loading') {
    uploadStatus.textContent = 'Backend başlatılıyor, lütfen bekleyin...';
    uploadStatus.style.color = '#ffd600';
    document.getElementById('sendBtn').disabled = true;
  } else if (status === 'ready') {
    uploadStatus.textContent = '';
    document.getElementById('sendBtn').disabled = false;
  }
});
let selectedVideoPath = null;

const selectVideoBtn = document.getElementById('selectVideoBtn');
const videoName = document.getElementById('videoName');
const uploadStatus = document.getElementById('uploadStatus');
const sendBtn = document.getElementById('sendBtn');
const resultSection = document.getElementById('resultSection');

selectVideoBtn.addEventListener('click', async () => {
  const filePath = await window.electronAPI.selectVideo();
  if (filePath) {
    selectedVideoPath = filePath;
    videoName.textContent = filePath.split(/[\\/]/).pop();
    uploadStatus.textContent = 'Video yüklendi!';
    uploadStatus.style.color = '#00e676';
    sendBtn.disabled = false;
    resultSection.textContent = '';
  } else {
    videoName.textContent = 'Henüz video seçilmedi';
    uploadStatus.textContent = '';
    sendBtn.disabled = true;
    resultSection.textContent = '';
  }
});

sendBtn.addEventListener('click', async () => {
  if (!selectedVideoPath) return;
  uploadStatus.textContent = 'Gönderiliyor...';
  uploadStatus.style.color = '#ffd600';
  sendBtn.disabled = true;
  resultSection.textContent = '';
  const response = await window.electronAPI.sendVideo(selectedVideoPath);
  if (response && response.status === 'ok') {
    uploadStatus.textContent = 'Video başarıyla gönderildi!';
    uploadStatus.style.color = '#00e676';
    resultSection.textContent = response.message || '';
  } else {
    uploadStatus.textContent = 'Bir hata oluştu!';
    uploadStatus.style.color = '#ff1744';
    resultSection.textContent = '';
  }
  sendBtn.disabled = false;
});
