import express, { NextFunction, Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";
import { User } from "../model/user";
import { BadRequestError, validateRequest } from "@goodmanltd/common";
const router = express.Router();

router.post(
  "/api/users/signup",
  // middleware using express validator
  [
    body("email")
      .isEmail() // check if there is email
      .withMessage("Email is not valid"), // error msg
    body("password")
      .trim() // trim leading or trailing space
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 chars"),
  ],
  validateRequest,
  //-----------------------------
  // real handler
  async (req: Request, res: Response, next: NextFunction) => {
    // check if req pass validation  => change to middleware

    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   return next(new ReqValidationError(errors.array()));
    // }

    // extract email & password from body
    const { email, password } = req.body;
    // check if the email has already been used
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new BadRequestError("User already exist"));
    }
    // hashing password

    // create user
    const user = User.build({ email, password });
    await user.save();

    // generate jwt

    // payload: id, email
    // a checking here only check with the app run this line
    // we would like know when the app start -> go to index.ts
    // if (!process.env.JWT_KEY) {
    //   throw new Error ('JWT key not found')
    // }
    const userJwt = jwt.sign(
      {
        // payload
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY! // secreate key   // add ! to tell ts to ignore checking
    );

    // send back cookie after created i.e. req.session

    // req.session.jwt = userJwt;   // ts issues -> req. session can be null
    // work around -> redefine the obj
    req.session = {
      jwt: userJwt,
    };

    res.status(201).send(user);
  }
);

export { router as signupRouter };
