import { sequelize } from '../config.sequelize'
import { StateModel } from '../models/State';
import { states } from './state';
import { modelInit } from '../models';




const main = async () => {
    try {
        modelInit()
        await sequelize.sync({ force: true });
        await StateModel.bulkCreate(states as any, { ignoreDuplicates: true });
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }

}

main();