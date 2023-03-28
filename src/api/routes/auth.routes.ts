import express, { Request, Response } from "express";
import passport from "passport";
import { Strategy as DiscordStrategy, Profile } from "passport-discord";
import User from "../../database/models/AuthUser";
import config from "../../utils/Config";

export const router = express.Router();

router.get("/", (req: Request, res: Response) =>
  res.status(200).json({
    code: res.statusCode,
    message:
      "There are 3 routes existing:\n/auth/discord\n/auth/discord/callback\n/auth/user",
  })
);

router.get("/discord", passport.authenticate("discord"));

router.get(
  "/discord/callback",
  passport.authenticate("discord", { failureRedirect: "/login" }),
  async (req: Request, res: Response) => {
    try {
      const { id, username, discriminator } = req.user as Profile;
      const guilds = (req.user as Profile)?.guilds?.map((guild) => ({
        id: guild.id,
        name: guild.name,
        permissions: guild.permissions,
      }));

      // find or create user in database
      const user = await User.findOneAndUpdate(
        { discordId: id },
        { username, discriminator, guilds },
        { upsert: true, new: true }
      );

      // set user in session
      req.user = user;

      // redirect to dashboard
      res.redirect(`${config.api.dashboard}/dashboard`);
    } catch (err) {
      console.error(err);
      res.redirect("/error");
    }
  }
);

router.get("/user", (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).send({ error: "Not authenticated" });
  }
  return res.send(req.user);
});
