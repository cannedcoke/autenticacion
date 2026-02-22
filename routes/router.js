const express = require("express");
const router = express.Router();
const controller = require("../controllers/controller");


// defino api endpoints y le indico que funcion del controlador usar

router.post("/signUp", controller.signUp);
router.post("/logIn", controller.logIn);

// exporto para poder acceder externamente
module.exports = router;
