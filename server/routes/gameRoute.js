const router = require("express").Router();

const {
    // ThirtyWord,
    gameStatus,
    nowGameTopicNnumber,
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
    confirmStatus,
    updataStatusAndNumber,
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

router.route("/function/nowGameTopicNnumber")
    .post(nowGameTopicNnumber);

router.route("/function/updataTopicError")
    .post(gameStatus);

router.route("/function/confirmStatus")
    .post(confirmStatus);

router.route("/function/updataStatusAndNumber")
    .post(updataStatusAndNumber);

// router.route("/function/ThirtyWord")
//     .get(ThirtyWord);
module.exports = router;