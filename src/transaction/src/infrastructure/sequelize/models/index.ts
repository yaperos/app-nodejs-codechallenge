import { StateModel } from "./State"
import { TransactionModel } from "./Transaction"


export const modelInit = () => {
    StateModel.hasMany(TransactionModel, {
        foreignKey: {
            name: 'stateId'
        }
    })

    TransactionModel.belongsTo(StateModel,
        {
            foreignKey: {
                name: 'stateId',
                allowNull: false,
                defaultValue: 1
            }
        })
}