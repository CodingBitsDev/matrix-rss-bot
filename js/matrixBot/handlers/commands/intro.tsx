import { MessageEvent } from "matrix-bot-sdk";
import { Command, NamedParam, OptionalParam, Param } from "../handleCommand";
import * as commands from "./index";

export const introCommand : Command = {
  name: "App Intro Command",
  description: "Replays the intro.",
  command: "!intro",
  onTrigger: async (roomId: string, event?: MessageEvent<any>, msg?: string) => {
    await APP.matrixClient.sendHtmlText(roomId, makeAnswerString(roomId, event, msg))
    return true
  },
}

function makeAnswerString(roomId: string, event: MessageEvent<any>, msg) : string {
  let result = ``;
  result += `<h1>${APP.name}</h1>`
  result += `<p>Thank you for using ${APP.name}.</p>`
  result += `<p>The ${APP.name} is now ready. You can just wait to receive Whatsapp Messages right in Matrix, or use the commands bellow to create matrix channels directly.</p>`
  result += `<p>Here is a list of commands to get you started:</p>`

  return result;
}