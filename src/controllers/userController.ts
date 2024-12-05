import { Request, Response } from "express";
import { User } from "../models/user";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

dotenv.config();

export const userRegister = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password, name } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "Email already registered!" });
    }
    const hashedpassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedpassword });
    const createdUser = await user.save();
    res.status(201).json(createdUser);
  } catch (err) {
    res.status(400).json({ message: "User signup failed", err });
  }
};

export const userLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: "User not register with this email!" });
      return;
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res
        .status(400)
        .json({ message: "Password Incorrect. please try again!" });
    }
    const accessToken = jwt.sign(
      JSON.stringify(user),
      process.env.SECRET_KEY || "alok@132@@#*&"
    );
    res.status(200).json({ accessToken: accessToken });
  } catch (err) {
    res.status(400).json({ message: "login failed!", err });
  }
};
