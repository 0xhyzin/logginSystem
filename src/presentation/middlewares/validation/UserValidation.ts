import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";

export const ValidationCreateUser = (req :Request, res :Response , next:NextFunction ) => {
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
