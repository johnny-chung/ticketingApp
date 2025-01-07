import { currentUserMW } from "@goodmanltd/common";
import express, { NextFunction, Request, Response } from "express";

const router = express.Router();

router.get(
  "/api/users/currentuser",
  currentUserMW,
  (req: Request, res: Response, next: NextFunction) => {
    console.log(JSON.stringify(req.currentUser));
    res.send({ currentUser: req.currentUser ?? null });
  }
);

export { router as currentUserRouter };
