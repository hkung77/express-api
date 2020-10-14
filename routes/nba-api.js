const NBA = require("nba");
const getImage = require("./getImage");

exports.teamSearch = (req, res, next) => {
  const term = req.query.searchTerm;

  const data = NBA.teams.filter((team) =>
    team.teamName.match(new RegExp(term, "i"))
  );
  data.forEach(async (teams, index) => {
    const response = await getImage(teams.teamName);
    const image = response.items[0].link;
    teams.image = image;

    if (data.length === index + 1) {
      res.json({ data });
    }
  });
};

exports.playerSearch = (req, res, next) => {
  const term = req.query.searchTerm;

  const data = NBA.players.filter((player) =>
    player.fullName.match(new RegExp(term, "i"))
  );
  data.forEach(async (player, index) => {
    const response = await getImage(player.fullName);
    const image = response.items[0].link;
    player.image = image;

    if (data.length === index + 1) {
      res.json({ data });
    }
  });
};

exports.playerDetailsSearch = async (req, res, next) => {
  const playerId = req.query.playerId;
  const data = {};
  try {
    data["bio"] = await NBA.stats.playerInfo({ PlayerID: playerId });
    data["stats"] = await NBA.stats.playerProfile({ PlayerID: playerId });
    res.json({ data });
  } catch (error) {
    console.error(error);
    res.status(404).send({ message: "Player not found" });
  }
};
