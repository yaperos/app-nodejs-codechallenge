import moongose from "mongoose"
import {initializeTransferTypes} from '../helpers/initializeTranferTypes';
import "dotenv/config";


moongose.set('strictQuery', false);

moongose.connect(process.env.DATABASE_MONGO_URL || `mongodb://localhost/prueba-yape`)
    .then(()=> {
        console.log('Se conectó a la base de datos con éxito!')
        initializeTransferTypes();

    }).catch((err)=> {
        console.log('Error en la conexión de la base de datos: ', err);
    })

export {moongose};