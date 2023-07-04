import { MessageEvent } from "matrix-bot-sdk";
import { Command, NamedParam, OptionalParam, Param, makeParamsList } from "../handleCommand";
import * as commands from "./index";

const MAX_CHATS_PER_PAGE = 10;

export const listWhatsappRoomsCommand : Command = {
  name: "List Whatsapp Chats",
  description: "List the ammount of whatsapp rooms",
  command: "!lsWA",
  onTrigger: async (roomId: string, event?: MessageEvent<any>, msg?: string) => {
    await APP.matrixClient.sendHtmlText(roomId, makeAnswerString(roomId, event, msg))
    return true
  },
  optionalParams: [
    {
      name: "pageNumber",
      description: `Optional pagenumber for more rooms. If you want to disable paging run "!lsWA -a".`,
      type: "number",
      optional: true,
      default: 1,
    },
  ],
  namedParams: [
    {
      initiator: "-a",
      name: "No Paging",
      description: "Ignores the paging and shows all chats in one list",
      type: "empty",
    }
  ],
}

function makeAnswerString(roomId: string, event: MessageEvent<any>, msg) : string {
  let result = ``;
  result += `<h2>Chat List:</h2>`

  const { params, optionalParamsIndex, namedParamsIndex} = makeParamsList(listWhatsappRoomsCommand, event, msg)
  const disablePaging = !!params.find(param => param.initiator == "-a")
  let page = params[0]?.param?.name == "pageNumber" && params[0]?.value;
  let noPageEntered = false;
  if(!page) {
    noPageEntered = true;
    page = 1;
  }

  if(!APP.whatsappClient.ready){
    result += `<p2>We are sorry. The Whatsapp Chats are not laoded yet. Please try again in some minutes.</p>`
    return result
  }
  const chatIds = APP.whatsappClient.orderdChatIds;
  const selectedChats = [];
  const maxPages = Math.ceil(chatIds.length / MAX_CHATS_PER_PAGE);
  if(page > maxPages) {
    result += `<p><b>[Warning]</b> Page <b>${page}</b> does not exists as the maximum number of pages are <b>${maxPages}</b>. We're showing page <b>${maxPages}</b> instead.</p>`
    page = maxPages;
  }
  const startIndex = !disablePaging ? ( page -1 ) * MAX_CHATS_PER_PAGE : 0;
  const endIndex = !disablePaging ? ( page - 1 ) * MAX_CHATS_PER_PAGE + MAX_CHATS_PER_PAGE : chatIds.length;
  for (let i = startIndex; i < endIndex; i++) {
    const chatId = chatIds[i];
    selectedChats.push({...APP.whatsappClient.chats.get(chatId), chatIndex: i, chatId});
  }

  result += `<p>This is orderd list of the whatsapp chats.`
  result += `The chatList can be read like this: </p>`
  result += "<p>[ListIndex]: [ChatType] [ChatName] ([chatId])"

  result += `<ul>`

  selectedChats.forEach(chat => {
    result += `<li>`
    result += `${chat.chatIndex}: `
    if(chat?.isGroup){
      result += `[G] `
    } else {
      result += `[P] `
    }
    result += `${chat.name} (${chat.chatId})`
    result += `</li>`
  })
  result += `</ul>`
  if(!disablePaging){
    result += `<p>Page <b>${page}/${maxPages}</b></p>`
    if(noPageEntered) result += `<p>To show more pages run !lswa [pageNumber].</p>`
  }
  
  return result;
}