const { ipcRenderer } = require('electron');

window.addEventListener('DOMContentLoaded', () => {
  document.getElementById("closeBtn").addEventListener("click", () => {
    ipcRenderer.send('closeApp');
  });
})