const MongoClient = require("mongodb").MongoClient;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.login = (req, res) => {
  const { email, password } = req.body;
  const MONGO_USERNAME = process.env.MONGODB_USERNAME;
  const MONGO_PASSWORD = process.env.MONGODB_PASSWORD;
  const url = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@magic.uxmiw.mongodb.net/magic?authSource=admin&retryWrites=true&w=majority`;

  const client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  client.connect(async (err) => {
    try {
      // Error connecting to DB
      if (err) {
        client.close();
        throw err;
      }
      // Enforce lowercase on emails since they are case insensitive
      const lowerCaseEmail = email.toString().toLowerCase();

      // Initialize User Collection
      const userCollection = client.db("magic").collection("users");

      // Check if email already exists in DB
      const user = await userCollection.findOne({ email: lowerCaseEmail });

      // Check for user and password validity
      // If either or is not valid we should send a generic error response
      if (!!user && bcrypt.compareSync(password, user.password)) {
        // Generate Token
        const userToken = jwt.sign(lowerCaseEmail, TOKEN_SECRET, {epiresIn: '1800s'});
        res.status(200).send({ token: userToken });
      } else {
        res.status(401).send({ error: "Username / password not valid" });
      }

      client.close();
    } catch (e) {
      res.status(500).send({ error: "Unexpected Error Occured" });
    }
  });
};

exports.signup = (req, res) => {
  const MONGO_USERNAME = process.env.MONGODB_USERNAME;
  const MONGO_PASSWORD = process.env.MONGODB_PASSWORD;
  const TOKEN_SECRET = process.env.TOKEN_SECRET;
  const url = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@magic.uxmiw.mongodb.net/magic?authSource=admin&retryWrites=true&w=majority`;

  const { email, password } = req.body;

  const client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  client.connect(async (err) => {
    try {
      // Error connecting to DB
      if (err) {
        client.close();
        throw err;
      }

      // Enforce lowercase on emails since they are case insensitive
      const lowerCaseEmail = email.toString().toLowerCase();

      // Initialize User Collection
      const userCollection = client.db("magic").collection("users");

      // Check if email already exists in DB
      const count = await userCollection
        .find({ email: lowerCaseEmail })
        .count();

      if (count === 0) {
        const hashedPassword = bcrypt.hashSync(
          password,
          bcrypt.genSaltSync(8),
          null
        );
        const lowerCaseEmail = email.toString().toLowerCase();

        // Create User
        await userCollection.insertOne({
          email: lowerCaseEmail,
          password: hashedPassword,
        });

        // Generate Token
        const userToken = jwt.sign(lowerCaseEmail, TOKEN_SECRET, {epiresIn: '1800s'});
        res.status(201).send({ token: userToken });
      } else {
        res.status(409).send({ error: "This user already exists" });
      }
      client.close();
    } catch (e) {
      res.status(500).send({ error: "Unexpected Error Occured" });
    }
  });
};
