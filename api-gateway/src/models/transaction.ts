import { DataTypes } from 'sequelize';
import { randomUUID } from 'crypto';
import db from '../config/db';
import { EStatus } from '../@types';

export interface ITransaction {
    accountExternalIdDebit: string;
    accountExternalIdCredit: string;
    transactionExternalId: string;
    tranferTypeId: number;  
    value: number;
    status: string;
    createdAt?: Date;
}

const Transaction = db.define('transactions',{
    transactionExternalId: {
        type: DataTypes.UUIDV4,
        unique: true,
        primaryKey: true,
        defaultValue: randomUUID()
    },
    accountExternalIdDebit: {
        type: DataTypes.UUIDV4
    },
    accountExternalIdCredit: {
        type: DataTypes.UUIDV4,
        allowNull: false
    },
    tranferTypeId: { 
        allowNull: false,
        type: DataTypes.INTEGER
    },
    value: {
        allowNull: false,
        type: DataTypes.DOUBLE
    },
    status: {
        allowNull: false,
        type: DataTypes.STRING,
        defaultValue: EStatus.PENDING
    },
    createdAt: {
        type: DataTypes.DATE
    }
},{ 
    timestamps: false 
})

export default Transaction;