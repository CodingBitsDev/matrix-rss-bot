import { MessageEvent } from "matrix-bot-sdk";
import { Command, NamedParam, OptionalParam, Param } from "../handleCommand";
import * as commands from "./index";
const ITEMS_PER_PAGE = 10;

export const helpCommand : Command = {
  name: "Help Command",
  description: "Command that displays information about all available commands. The optional [command|pageNumber] parameter specifies a command to get extra information on or a given pagenumber.",
  command: "!help",
  onTrigger: async (roomId: string, event: MessageEvent<any>, msg: string) => {
    await APP.matrixClient.sendHtmlText(roomId, makeAnswerString(roomId, event, msg))
    return true
  },
  optionalParams: [
    {
      name: "command | pageNumber",
      description: "Either a command (e.g !help !into), that you want extra information on, or a number for additional pages.",
      type: "string | number",
      optional: true,
    },
  ],
}

function makeAnswerString(roomId: string, event: MessageEvent<any>, msg) : string {
  let result = ``;
  let commandList = Object.values(commands).sort((command1, command2) => command1.command.localeCompare(command2.command))
  const params = msg.split(" ").slice(1);
  let pageNumber : number = !params[0] ? 1 : Number(params[0]) 
  pageNumber = Number.isNaN(pageNumber) ? 0 : pageNumber;
  if(pageNumber){
    result += `<h1>${APP.name}</h1>`
    result += `<p>Thank you for using ${APP.name}. The following commands can be used:</p>`
    result += `<ul>`
    const maxPages = Math.ceil(commandList.length / ITEMS_PER_PAGE);
    if(pageNumber > maxPages) {
      result += `<p><b>[Warning]</b> Page <b>${pageNumber}</b> does not exists as the maximum number of pages are <b>${maxPages}</b>. We're showing page <b>${maxPages}</b> instead.</p>`
      pageNumber = maxPages
    }
    commandList.forEach(( command, index ) => {
      if(index < ITEMS_PER_PAGE * ( pageNumber - 1 ) || index >= ITEMS_PER_PAGE * (pageNumber - 1) +ITEMS_PER_PAGE) return 
      result += `<li>`;
      const params = [
        ...(command.params || []),
        ...(command.optionalParams || []),
        ...(command.namedParams || []),
      ].map(param => makeShortParamString(param)).join(" ");
      result += `<b>${command.command}</b>${params && " " + params}: <br> ${command.description}`;
      result += `</li>`;
    })
    result += `</ul>`
    if(maxPages > 1) {
      result += `<p>Page ${pageNumber} / ${maxPages}</p>`
      result += `<p>Run <b>!help [pageNumber]</b> for more info</p>`
    }
    result += `<br>`
    result += `For more information about a spcific command. Run <b>!help [comand]</b>.`
  } else {
    const command = commandList.find(c => c.command.toLowerCase() == params[0].toLowerCase())
    result += `<h1>${APP.name}</h1>`
    if(!command) {
      result += `<p>Command <b>${params[0]}</b> does not exist. Did you write it correctly?</p>`
      result += `<p>If you are looking for general help or a list of commands try typing <b>!help</b> without any param.`
      return result;
    }
    const paramListShort = [
      ...(command.params || []),
      ...(command.optionalParams || []),
      ...(command.namedParams || []),
    ].map(param => makeShortParamString(param)).join(" ");
    result += `<p>Command: <b>${command.name} (${command.command})</p>`
    result += `<p>Usage: ${command.command} ${paramListShort}</p>`
    result += `<p>${command.description}</p>`
    result += `<p><b>RoomType:</b> ${command.roomType || "all"}</p>`
    const paramList = [
      ...(command.params || []),
      ...(command.optionalParams || []),
      ...(command.namedParams || []),
    ].map(param => makeLongParamString(param))
    if(paramList.length){
      result += "<p><b>Params:</b>"
      result += "<ul>"
      paramList.forEach(pString => {
        result += `<li>${pString}</li>`
      })
      result += "</ul></p>"
    }
  }

  return result;
}

export function makeShortParamString(param: Param | OptionalParam | NamedParam) : string {
  let result = ``;
  if( (param as OptionalParam ).optional ) result += `[${param.name}]`;
  else if( (param as NamedParam ).initiator ) {
    result += `[${( param as NamedParam ).initiator }${param.type != "empty" ? " " + param.name : ""}]`;
  }
  else result += `${param.name}`;
  return result;
}

function makeLongParamString(param: Param | OptionalParam | NamedParam) : string {
  let result = ``;
  const initiator = (param as NamedParam ).initiator;
  if(!initiator) result += `<b>${initiator ? initiator + " " : ""}${param.name}</b> : `;
  else result += `<b>${initiator}${param.type != "empty" ? " " + param.name + " " : ""}</b>: `;
  result += `${param.description}`
  if( (param as OptionalParam ).optional ) {
    result += `<br><b>Required</b>: No`
    result += `<br><b>Type</b>: ${param.type}`
    result += "<br><br>"
  }
  else if( initiator ) {
    result += `<br><b>Required</b>: No`
    result += `<br><b>NamedParameter</b>: Yes`
    result += `<br><b>Type</b>: ${param.type}`
    result += `<br><b>Initiator</b>: ${initiator}`
    result += "<br><br>"
  }
  else {
    result += `<br><b>Required</b>: Yes`
    result += `<br><b>Type</b>: ${param.type}`
    result += "<br><br>"
  }
  return result;
}

export function makeCommandShortString(command) : string {
  let result = ``
  const params = [
    ...(command.params || []),
    ...(command.optionalParams || []),
    ...(command.namedParams || []),
  ].map(param => makeShortParamString(param)).join(" ");
  result += `<b>${command.command}</b>${params && " " + params}: <br> ${command.description}`;

  return result;
}