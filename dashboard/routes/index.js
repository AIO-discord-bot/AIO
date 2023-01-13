const express = require("express"),
  CheckAuth = require("../auth/CheckAuth"),
  router = express.Router();

router.get("/", CheckAuth, async (req, res) => {
  res.redirect("/servers");
});

router.get("/servers", CheckAuth, async (req, res) => {
  res.render("servers", {
    user: req.userInfos,
    currentURL: `${req.client.config.DASHBOARD.baseURL}/${req.originalUrl}`,
  });
});

module.exports = router;