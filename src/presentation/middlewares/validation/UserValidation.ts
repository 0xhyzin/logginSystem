import { NextFunction, Request, Response } from "express";
import { body, cookie, validationResult } from "express-validator";

export const ValidationCreateUser = (req: Request, res: Response, next: NextFunction) => {
    body("firstName")
        .notEmpty()
        .isAlpha()
        .withMessage("First name is required")
        .withMessage("First name must contain only letters")
    body("secoundName")
        .notEmpty()
        .isAlpha()
        .withMessage("Secound name is required")
        .withMessage("First name must contain only letters")
    body("email")
        .notEmpty()
        .isEmail()
        .withMessage("email is required")
    body("phone")
        .notEmpty()
        .withMessage("Secound name is phone")
        .withMessage("Phone number is invalid");
    body("password")
        .isLength({ min: 6 })
        .withMessage("Password is required")
        .withMessage("Password must be at least 6 characters");
    body("confirmPassword")
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error("Passwords do not match");
            }
            return true;
        })
        .notEmpty()
        .withMessage("Confirm password is required")

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }

    next();
}

export const ValidationLoginUser = (req: Request, res: Response, next: NextFunction) => {

    body("email")
        .notEmpty()
        .isEmail()
        .withMessage("email is required")
    body("password")
        .isLength({ min: 6 })
        .withMessage("Password is required")
        .withMessage("Password must be at least 6 characters");

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }

    next();
}

export const ValidationrefReshTockenUser = (req: Request, res: Response, next: NextFunction) => {
    if (req.cookies.refreshToken === null || req.cookies.refreshToken === "") {
        res.status(400).json({ errors: "Refresh token is missing. Please login again." });
    }
    next()
} 