const csrf = require('csurf');
const properties = require('../properties/properties')

let exceptionHandler = (req, res, next) => {
    if (properties.ENV == 'Production') {
        if (req.url === '/api/test' || req.url === '/api/ccmslogin' || req.url === '/login' || req.url === '/container/main') {
            const csrfProtection = csrf({ cookie: { httpOnly: true, sameSite: 'strict', secure: true  }, ignoreMethods: ['POST', 'GET'] });
            csrfProtection(req, res, next);
        } else {
            const csrfProtection = csrf({ cookie: { httpOnly: true, sameSite: 'strict', secure: true  } });
            csrfProtection(req, res, next)
        }
    } else {
        const csrfProtection = csrf({ cookie: true, ignoreMethods: ['POST', 'GET'] });
        /* const csrfProtection = csrf({ cookie: { httpOnly: true, sameSite: 'strict', secure: true  }, ignoreMethods: ['POST', 'GET'] }); */
        csrfProtection(req, res, next);
    }
}

module.exports = { exceptionHandler }