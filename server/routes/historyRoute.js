const router = require("express").Router();



const {
    historySingle,
    historyMulti,
    historyDetaile
} = require("../controllers/historygameControllers");


router.route("/history/single")
    .get(historySingle);

router.route("/history/multi")
    .get(historyMulti);

router.route("/history/detaile")
    .post(historyDetaile);



module.exports = router;