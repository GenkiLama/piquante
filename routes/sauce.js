const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const {
  createSauceInputValidator,
  modifySauceInputValidator,
} = require("../middleware/inputValidator");

const {
  createSauce,
  getAllSauces,
  getSauce,
  modifySauce,
  deleteSauce,
  likeSauce,
} = require("../controllers/sauce");

router.post("/", auth, multer, createSauceInputValidator, createSauce);
router.get("/", auth, getAllSauces);
router.get("/:id", auth, getSauce);
router.put("/:id", auth, multer, modifySauceInputValidator, modifySauce);
router.delete("/:id", auth, deleteSauce);
router.post("/:id/like", auth, likeSauce);

module.exports = router;
