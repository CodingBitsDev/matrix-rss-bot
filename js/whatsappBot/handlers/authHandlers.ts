import { WhatsappClient } from "../whatsappBot";
import * as qrCode from "qrcode-terminal"

export function initAuthHandlers(client: WhatsappClient){
  client.on('qr', (qr) => {
    // Generate and scan this code with your phone
    console.log('QR RECEIVED', qr);
    qrCode.generate(qr, {small: true})
  });

  client.on('ready', async () => {
      console.log('Client is ready!');
  });
  
}