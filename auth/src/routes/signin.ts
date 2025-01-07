import express, { NextFunction, Request, Response } from "express";
import { body } from "express-validator";
import { User } from "../model/user";
import { PasswordManager } from "../services/password-manager";
import jwt from "jsonwebtoken";
import { BadRequestError, validateRequest } from "@goodmanltd/common";
const router = express.Router();

router.post(
  "/api/users/signin",
  // validation
  [
    body("email")
      .isEmail() // check if it is a email
      .withMessage("Email is not valid"),
    body("password")
      .trim() // trim leading or trailing space
      .notEmpty()
      .withMessage("Password must be provided"),
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    // extract email & password from body
    const { email, password } = req.body;

    // check if user exist
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      // in authentication -> provide as little info as possible
      // return next(new BadRequestError("User don't exist"));
      return next(new BadRequestError("Invalid credentials"));
    }

    // check if password match
    const pwMatch = await PasswordManager.compare(
      existingUser.password,
      password
    );
    if (!pwMatch) {
      return next(new BadRequestError("Invalid credentials"));
    }

    // generate token
    const userJwt = jwt.sign(
      {
        // payload
        id: existingUser.id,
        email: existingUser.email,
      },
      process.env.JWT_KEY! // secreate key   // add ! to tell ts to ignore checking
    );
    // store jwt in session
    req.session = {
      jwt: userJwt,
    };

    res.status(200).send(existingUser);
  }
);

export { router as signinRouter };
