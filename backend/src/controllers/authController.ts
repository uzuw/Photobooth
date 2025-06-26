import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import User from "../models/User";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

export interface AuthRequest extends Request {
  user?: { id: string };
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    req.user = { id: decoded.id };
    next();
  } catch {
    res.status(403).json({ message: "Invalid token" });
  }
};

// ✅ REGISTER (with username)
const register = async (req: Request, res: Response) => {
  const { name, username, password } = req.body;

  const existing = await User.findOne({ username });
  if (existing)
    return res.status(400).json({ message: "Username already exists" });

  const hashed = await bcrypt.hash(password, 10);
  const user = new User({ name, username, password: hashed });
  await user.save();

  res.status(201).json({ message: "User created successfully" });
};

// ✅ LOGIN (with username)
const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1d" });

  res.status(200).json({
    message: "Login successful",
    token,
    user: { id: user._id, name: user.name, username: user.username },
  });
};

export {login, register};