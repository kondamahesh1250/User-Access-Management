import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export interface AuthRequest extends Request {
  user?: { id: number; role: string };
}

export const authenticate = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    jwt.verify(token, process.env.JWT_SECRET!, (err, decoded: any) => {
      if (err || !roles.includes(decoded.role)) {
        res.status(403).json({ message: "Forbidden" });
        return;
      }

      req.user = decoded;
      next();
    });
  };
};


