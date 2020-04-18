const express = require('express');
const router = express.Router();
const NBA = require('nba');

/* GET home page. */
router.get('/', (req, res, next) => {
    res.send('hello world');
});

// NBA API Routes
router.get('/nba/teamSearch', (req, res, next) => {
    const term = req.query.searchTerm;

    const data = NBA.teams.filter((team) => team.teamName.match(new RegExp(term)));
    res.json({ data });
});


router.get('/nba/playerSearch', (req, res, next) => {
    const term = req.query.searchTerm;

    const data = NBA.players.filter(player => player.fullName.match(new RegExp(term)));

    res.json({data});
});


module.exports = router;
