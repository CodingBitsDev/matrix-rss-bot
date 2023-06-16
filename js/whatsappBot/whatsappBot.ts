import { Client as WhatsappClient, LocalAuth } from "whatsapp-web.js";
import { initHandlers } from "./handlers";

export { Client as WhatsappClient} from "whatsapp-web.js";
export function initWhatsappbot() : WhatsappClient {
  const client = new WhatsappClient({
    authStrategy: new LocalAuth()
  });

  initHandlers(client);

  client.initialize();

  return client
}