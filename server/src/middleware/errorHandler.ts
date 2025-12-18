import { Request, Response, NextFunction } from "express";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  console.error(err);
  const status = err.statusCode ?? 500;
  res.status(status).json({
    message: err.message ?? "Internal server error",
  });
};

