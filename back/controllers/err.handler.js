const { decrypt } = require('./crypt.controller')


let errorHandler = (err, req, res, next) => {
    let ip = req.clientIp;
    let date = new Date()
    console.log(date, "ip: " + ip, req.originalUrl, err.name)
    
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({message: 'UnauthorizedError', code: 400})
    } else if (err.name === 'ForbiddenError') {
        res.status(401).json({message: 'ForbiddenError', code: 401})
    } else {
        res.status(401).json({message: 'Unknown error: ' + err.name, code: 400})
    }
}

let logger = (req, res, next) => {
    let ip = req.clientIp
    try {
        let url = req.originalUrl
        let body = JSON.stringify(req.body)
        let fecha = new Date()
        if (url != '/') {
            console.log(fecha, "ip: " + ip, url, body)
        }
        next()
    } catch (error) {
        next()
    }
}


let middleware = (req, res, next) => {
    let data = {}

    let user = req.hasOwnProperty('user')
    let bodyEdata = req.body.hasOwnProperty('edata')

    try {
        if (bodyEdata) {
            data = decrypt(req.body.edata)
            data = JSON.parse(data)
        } else if (user) {
            if (req.user.data) {
                data = decrypt(req.user.data)
                data = JSON.parse(data)
            } else {
                data = decrypt(req.user.data.edata)
                data = JSON.parse(data)
            }

        }
        req.user = data
        next();
    } catch (error) {
            next();
    }
}

module.exports = { middleware, logger, errorHandler }
