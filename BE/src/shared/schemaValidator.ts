import { Request, Response, NextFunction } from "express";
import { ZodError, ZodType } from "zod";
import { InternalServerError, NotFoundError } from "./errorsModel.js";

export type ValidationSchemas = {
  body?: ZodType<unknown>;
  params?: ZodType<unknown>;
  query?: ZodType<unknown>;
};

export const validate =
  (schemas: ValidationSchemas) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schemas.body) {
        const parsedBody = schemas.body.parse(req.body);
        res.locals.body = parsedBody; 
      }

      if (schemas.params) {
        const parsedParams = schemas.params.parse(req.params);
        res.locals.params = parsedParams;
      }

      if (schemas.query) {
        const parsedQuery = schemas.query.parse(req.query);
        res.locals.query = parsedQuery;
      }

      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.issues.map(err => ({
            path: err.path.join("."),
            message: err.message
          }))
        });
      }

      throw new InternalServerError("Error interno del servidor2");
      };
  };