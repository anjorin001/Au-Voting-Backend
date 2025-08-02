const mongoose = require("mongoose");
require("dotenv").config();
const User = require("../models/userModel.js"); 

mongoose.set("strictQuery", true);

const removeDbField = async () => {
  try {
    const dbUri = process.env.MONGODB_URI;
    if (!dbUri) throw new Error("No DB URI found");

    const conn = await mongoose.connect(dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ Connected to DB");

    const result = await User.updateMany(
      { participatedElection: { $exists: true } },
      { $unset: { participatedElection: "" } }
    );
    console.log("Update result:", result);

    await conn.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("❌ Error removing field", err);
    process.exit(1);
  }
};

removeDbField();
