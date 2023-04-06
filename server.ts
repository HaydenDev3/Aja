import dotenv from "dotenv";
dotenv.config();

import express, { Application, Request, Response } from 'express';
import { createServer } from 'http';
import { router as CommandsRouter } from './routes/commands';
import config from "./config.json";
import { load } from 'particles.js';
import path from "path";

const app = express();
export const server = createServer(app);

app.use(express.static(path.join(__dirname,'public')));

/* particlesJS.load(@dom-id, @path-json, @callback (optional)); */
load('particles-js', 'assets/particles.json', function() {
    console.log('callback - particles.js config loaded');
  });

app.get('/', (req: Request, res: Response) => 
    res.status(200).sendFile(path.join(__dirname, "public", "index.html")));

app.get('/tos', (req: Request, res: Response) => 
    res.status(200).sendFile(path.join(__dirname, "public", "Terms_Of_Service.html")));

app.get('/privacy', (req: Request, res: Response) => 
    res.status(200).sendFile(path.join(__dirname, "public", "Privacy_Policy.html")));

app.use('/commands', CommandsRouter);
server.listen(3000, "0.0.0.0", () => console.log("Hello World"));