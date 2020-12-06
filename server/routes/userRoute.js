const router = require("express").Router();

const { 
    signIn,
    signUp,
    checkUserToken,
    sqlAddStandbyRoom,
    userIdAndNowRoom,
    addTokenPlayer_2,
    changeTokenToPlayer_1,
    needInformationStartGame,
}=require("../controllers/userController");

//url = /api/1.0/xxxx
router.route("/signin")
    .post(signIn);

router.route("/signup")
    .post(signUp);

router.route("/checkUserToken")
    .post(checkUserToken);

router.route("/sqlAddStandbyRoom")
    .post(sqlAddStandbyRoom);

router.route("/userIdAndNowRoom")
    .post(userIdAndNowRoom);

router.route("/addTokenPlayer_2")
    .post(addTokenPlayer_2);

router.route("/changeTokenToPlayer_1")
    .post(changeTokenToPlayer_1);

router.route("/needInformationStartGame")
    .get(needInformationStartGame);

module.exports = router;