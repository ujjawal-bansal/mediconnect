import { Router } from "express";
import { FirstAid } from "../models/FirstAid";

const router = Router();

router.get("/categories", async (_req, res, next) => {
  try {
    const categories = await FirstAid.find().select("category title icon summary");
    res.json(categories);
  } catch (err) {
    next(err);
  }
});

router.get("/:category", async (req, res, next) => {
  try {
    const doc = await FirstAid.findOne({ category: req.params.category });
    if (!doc) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json(doc);
  } catch (err) {
    next(err);
  }
});

export default router;

