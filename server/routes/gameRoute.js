const router = require("express").Router();

const {
    randomNumber,
    sessionNumber,
    confirmAnswer,
    lostOrWin,
} = require("../controllers/gameControllers");

// /api/1.0
router.route("/function/randomWord")
    .get(randomNumber);

router.route("/function/sessionNumber")
    .get(sessionNumber);

router.route("/function/confirmAnswer")
    .post(confirmAnswer);

router.route("/function/lostOrWin")
    .post(lostOrWin);



module.exports = router;