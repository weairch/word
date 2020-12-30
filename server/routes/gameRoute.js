const router = require("express").Router();

const {
    gameBuzzTopic,
    randomNumber,
    sessionNumber,
    confirmAnswer,
    lostOrWin,
    addSingleModeAndSession,
    randomSession,
    checkAll,
    serchRoom,
    insertBuzzGameInfomation,
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

router.route("/function/addSingleModeAndSession")
    .post(addSingleModeAndSession);

router.route("/function/randomSession")
    .get(randomSession);

router.route("/function/checkAll")
    .post(checkAll);

router.route("/function/serchRoom")
    .get(serchRoom);

router.route("/function/insertBuzzGameInfomation")
    .post(insertBuzzGameInfomation);

router.route("/function/gameBuzzTopic")
    .post(gameBuzzTopic);

module.exports = router;