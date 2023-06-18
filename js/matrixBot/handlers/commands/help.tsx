import { MessageEvent } from "matrix-bot-sdk";
import { Command, NamedParam, OptionalParam, Param } from "../handleCommand";
import * as commands from "./index";

export const helpCommand : Command = {
  name: "Help Command",
  description: "Command that displays information about all available commands. The optional [command] parameter specifies a command to get extra information on.",
  command: "!help",
  onTrigger: async (roomId: string, event: MessageEvent<any>, msg: string) => {
    console.log("###", "helpCalled", roomId, event);
    await APP.matrixClient.sendHtmlText(roomId, makeAnswerString(roomId, event))
    return true
  },
  optionalParams: [
    {
      name: "command",
      description: "Command that you want more information on.",
      type: "string",
      optional: true,
    },
  ]
}

function makeAnswerString(roomId: string, event: MessageEvent<any>) : string {
  let commandList = Object.values(commands).sort((command1, command2) => command1.command.localeCompare(command2.command))
  let result = ``;
  result += `<h1>${APP.name}</h1>`
  result += `Thank you for using ${APP.name}. The following commands can be used`
  result += `<ul>`
  commandList.forEach(command => {
    result += `<li>`;
    const params = [
      ...(command.params || []),
      ...(command.optionalParams || []),
      ...(command.namedParams || []),
    ].map(param => makeShortParamString(roomId, event, param)).join(" ");
    result += `<b>${command.command}</b>${params && " " + params}: <br> ${command.description}`;
    result += `</li>`;
  })
  result += `</ul>`
  result += `<br>`
  result += `For more information about a spcific command. Run <b>!help [comand]</b>.`

  return result;
}

function makeShortParamString(roomId: string, event: MessageEvent<any>, param: Param | OptionalParam | NamedParam) : string {
  let result = ``;
  if( (param as OptionalParam ).optional ) result += `[${param.name}]`;
  else if( (param as NamedParam ).initator ) result += `[${( param as NamedParam ).initator } ${param.name}]`;
  else result += `${param.name}]`;
  return result;
}