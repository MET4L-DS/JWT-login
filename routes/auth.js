const express = require("express");

const router = express.Router();

const { login, register, refresh } = require("../controllers/auth");

router.post("/login", login);

router.post("/register", register);

router.post("/token", refresh);

module.exports = router;
