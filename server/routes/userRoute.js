const router = require("express").Router();

const { 
    signIn,
    signUp,
    checkUserToken,
    sqlAddStandbyRoom,
    userIdAndNowRoom,
    needInformationStartGame,
    checkStandbyRoomModeAndRoom,
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

router.route("/needInformationStartGame")
    .get(needInformationStartGame);

router.route("/checkStandbyRoomModeAndRoom")
    .post(checkStandbyRoomModeAndRoom);
    
module.exports = router;