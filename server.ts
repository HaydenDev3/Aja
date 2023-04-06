import dotenv from "dotenv";
dotenv.config();

import express, { Application, Request, Response } from 'express';
import { createServer } from 'http';
import { router as CommandsRouter } from './routes/commands';

const app = express();
export const server = createServer(app);

app.get('/', (req: Request, res: Response) => 
    res.status(200).send("Hello World"));

app.use('/commands', CommandsRouter);
server.listen(3000, "0.0.0.0", () => console.log("Hello World"));