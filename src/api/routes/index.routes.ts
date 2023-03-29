import express, { Request, Response } from "express";
import RegisteringService from "../../services/registering.service";
import Deps from "../../utils/Deps";
import { router as AuthRoutes } from "./auth.routes";

export const router = express.Router({ caseSensitive: false });

const registra: RegisteringService =
  Deps.get<RegisteringService>(RegisteringService);

router.get("/", async (req: Request, res: Response) =>
  res.status(200).json({ code: res.statusCode, message: "Hello World" })
);

router.get("/commands", async (req: Request, res: Response) => {
  return res.status(200).json({
    message: Array.from(registra.commands.values()),
    slash: Array.from(registra.slashCommands.values()),
  });
});

router.use("/auth", AuthRoutes);
