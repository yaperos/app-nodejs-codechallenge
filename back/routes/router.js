const routes = require("../controllers/routes.controller");
const oauth = require("../middleware/oauth");
module.exports = (router) => {
    //Login
    router.post("/login", (req, res) => {
        oauth.login(req, res);
    });
    router.post("/putDinamicCallSPs", (req, res) => {
        routes.putDinamicCall(req, res);
    });
    router.post("/send", (req, res) => {
        routes.sendEmail(req, res);
    });
};