import { MessageEvent } from "matrix-bot-sdk";
import { Command } from "../handleCommand";
import * as commands from "./index";

export const helpCommand : Command = {
  name: "Help Command",
  description: "Command that displays information about all available commands. Run !help [command] for extra specific Information.",
  command: "!help",
  onTrigger: async (roomId: string, event: MessageEvent<any>, msg: string) => {
    console.log("###", "helpCalled", roomId, event);
    await APP.matrixClient.sendHtmlText(roomId, makeAnswerString(roomId, event))
    return true
  }
}

function makeAnswerString(roomId: string, event: MessageEvent<any>) : string {
  let commandList = Object.values(commands).sort((command1, command2) => command1.command.localeCompare(command2.command))
  let result = ``;
  result += `<h1>${APP.name}</h1>`
  result += `Thank you for using ${APP.name}. The following commands can be used`
  result += `<ul>`
  commandList.forEach(command => {
    result += `<li>`;
    result += `<b>${command.command}</b> : ${command.description}`;
    result += `</li>`;
  })
  result += `</ul>`
  result += `<br>`
  result += `For more information about a spcific command. Run <b>!help [comand]</b>.`

  return result;
}
