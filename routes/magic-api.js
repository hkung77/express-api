const MongoClient = require('mongodb').MongoClient;

exports.login = (req, res) => {
  res.status(200).send({token: "TBD"})
}

exports.signup = (req, res) => {
  const MONGO_USERNAME= process.env.MONGODB_USERNAME;
  const MONGO_PASSWORD= process.env.MONGODB_PASSWORD;
  const url = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@magic.uxmiw.mongodb.net/magic?authSource=admin&retryWrites=true&w=majority`

  const {email, password} = req.body;

  const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
  client.connect(async err => {
    // Error connecting to DB
    if (err) {
      res.status(500).send({ error: "Unexpected Error Occured" });
      client.close();
      return;
    } 

    // Enforce lowercase on emails since they are case insensitive
    const lowerCaseEmail = email.toString().toLowerCase();

    // Initialize User Collection
    const userCollection = client.db("magic").collection("users");

    // Check if email already exists in DB
    const count = await userCollection.find({ email: lowerCaseEmail }).count();
    if (count === 0) {
      // TODO:
      // Hash password
      const lowerCaseEmail = email.toString().toLowerCase();
      // TODO:
      // Generate a JWT 
      await userCollection.insertOne({ email: lowerCaseEmail, password });
      res.status(201).send({token: "TBD"});
    } else {
      res.status(409).send({ error: "This user already exists" });
    }
    client.close();
  });
}