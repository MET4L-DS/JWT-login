const express = require("express");

const router = express.Router();

const { greeting } = require("../controllers/main");
const { authMiddleware } = require("../middleware/auth_middleware");

router.get("/", authMiddleware, greeting);

module.exports = router;
