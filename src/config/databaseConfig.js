const mongoose = require("mongoose");
require("dotenv").config(); 

const mongodbConnect = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MongoDB URI is missing. Check your .env file.");
  }

  try {
    await mongoose.connect(uri);
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ Error connecting to DB", err);
    process.exit(1);
  }
};

module.exports = mongodbConnect;
