import { createHmac } from "crypto";
import { Request, Response } from "express";
import { ClientDetails } from "../routes/commands";

export function verifySignature(request: Request, response: Response, next: () => void) {
    const signature: string = request.headers['x-signature-ed25519'] as string;
    const timestamp: string = request.headers['x-signature-timestamp'] as string;
    const body: any = request.body;
  
    const signatureBuffer: Buffer = Buffer.from(signature, 'hex');
    const timestampBuffer: Buffer = Buffer.from(timestamp, 'utf-8');
    const bodyBuffer: Buffer = Buffer.from(body, 'utf-8');
  
    const hmac: any = createHmac('sha256', ClientDetails.APP_ID);
    hmac.update(timestampBuffer);
    hmac.update(bodyBuffer);
  
    const calculatedSignature: Buffer = hmac.digest();
  
    if (calculatedSignature.equals(signatureBuffer)) {
      next();
    } else {
      response.status(401).send('Invalid signature.');
    }
}