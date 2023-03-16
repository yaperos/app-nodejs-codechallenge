'user strict'

// helpers
const requestHelper = require(`@api/helpers/Request`)

// Init logger
const path = require(`path`)
const scriptName = path.basename(__filename)
const logger = require(`@loaders/logger`)(scriptName)

const validateCredentials = async (req, res, next) => {
    logger.info({ functionExec: `credentials`, message: `Validating credentials` })

    try {
        next()
    } catch (error) {
        logger.error({ functionExec: `sendMessage`, message: error.message })
        res.sendStatus(200)
    }
}


module.exports = { validateCredentials }
