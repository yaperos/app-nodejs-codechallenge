const properties = require('../properties/properties')
const Connection = require('tedious').Connection;
const Request = require('tedious').Request;
const TYPES = require('tedious').TYPES;


exports.query = (storedProcedure, parametros) => {
    return new Promise((resolve, reject) => {
        var conn = new Connection(properties.configtest);
        conn.on('connect', (err) => {
            if (err) {
                console.log(err)
                reject('error while connecting server')
            } else {
                let request = new Request(storedProcedure, (err2, rowCount, rows) => {
                    if (err2) {
                        console.log('error proc:', err2.procName, ' - message: ', err2.message, ' - procline', err2.lineNumber)
                        reject('error in query execution')
                    } else {
                        conn.close()
                        injectjson(rows).then(valor => {
                            try {
                                const temp = valor[0].Result ? JSON.parse(valor[0].Result) : valor;
                                resolve(temp)
                            } catch (error) {
                                resolve(valor)
                                reject('error in query result')
                            }
                        })
                    }
                });
                if (parametros) {

                    try {
                        parametros.forEach(valor => {
                            request.addParameter(valor.nombre, valor.tipo, valor.valor)
                        })

                    } catch (error) {
                        console.log(error, 'error')
                    }
                }

                request.on('requestCompleted', () => {
                    conn.close()
                })
                request.on('error', (err3) => {
                    console.log(err3)
                    reject(err3)
                })
                try {
                    conn.callProcedure(request);
                } catch (error2) {
                    console.log(error2)
                }

            }
        });
        conn.on('error', (err) => {
            console.log(err)
            reject(err)
            reject('error connecting server')
            conn.close()
        });
        conn.connect();
    })
};


let injectjson = (rows) => {
    return new Promise((resolve, reject) => {
        let jsonArray = []
        rows.forEach((columns) => {
            let rowObject = {};
            columns.forEach((column) => {
                rowObject[column.metadata.colName] = column.value;
            });
            jsonArray.push(rowObject)
        });
        resolve(jsonArray)
    })

}
