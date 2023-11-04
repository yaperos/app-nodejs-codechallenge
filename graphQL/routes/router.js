const routes = require("../controllers/routes.controller");
module.exports = (router) => {
    router.post("/readTransaction", (req, res) => {
        routes.readTransaction(req, res);
    });
    router.post("/antifraud", (req, res) => {
        routes.antifraud(req, res);
    });
    router.post("/approvedTransaction", (req, res) => {
        routes.approvedTransaction(req, res);
    });
};