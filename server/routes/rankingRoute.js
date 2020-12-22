
const router = require("express").Router();

const {
    scoreRanking,
    buzzRanking,
} = require("../controllers/rankingControllers");

router.route("/ranking/score")
    .get(scoreRanking);

router.route("/ranking/buzz")
    .get(buzzRanking);





module.exports = router;