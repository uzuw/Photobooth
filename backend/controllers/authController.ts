import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User";

const JWT_SECRET = process.env.JWT_SECRET!;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}


export const register= async(req:Request, res:Response)=>{
    const {username, password} = req.body;
    try {
        // Check if user already exists
        const existingUser = await User.findOne({username});
        if(existingUser){
            return res.status(400).json({message: "User already exists"});
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ username, password: hashedPassword });

         const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: "2h" });
        res.status(201).json({ token });


    }
    catch(error){
        console.error("Error during registration:", error);
        return res.status(500).json({message: "Internal server error"});
    }
}

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "2h" });
  res.json({ token });
};