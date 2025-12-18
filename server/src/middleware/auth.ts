import { Request, Response, NextFunction } from "express";

export interface AuthPayload {
  userId: string;
  role: "patient";
}

declare module "express-serve-static-core" {
  interface Request {
    user?: AuthPayload;
  }
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  /**
   * Demo-only auth middleware
   *
   * The current frontend does not implement authentication and the
   * user requested that no authentication be required anywhere.
   * To keep the rest of the code (which expects `req.user`) working
   * without changes, we simply attach a static demo user and always
   * call `next()`.
   */
  if (!req.user) {
    req.user = {
      userId: "demo-user",
      role: "patient",
    };
  }

  next();
};

