var ipcRenderer = require('electron').ipcRenderer;
ipcRenderer.on('balanceChanged', function (event,newBalance) {
    document.getElementById("coinSound").play();
    document.getElementById("balance").innerHTML = newBalance;
});