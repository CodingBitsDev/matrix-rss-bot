import { Client as WhatsappClient, LocalAuth } from "whatsapp-web.js";
import * as qrCode from "qrcode-terminal"

export { Client as WhatsappClient} from "whatsapp-web.js";
export function initWhatsappbot() : WhatsappClient {
  const client = new WhatsappClient({
    authStrategy: new LocalAuth()
  });

  client.on('qr', (qr) => {
    // Generate and scan this code with your phone
    console.log('QR RECEIVED', qr);
    qrCode.generate(qr, {small: true})
  });

  client.on('ready', () => {
      console.log('Client is ready!');
  });

  client.on('message', msg => {
    if (msg.body == '!ping') {
        msg.reply('pong');
    }
  });

  client.initialize();

  return client
}