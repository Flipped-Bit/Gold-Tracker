const tmi = require('tmi.js');
const settings = require('../appsettings.json')

class ChatListener {
    constructor(channel) {
        this.client = new tmi.client({
            connection: {
                reconnect: true,
                secure: true
            },
            identity: {
                username: `${settings.username}`,
                password: `oauth:${settings.twitchToken}`
            },
            channels: [`#${channel}`]
        });
    }

    async connect() {
        this.client.connect()
        .catch(console.error);
    }
}

module.exports = {
    ChatListener
}