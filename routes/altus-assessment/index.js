const express = require("express");
const { Parser } = require("json2csv");
const router = express.Router();
const MongoClient = require("mongodb").MongoClient;

exports.getSchoolGrades = (req, res, next) => {
  const MONGO_USERNAME = process.env.MONGODB_USERNAME;
  const MONGO_PASSWORD = process.env.MONGODB_PASSWORD;
  const url = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@magic.uxmiw.mongodb.net/magic?authSource=admin&retryWrites=true&w=majority`;

  const fields = ["student_id", "grade"];
  const json2csv = new Parser({ fields });

  try {
    const schoolName = (decodeURI(req.query.schoolName) || "").toLowerCase();
    if (schoolName.length === 0) {
      res.status(400).send({ error: "Missing school name" });
    } else {
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
          } else {
            const school = await client
              .db("Altus")
              .collection("schools")
              .findOne({ name: schoolName });

            if (!school) {
              res.status(404).send({ error: "School not found" });
            }

            const grades = await client
              .db("Altus")
              .collection("grades")
              .find({ school_id: { $eq: `${school._id}` } })
              .toArray();

            console.log(grades);
            const csv = json2csv.parse(grades);
            res.setHeader("Content-Type", "text/csv");
            res.setHeader(
              "Content-Disposition",
              "attachment; filename=grades.csv"
            );
            res.status(200).send(csv);
            client.close();
          }
        } catch (e) {
          console.error(e);
          client.close();
        }
      });
    }
  } catch (e) {
    console.error(e);
  }
};
