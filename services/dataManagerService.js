const { Sequelize } = require('sequelize');
const { User } = require('../models/User');

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

    async initTables(){
        this.user = User(this.database);
        await this.database.sync();
    }
}

module.exports = {
    DataManager
}