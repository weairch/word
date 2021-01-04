
const router=require("express").Router();

const {
    getBuzzRanking,
    getScoreRanking
}=require("../controllers/rankingControllers");

router.route("/ranking/score")
    .get(getScoreRanking);

router.route("/ranking/buzz")
    .get(getBuzzRanking);





module.exports=router;