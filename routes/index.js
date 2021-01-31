const express = require("express");
const router = express.Router();
const cors = require("cors");
const nba = require("./nba-api");
const magic = require("./magic-api");
const altus = require("./altus-assessment");

const whiteList = ["https://nba.hkung.me", "https://magic.hkung.me"];

const corsOption = {
  origin: (origin) => {
    if (whiteList.indexOf(origin) > -1) {
      callback(null, true);
    } else {
      callback(new Error("Invalid CORS"));
    }
  },
};

/* GET home page. */
router.get("/", (req, res, next) => {
  res.redirect("https://hkung.me");
});

// NBA API Routes
router.get("/nba/teamSearch", cors(), nba.teamSearch);
router.get("/nba/playerSearch", cors(), nba.playerSearch);
router.get("/nba/playerDetailsSearch", cors(), nba.playerDetailsSearch);

// MAGIC API Routes
router.post("/magic/login", cors(), magic.login);
router.post("/magic/signup", cors(), magic.signup);
router.get("/magic/cards", cors(), magic.jwtAuth, magic.getCards);
// router.get('/magic/my-cards', cors(), magic.jwtAuth, magic.getMyCards);
// router.psost('/magic/my-cards', cors(), magic.jwtAuth, magic.saveCard);

// Altus Assessments
router.get("/school/grades", cors(), altus.getSchoolGrades);

module.exports = router;
