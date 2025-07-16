// seed/faculties.js
const mongoose = require("mongoose");
require("dotenv").config(); 
const { availableFaculties } = require("../helper/facultys");
const Faculty = require("../models/facultyModel");
const dbUri = process.env.MONGODB_URI;

const seedFaculties = async () => {
  try {
    await mongoose.connect(dbUri);

    for (const name of availableFaculties) {
      const exists = await Faculty.findOne({ name });
      if (!exists) {
        await Faculty.create({ name, admins: [] });
        console.log(`✅ Seeded: ${name}`);
      } else {
        console.log(`ℹ️ Already exists: ${name}`);
      }
    }

    console.log("🎉 Faculty seeding complete.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding faculties:", err);
    process.exit(1);
  }
};

seedFaculties();
