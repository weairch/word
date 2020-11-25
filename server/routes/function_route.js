const router = require("express").Router();

const {
    randomNumber
} = require("../controllers/function_controllers");


router.route("/function/randomWord")
    .get(randomNumber);


module.exports = router;