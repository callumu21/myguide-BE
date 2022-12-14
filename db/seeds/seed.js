const { MongoClient } = require("mongodb");
const mongoose = require("mongoose");
const Site = require("../../siteQuery");
const Tour = require("../../tourQuery");

const ENV = process.env.NODE_ENV || "development";

require("dotenv").config({ path: `./.env.${ENV}` });

const uri = process.env.MONGO_URI;

mongoose.connect(uri, () => {
  console.log("connected"),
    (err) => {
      console.log(err);
    };
});

const client = new MongoClient(uri);

const seed = async ({ siteData, tourData }) => {
  const collection = client.db(ENV).collection("counters");
  await collection.updateOne(
    { id: "siteId" },
    { $set: { seq: siteData.length } }
  );
  await Site.deleteMany({});
  await Site.insertMany(siteData);
  await collection.updateOne(
    { id: "tourId" },
    { $set: { seq: tourData.length } }
  );
  await Tour.deleteMany({});
  await Tour.insertMany(tourData);
};

module.exports = seed;
