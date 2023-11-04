require("dotenv").config();
var { expressjwt: jwt } = require("express-jwt");

exports.jwt = () => {
    const secret  = process.env.SECRET;
    const algorithms = process.env.ALGORITHM;
    return jwt({ algorithms: [algorithms], secret })
    .unless({
        path: [
            '/api/ccmslogin',
            '/api/refreshToken',
            '/container/main'
        ]
    });
}

