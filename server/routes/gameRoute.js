const router = require("express").Router();

const {
    getThisSessionBuzzTopic,
    getRandomNumber,
    getSessionNumber,
    confirmAnswer,
    getLostOrWin,
    addSingleModeAndSession,
    getRandomSession,
    getSinglePlayerResult,
    serchRoom,
    insertBuzzGameInfomation,
} = require("../controllers/gameControllers");

// /api/1.0
router.route("/function/randomWord")
    .get(getRandomNumber);

router.route("/function/getSessionNumber")
    .get(getSessionNumber);

router.route("/function/confirmAnswer")
    .post(confirmAnswer);

router.route("/function/getLostOrWin")
    .post(getLostOrWin);

router.route("/function/addSingleModeAndSession")
    .post(addSingleModeAndSession);

router.route("/function/getRandomSession")
    .get(getRandomSession);

router.route("/function/getSinglePlayerResult")
    .post(getSinglePlayerResult);

router.route("/function/serchRoom")
    .get(serchRoom);

router.route("/function/insertBuzzGameInfomation")
    .post(insertBuzzGameInfomation);

router.route("/function/getThisSessionBuzzTopic")
    .post(getThisSessionBuzzTopic);

module.exports = router;