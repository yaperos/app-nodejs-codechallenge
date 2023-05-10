import { DataTypes, Model } from "sequelize";
import { sequelize } from '../config.sequelize'


export class TransactionModel extends Model { }

TransactionModel.init({
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    accountExternalIdDebit: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    accountExternalIdCredit: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    tranferTypeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    value: {
        type: DataTypes.DECIMAL(10, 2),
    }
}, {
    sequelize,
    modelName: 'Transaction',
    underscored: true
});
