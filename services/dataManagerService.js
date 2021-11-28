const { Sequelize } = require('sequelize');

class DataManager {
    constructor() {
        this.dbPath = `${process.env.APPDATA}\\Gold Tracker\\main.sqlite`;
        this.database = new Sequelize({
            dialect: 'sqlite',
            logging: false,
            storage: this.dbPath
        });
    }

    async checkConnection() {
        try {
            await this.database.authenticate();
            console.log(`Connection to ${this.dbPath} has been established successfully.`);
            return true;
        } catch (error) {
            console.error('Unable to connect to the database:', error);
            return false;
        }
    }
}

module.exports = {
    DataManager
}