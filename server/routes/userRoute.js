const router=require("express").Router();

const { 
    signIn,
    signUp,
    checkUserToken,
    addStandbyRoomAndModeIntoToken,
    checkUserIdAndNowRoom,
    getInformationStartGame,
    checkStandbyRoomModeAndRoom,
    getProfileWinRat
}=require("../controllers/userController");

//url=/api/1.0/xxxx
router.route("/signin")
    .post(signIn);

router.route("/signup")
    .post(signUp);

router.route("/checkUserToken")
    .post(checkUserToken);

router.route("/addStandbyRoomAndModeIntoToken")
    .post(addStandbyRoomAndModeIntoToken);

router.route("/checkUserIdAndNowRoom")
    .post(checkUserIdAndNowRoom);

router.route("/getInformationStartGame")
    .get(getInformationStartGame);

router.route("/checkStandbyRoomModeAndRoom")
    .post(checkStandbyRoomModeAndRoom);
    
router.route("/getProfileWinRat")
    .get(getProfileWinRat);

module.exports=router;