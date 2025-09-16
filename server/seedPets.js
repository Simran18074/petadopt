// seedPets.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import Pet from "./models/Pet.js";

dotenv.config();

// Read JSON file
const __dirname = path.resolve();
const petsData = JSON.parse(
  fs.readFileSync(path.join(__dirname, "pets.json"), "utf-8")
);

// Connect to MongoDB and seed
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ MongoDB connected for seeding...");

    // Clear existing pets
    await Pet.deleteMany();

    // Insert pets from JSON
    await Pet.insertMany(petsData);

    console.log(`✅ ${petsData.length} pets seeded successfully!`);
    process.exit();
  })
  .catch((err) => {
    console.error("❌ Seeding error:", err);
    process.exit(1);
  });
