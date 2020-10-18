const mtgsdk = require("mtgsdk");

exports.getCards = (req, res) => {
  try {
    const page = req.query.page;
    const cards = mtgsdk.card
      .where({ page })
      .then((cards) => res.status(200).send(cards));
  } catch (e) {
    res.status(500).send({ error: "Unexpected Error Occured" });
  }
};
