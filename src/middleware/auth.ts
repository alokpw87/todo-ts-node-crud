import { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

export const auth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.headers["authorization"]?.replace("Bearer ", "");
    if (!token) {
      res
        .status(401)
        .json({ message: "unauthenticated user. please provide token!" });
        return;
    }
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY || "alok@132@@#*&");
    req.body.token = decodedToken;
    next();
  } catch (err) {
    res
      .status(401)
      .json({
        message: "unauthenticated user. please provide valid token!",
        err,
      });
  }
};
