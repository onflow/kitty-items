import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

// validateRequest works in conjunction with the 'express-validator' package. If we use the validations from
// 'express-validator', this middleware will check if any errors were thrown within the route and then
// return an appropriate error message to the API user.
const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({
      errors: errors.array(),
    });
  }
  next();
};

export { validateRequest };
