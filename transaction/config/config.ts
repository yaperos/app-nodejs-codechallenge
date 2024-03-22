export const configLoader =  {

    port: process.env.PORT,
    database: {
        name: process.env.DB_DATABASE,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
        host: process.env.DB_HOST
    }
    

}