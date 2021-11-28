const { DataTypes } = require('sequelize');

module.exports = {
    User: function (sequelize) {
        return sequelize.define('User', {
            balance: {
                allowNull: false,
                defaultValue: 0,
                field: 'Balance',
                type: DataTypes.INTEGER
            },
            createdAt: {
                allowNull: false,
                field: 'CreatedAt',
                type: DataTypes.DATE
            },
            id: {
                field: 'Id',
                primaryKey: true,
                type: DataTypes.INTEGER
            },
            updatedAt: {
                allowNull: false,
                field: 'UpdatedAt',
                type: DataTypes.DATE
            },
            userId: {
                defaultValue: DataTypes.UUIDV4,
                field: 'UserId',
                type: DataTypes.UUID
            },
            userName: {
                allowNull: false,
                field: 'UserName',
                type: DataTypes.STRING
            }
        });
    }
};