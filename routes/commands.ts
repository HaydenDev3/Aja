import express, { Request, Response } from "express";

export const router: express.Router = express.Router();
export enum ClientDetails {
    APP_ID = "994930207918129182",
    GUILD_ID = ""
}

router.post("/interactions", (req: Request, res: Response) => {
    const { body } = req;
    const { type } = body;

    // Check the type of incoming payload
    if (type === 1) {


        const options = {
            hostname: 'discord.com',
            port: 443,
            path: `/api/v8/applications/${ClientDetails.APP_ID}/commands`,
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bot ${process.env['BOT_TOKEN']}`
            }
        };
        // Handle Ping payload
        console.log("Received Ping payload from Discord");
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