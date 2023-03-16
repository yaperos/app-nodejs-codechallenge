const responseHelper = require(`@api/helpers/Response`)

// Init logger
const path = require(`path`)
const scriptName = path.basename(__filename)
const logger = require(`@loaders/logger`)(scriptName)

class ExpressController {

    receive (req, res) {

        logger.info({ functionExec: `receive`, message: `Message received from internet` })
        
        const data = 'Menssage received from internet'
        const response = responseHelper.templateSuccess(data)

        res.send(response)
    }

}

module.exports = ExpressController
