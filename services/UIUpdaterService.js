var ipcRenderer = require('electron').ipcRenderer;
ipcRenderer.on('balanceChanged', function (event,newBalance) {
    document.getElementById("balance").innerHTML = newBalance;
});