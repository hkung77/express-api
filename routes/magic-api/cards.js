const mtgsdk = require("mtgsdk");

exports.getCards = (req, res) => {
  try {
    const page = req.query.page;
    const colors = req.query.colors;
    const type = req.query.type;
    const text = req.query.text;

    const cards = mtgsdk.card
      .where({ page, colors, type, text })
      .then((cards) => res.status(200).send(cards));
  } catch (e) {
    res.status(500).send({ error: "Unexpected Error Occured" });
  }
};
