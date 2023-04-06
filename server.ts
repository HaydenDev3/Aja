import dotenv from 'dotenv';
import express, { Application, Request, Response } from 'express';
import { createServer } from 'http';
import path from 'path';
import CommandsManager from './managers/Commands';

dotenv.config();
const app: Application = express();
const server = createServer(app);
const commands = new CommandsManager();

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
  await commands.init();
});
