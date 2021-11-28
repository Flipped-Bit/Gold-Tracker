const { ipcRenderer } = require('electron');

window.addEventListener('DOMContentLoaded', () => {
  document.getElementById("closeBtn").addEventListener("click", () => {
    ipcRenderer.send('closeApp');
  });
  document.getElementById("addGold").addEventListener("click", () => {
    ipcRenderer.send('addGold');
  }); 
})