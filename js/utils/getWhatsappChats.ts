import { Chat } from "../whatsappBot/whatsappBot";

export async function getWhatsappChats() : Promise<{chats: Map<string, Chat>, orderdChatIds: string[]}>{
  const rawChats = await APP.whatsappClient.getChats();
  const orderdChatIds : string[] = [];
  const chats = new Map()
  rawChats.forEach((chat) => {
    const chatId = `${chat.id.user}@${chat.id.server}`
    orderdChatIds.push(chatId);
    chats.set(chatId, chat)
  })
  return {chats, orderdChatIds}
}