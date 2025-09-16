// routes/petRoutes.js
import express from "express";
import Pet from "../models/Pet.js";

const router = express.Router();

// GET all pets with optional search query
router.get("/", async (req, res) => {
  try {
    const { q } = req.query;
    let query = {};

    if (q) {
      const regex = new RegExp(q, "i"); // case-insensitive
      query = {
        $or: [
          { name: { $regex: regex } },
          { type: { $regex: regex } },
          { breed: { $regex: regex } },
          { description: { $regex: regex } },
          { age: { $eq: Number(q) || -1 } }, // if user types a number, match age
        ],
      };
    }

    const pets = await Pet.find(query);
    res.json(pets);
  } catch (err) {
    console.error("Error fetching pets:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
