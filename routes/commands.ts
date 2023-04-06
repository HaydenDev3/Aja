import express, { NextFunction, Request, Response } from "express";
import http from "http";
import { verifySignature } from "../managers/VerifyRequest";

export const router: express.Router = express.Router();

router.post("/interactions", (req: Request, res: Response, next: NextFunction) => {
  const { body } = req;
  const { type } = body;
  const signature = req.headers["x-signature-ed25519"];
  const timestamp = req.headers["x-signature-timestamp"];
  const rawBody = req.body;

  const isVerified = verifySignature(req, res, next);

  if ( !isVerified ) {
    return res.status(401).end("Invalid request signature");
  }

  if (type === 1) {
    const options = {
      hostname: "discord.com",
      port: 443,
      path: `/api/v10/applications/${process.env["APP_ID"]}/commands`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bot ${process.env["BOT_TOKEN"]}`,
      },
    };

    const request = http.request(options, (response) => {
      let data = "";

      response.on("data", (chunk) => {
        data += chunk;
      });

      response.on("end", () => {
        console.log(data);
      });
    });

    const command = {
      name: "ping",
      description: "Pong!",
    };

    const requestData = JSON.stringify(command);

    request.write(requestData);
    request.end();

    res.status(200).end();
  } else if (type === 2) {
    const { data } = body;
    const { name, options } = data;
    console.log(`Command Name: ${name}`);
    console.log(`Command Options: ${JSON.stringify(options)}`);
    res.status(200).send("Command received");
  } else {
    console.log(`Received unknown payload type from Discord: ${type}`);
    res.status(400).send("Unknown payload type");
  }
});