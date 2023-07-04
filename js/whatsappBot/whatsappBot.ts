import { Client, GroupChat, LocalAuth, PrivateChat } from "whatsapp-web.js";
import { initHandlers } from "./handlers";

export type Chat = PrivateChat | GroupChat;

export interface WhatsappClient extends Client{
  chats?: Map<string, Chat>;
  orderdChatIds?: string[];
  ready?: boolean,
}

export function initWhatsappbot() : WhatsappClient {
  const client = new Client({
    authStrategy: new LocalAuth()
  });

  initHandlers(client);

  client.initialize();

  return client;
}