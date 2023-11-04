require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const properties = require("./properties/properties");
const port = properties.PORT;
const cors = require("cors");
const app = express();
const urlbase = "*";
const corsOptions = {
    // origin: "Aqui va la DNS",
    origin: urlbase,
};
/* seguridad */
app.use(function (req, res, next) {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next()
});
app.use(cors(corsOptions));
const requestIp = require("request-ip");
const helmet = require("helmet");
const router = express.Router();
const routes = require("./routes/router");
const path = require("path");

app.use(
    bodyParser.urlencoded({
        extended: true,
        limit: '50mb'
    })
);
app.disable('x-powered-by');
app.use(
    bodyParser.json({
        limit: "50mb",
        type: "application/json",
    })
);
app.use(requestIp.mw());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, "/dist")));
app.use((req, res, next) => {
    res.set({
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
    });
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', urlbase);

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    
    next();
    
});
app.use(helmet.noSniff());
app.use(helmet.hidePoweredBy());
app.use(helmet.permittedCrossDomainPolicies());
app.use(cookieParser());

app.use("/api", router);
routes(router);

app.listen(port, function () {
    console.log(
        properties.ENV,
        ": Listening on port",
        port,
        "- start:",
        Date(Date.now()).toString()
    );
});

