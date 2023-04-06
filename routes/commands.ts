import express, { Request, Response } from "express";
import http from "http";
import { verifyString } from "discord.js"
export const router: express.Router = express.Router();
export enum ClientDetails {
    APP_ID = "994930207918129182",
    GUILD_ID = "1043318603392483358",

}

router.post("/interactions", (req: Request, res: Response) => {
    const { body } = req;
    const { type } = body;
    const signature = req.headers['x-signature-ed25519'];
    const timestamp = req.headers['x-signature-timestamp'];
    const rawBody = req.body;

    const isVerified = verifyString(rawBody);

    if (!isVerified) {
        return res.status(401).end('Invalid request signature');
    }

    // Check the type of incoming payload
    if (type === 1) {


        const options = {
            hostname: 'discord.com',
            port: 443,
            path: `/api/v10/applications/${ClientDetails.APP_ID}/commands`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bot ${process.env['BOT_TOKEN']}`
            }
        };

        const request = http.request(options, response => {
            let data = '';
      
            response.on('data', chunk => {
              data += chunk;
            });
      
            response.on('end', () => {
              console.log(data);
            });
        });

        const command = {
            name: "ping",
            description: 'Pong!'
          };
      
          const requestData = JSON.stringify(command);
      
          request.write(requestData);
          request.end();
      
          res.status(200).end();
        res.status(200).json({ type: 1 });
    } else if (type === 2) {
        // Handle ApplicationCommand payload
        console.log("Received ApplicationCommand payload from Discord");
        // Parse the incoming payload to get the command name and options
        const { data } = body;
        const { name, options } = data;
        console.log(`Command Name: ${name}`);
        console.log(`Command Options: ${JSON.stringify(options)}`);
        // TODO: Implement logic to handle the command and send a response
        res.status(200).send("Command received");
    } else {
        // Unknown payload type
        console.log(`Received unknown payload type from Discord: ${type}`);
        res.status(400).send("Unknown payload type");
    }
});