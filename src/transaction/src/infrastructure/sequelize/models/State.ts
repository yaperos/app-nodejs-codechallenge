import { DataTypes, Model } from "sequelize";
import { sequelize } from '../config.sequelize'

export class StateModel extends Model { }

StateModel.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
}, {
    sequelize,
    modelName: 'State',
    underscored: true
});
