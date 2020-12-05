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


exports.getMyCards = () => {
  const MONGO_USERNAME = process.env.MONGODB_USERNAME;
  const MONGO_PASSWORD = process.env.MONGODB_PASSWORD;
  const TOKEN_SECRET = process.env.TOKEN_SECRET;
  const url = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@magic.uxmiw.mongodb.net/magic?authSource=admin&retryWrites=true&w=majority`;

  const { email } = req.body;
  const lowerCaseEmail = email.toString().toLowerCase();

  const client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    client.connect(async (err) => {
      // Error connecting to DB
      if (err) {
        client.close();
        throw err;
      }
      // Initialize Cards Collection
      const userCardsCollection = client.db("magic").collection("cards");
      const cards = await userCollection
        .find({ email: lowerCaseEmail })
    })
  } catch (e) {}
}