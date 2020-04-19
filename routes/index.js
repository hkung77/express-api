const express = require('express');
const router = express.Router();
const cors = require('cors');
const NBA = require('nba');

const getImage = require('./getImage');

const whiteList = ['https://nba.hkung.me', 'http://nba.hkung.me'];


const corsOption = {
    origin: (origin) => {
        if (whiteList.indexOf(origin) > -1) {
            callback(null, true);
        } else {
            callback(new Error('Invalid CORS'));
        }
    }
};

/* GET home page. */
router.get('/', (req, res, next) => {
    res.send('hello world');
});

// NBA API Routes

router.get('/nba/teamSearch', cors(), (req, res, next) => {
    const term = req.query.searchTerm;

    const data = NBA.teams.filter((team) => team.teamName.match(new RegExp(term, 'i')));
    data.forEach(async (teams, index) => {
        const response = await getImage(teams.teamName);
        const image = response.items[0].link;
        teams.image = image;

        if (data.length === index+1) {
            res.json({ data });
        }
    });
});


router.get('/nba/playerSearch', cors(), (req, res, next) => {
    const term = req.query.searchTerm;

    const data = NBA.players.filter(player => player.fullName.match(new RegExp(term, 'i')));
    data.forEach(async (player, index) => {
        const response = await getImage(player.fullName);
        const image = response.items[0].link;
        player.image = image;

        if (data.length === index+1) {
            res.json({data});
        }
    })
});

router.get('/nba/playerDetailsSearch', cors(), async (req, res, next) => {
    const playerId = req.query.playerId;
    const data = {}
    try {
        data['bio'] = await NBA.stats.playerInfo({ PlayerID: playerId });
        data['stats'] = await NBA.stats.playerProfile({ PlayerID: playerId })
        res.json({data}); 
    } catch(error) {
        console.error(error);
        res.status(404).send({ message: "Player not found" });
    }
});

module.exports = router;
