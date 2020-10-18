const mtgsdk = require("mtgsdk");

exports.getCards = (req, res) => {
  try {
    const cards = mtgsdk.card
      .where({ page: 1 })
      .then((cards) => res.status(200).send(cards));
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: "Unexpected Error Occured" });
  }
};
