import {produce} from "./kafka/producer";
import {consume} from "./kafka/consumer";


const initilizeApp = async () => {
    try {
        console.log('Inicializando...')
        await consume();
        console.log('Se inició el consumer')
    } catch (err){
        console.log('Ocurrió un error al inicializar la app')
    }
}

initilizeApp();






