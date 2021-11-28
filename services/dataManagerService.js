const { Op, Sequelize } = require('sequelize');
const { Transaction } = require('../models/Transaction');
const { User } = require('../models/User');

class DataManager {
    constructor(streamer) {
        this.dbPath = `${process.env.APPDATA}\\Gold Tracker\\main.sqlite`;
        this.database = new Sequelize({
            dialect: 'sqlite',
            logging: false,
            storage: this.dbPath
        });
        this.streamer = streamer;
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

    async checkUserExists(username) {
        let result = false
        await this.user.count({ where: { username: username } })
            .then(count => {
                result = (count > 0) ? true : false
            });
        return result;
    }

    async getBalance(username = this.streamer){
        var user = await this.user.findOne({ where: {userName: username}});
        return Number(user.balance);
    }

    async initTables() {
        this.user = User(this.database);
        this.transaction = Transaction(this.database);
        await this.database.sync();
    }

    async seedTable() {
        if (await this.checkUserExists(this.streamer) === false) {
            await this.user.create({ userName: this.streamer });
        }
    }

    async transferGold(amount = 1, transactionType, username) {
        var streamer, user;

        // Check if User is already in database
        if (await this.checkUserExists(username) === false) {
            this.user.create({ balance: 0, userName: username });
            console.log(`User ${username} added`)
        }

        user = await this.user.findOne({ where: { userName: username } });

        if (user !== undefined) {
            streamer = await this.user.findOne({ where: { userName: this.streamer } });

            switch (transactionType) {
                case "buy":
                    this.transaction.create({ amount: amount, user: user.userId });

                    await this.user.increment({ balance: amount }, {
                        where: {
                            id: {
                                [Op.or]: [user.id, streamer.id]
                            }
                        }
                    });
                    break;
                default:
                    console.error(`Transaction type ${transactionType} is not currently supported`)
                    break;
            }

            // Get updated values
            streamer = await this.user.findOne({ where: { id: streamer.id } });
            user = await this.user.findOne({ where: { id: user.id } });

            console.log(`Buyer ${user.userName} balance:${user.balance} and ${streamer.userName} balance:${streamer.balance}`);

            return Number(streamer.balance);
        }
    }
}

module.exports = {
    DataManager
}