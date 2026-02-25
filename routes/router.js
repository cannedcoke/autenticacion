const express = require("express");
const router = express.Router();
const authenticate = require("../middlewares/authenticate");
const retires = require("../middlewares/retires");
const controller = require("../controllers/controller");

// defino api endpoints y le indico que funcion del controlador usar

router.post("/signUp", controller.signUp);

router.post("/logIn",retires, controller.logIn);

router.post("/logout", controller.logout);

router.get("/getData",authenticate, controller.displayDash);

router.delete("/delete",authenticate, controller.delRow);

// exporto para poder acceder externamente
module.exports = router;
