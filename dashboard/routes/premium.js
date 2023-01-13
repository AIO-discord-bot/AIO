const { getSettings } = require("@root/src/schemas/Guild");

const express = require("express"),
  utils = require("../utils"),
  CheckAuth = require("../auth/CheckAuth"),
  router = express.Router();
  

router.get("/", CheckAuth, async (req, res) => {
  res.render("premium/index", {
    user: req.userInfos,
    currentURL: `${req.protocol}://${req.get("host")}${req.originalUrl}`
  });

});

module.exports = router;