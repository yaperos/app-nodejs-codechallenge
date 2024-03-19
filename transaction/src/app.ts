import express from "express";
import cors from "cors";
import {indexRoutes} from "./routes/index.routes";
import {consume} from "./kafka/consumer";
import "./config/database";

import swaggerUI from "swagger-ui-express";
import {swaggerJS} from "./docs/swagger";

const PORT = process.env.PORT || 3000;
const app = express();

//SWAGGER CONFIGURATION
app.use('/documentation', swaggerUI.serve, swaggerUI.setup(swaggerJS));


// USAMOS CORS
app.use(cors())

//Agregamos handler para recibir json
app.use(express.json());

//Inicializar el router de express con todos los endpoint
indexRoutes(app)

const initilizeApp = async () => {
    try{
        // LEVANTAR EL SERVIDOR 
        app.listen(PORT, () => {
            console.log(`Server on port ${PORT}`)
        })
        // INICIALIZAR EL CONSUMER PARA QUE EMPIECE A ESCUCHAR LOS EVENTOS
        await consume()
        console.log('Se inició el consumer')

  
    } catch(err) {
        console.log('Error -> Initilize app -> ', err)
    }
    
}

initilizeApp();





