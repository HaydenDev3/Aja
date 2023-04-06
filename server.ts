import axios from 'axios';
import dotenv from 'dotenv';
import express, { Application, Request, Response } from 'express';
import { createServer } from 'http';
import path from 'path';
import CommandsManager from './managers/Commands';

dotenv.config();
const app: Application = express();
const server = createServer(app);
const commands = new CommandsManager();

const setBotStatus = async () => {
    const payload = {
      op: 3, // opcode for setting status
      d: {
        status: 'idle',
        activities: [{
          name: 'with HTTP and Axios!',
          type: 0 // 0 for playing, 1 for streaming, 2 for listening, 3 for watching
        }]
      }
    };
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bot ${process.env.BOT_TOKEN as string}`
    };
    const options = {
      hostname: 'discord.com',
      port: 443,
      path: '/api/v10/gateway/status',
      method: 'POST',
      headers: headers
    };
  
    try {
      const response = await axios.post(`https://${options.hostname}${options.path}`, payload, { headers });
      console.log('Bot status set successfully:', response.data);
    } catch (error: any) {
      console.error('Error setting bot status:', error.response.data);
    }
};

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req: Request, res: Response) =>
  res.status(200).sendFile(path.join(__dirname, 'public', 'index.html'))
);

app.get('/tos', (req: Request, res: Response) =>
  res.status(200).sendFile(path.join(__dirname, 'public', 'Terms_Of_Service.html'))
);

app.get('/privacy', (req: Request, res: Response) =>
  res.status(200).sendFile(path.join(__dirname, 'public', 'Privacy_Policy.html'))
);

server.listen(3000, '0.0.0.0', async () => {
    console.log('Server listening on port 3000');
    //   await commands.init();
    setBotStatus();
});
