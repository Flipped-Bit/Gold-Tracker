const { DataTypes } = require('sequelize');

module.exports = {
    Transaction: function (sequelize) {
        return sequelize.define('Transaction', {
            amount: {
                allowNull: false,
                defaultValue: 1,
                field: 'Amount',
                type: DataTypes.INTEGER
            },
            createdAt: {
                allowNull: false,
                field: 'CreatedAt',
                type: DataTypes.DATE
            },
            deletedAt: {
                field: 'DeletedAt',
                type: DataTypes.DATE
            },
            id: {
                field: 'Id',
                primaryKey: true,
                type: DataTypes.INTEGER
            },
            user: {
                allowNull: false,
                field: 'User',
                type: DataTypes.UUID
            },
        },
            {
                paranoid: true,
                updatedAt: false
            });
    }
};