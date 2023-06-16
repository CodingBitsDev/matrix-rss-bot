import { WhatsappClient } from "../whatsappBot";
import * as qrCode from "qrcode-terminal"

export function initAuthHandlers(client: WhatsappClient){
  client.on('qr', (qr) => {
    // Generate and scan this code with your phone
    console.log('QR RECEIVED', qr);
    qrCode.generate(qr, {small: true})
  });

  client.on('ready', async () => {
    const rawChats = await APP.whatsappClient.getChats();
    const chats = new Map()
    rawChats.forEach((chat) => {
      chats.set(`${chat.id.user}@${chat.id.server}`, chat)
    })
    APP.whatsappClient.chats = chats;
    APP.whatsappClient.ready = true;
    console.log('Client is ready!');
  });
}