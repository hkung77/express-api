const mtgsdk = require('mtgsdk');

exports.getCards = (req, res) => {
  const cards = mtgsdk.card.all({ pageSize: 1, });
  console.log(cards);
  res.status(200).send(cards)
}