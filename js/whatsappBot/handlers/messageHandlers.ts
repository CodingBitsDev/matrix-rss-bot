import { WhatsappClient } from "../whatsappBot";

export function initMessageHanlders(client: WhatsappClient){
  client.on('message', msg => {
    console.log("###", msg)
  });
}