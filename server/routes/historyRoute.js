const router = require("express").Router();



const {
    historyAll,
    historyDetaile
} = require("../controllers/historygameControllers");


router.route("/history/all")
    .get(historyAll);

router.route("/history/detaile")
    .post(historyDetaile);



module.exports = router;