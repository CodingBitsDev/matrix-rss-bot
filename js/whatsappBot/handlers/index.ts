import { WhatsappClient } from "../whatsappBot";
import { initAuthHandlers } from "./authHandlers";
import { initMessageHanlders } from "./messageHandlers";

export function initHandlers(client: WhatsappClient){
  initAuthHandlers(client);
  initMessageHanlders(client);
}