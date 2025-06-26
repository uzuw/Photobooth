import express from "express";
const register = require("../controllers/authController").register;
const login = require("../controllers/authController").login;

const router = express.Router();

// POST /api/auth/register - Register new user
router.post("/register", register);

// POST /api/auth/login - Login user
router.post("/login", login);

export default router;
