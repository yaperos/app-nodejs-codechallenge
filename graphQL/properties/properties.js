require('dotenv').config()
if(process.env.ENV == 'Production' || process.env.ENV == 'Development'){
    module.exports = {
        configtest: {
            server: process.env.IP_SQL,
            authentication: {
                type: process.env.TYPE,
                options: {
                    userName: process.env.SQL_USERNAME,
                    password: process.env.SQL_PASSWORD,
                }
            },
            driver: process.env.DRIVER, 
            options: {
                instanceName: process.env.INSTANCE,
                database: process.env.DATABASE,
                rowCollectionOnDone: true,
                rowCollectionOnRequestCompletion: true,
                connectTimeout: 150000,
                requestTimeout: 150000,
                trustServerCertificate: true
            }
        },
        PORT: process.env.PORT || process.env.APP_PORT,
        valor: { "secret": process.env.SECRET },
        ENV: process.env.ENV,
        headersl: {
            [process.env.CTTYPE]: process.env.CTVALUE,
            [process.env.ACLO]: process.env.ACLOV
        },
        headers: {
            [process.env.CTTYPE]: process.env.CTVALUE,
            [process.env.ACLO]: process.env.ACLOV
        }
    }
    
}

