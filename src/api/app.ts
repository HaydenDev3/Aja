import express from "express";
import bodyParser from "body-parser";
import session from "express-session";
import passport from "passport";
import config from "../utils/Config";
import User from "../database/models/AuthUser";
import { router as ApiRoutes } from "./routes/index.routes";
import Log from "../utils/Log";
import {
  Strategy as DiscordStrategy,
  Profile as DiscordProfile,
} from "passport-discord";
import connectMongoDBSession from "connect-mongodb-session";

const app = express();

export class API { 
  private MongoDBStore = connectMongoDBSession(session);

  constructor () {
      app.use(bodyParser.json());
      app.use(bodyParser.urlencoded({ extended: true }));

      app.use("/api", ApiRoutes);
  }

  public init () {
    app.use(
      session({
        secret: config.discord.clientSecret,
        resave: false,
        saveUninitialized: false,
        store: new this.MongoDBStore({
          uri: config.database.uri,
          collection: "sessions",
        }),
      })
    );

    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(
      new DiscordStrategy(
        {
          clientID: config.discord.clientID,
          clientSecret: config.discord.clientSecret,
          callbackURL: `${config.api.url}/auth/discord/callback`,
          scope: ["identify", "guilds"],
          passReqToCallback: true,
        },
        async (
          req: any,
          accessToken: string,
          refreshToken: string,
          profile: DiscordProfile,
          done
        ) => {
          try {
            const existingUser = await User.findOne({ discordId: profile.id });
            if (existingUser) {
              return done(null, existingUser);
            }

            const newUser = new User({
              discordId: profile.id,
              username: profile.username,
              discriminator: profile.discriminator,
              avatar: profile.avatar,
              guilds: profile.guilds?.map((guild) => ({
                id: guild.id,
                name: guild.name,
              })),
            });

            await newUser.save();
            done(null, newUser);
          } catch (err) {
            done(err as Error);
          }
        }
      )
    );

    passport.serializeUser((user: any, done) => {
      done(null, user._id);
    });

    passport.deserializeUser(async (id: string, done) => {
      await User.findOne({ _id: id }).then((user) => {
        done(null, user);
      });
    });
  }
}

app.listen(1000, () => Log.info("Server is live with port 1000", "api"));