import { MessageEvent } from "matrix-bot-sdk";
import { Command, NamedParam, OptionalParam, Param } from "../handleCommand";
import * as commands from "./index";
import { makeCommandShortString, makeShortParamString } from "./help";

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

  return result;
}