import { MatrixEvent, MessageEvent, StateEvent } from "matrix-bot-sdk";
import { debounce } from "lodash";
import { UserProfile, getUserData } from "../../userLoader";
import { makeMessagePrompt, sendPrompot } from "./prompt-system";
import { MatrixBot } from "../matrixBot";
import * as commands from "./commands/index"
import path = require("path");

type CommandResult = boolean | Error
export interface Command {
  name: string,
  description: string,
  command: string,
  example?: string,
  params?: Param[],
  optionalParams?: OptionalParam[],
  namedParams?: NamedParam[],
  roomType?: "wa" | "matrix" | "all",
  onTrigger: (roomId:  string, event?: MessageEvent<any>, msg?: string) => CommandResult | Promise<CommandResult>;
}

type ParamType = "string" | "number" | "string | number" | "empty";

export interface Param{
  name: string,
  description: string,
  type: ParamType,
  default?: any,
}

export interface OptionalParam extends Param{
  optional: true,
}

export interface NamedParam extends Param{
  initiator: string //e.q.: -i 
}

const commandMap : Map<string, Command> = new Map();

export async function initHandleCommand(client: MatrixBot) {
  Object.values( commands ).forEach(command => {
    commandMap.set(command.command.toLowerCase(), command);
  })
  client.on("room.message", (roomId: string, event: MessageEvent<any>) => handleCommands(roomId, event));
}

export async function handleCommands(roomId: string, event: MessageEvent<any>) {
  if(event.sender != APP.matrixClient.matrixUser) return;
  if(event.content.msgtype != "m.text") return;
  const msg = event.content.body;
  const firstWord = msg.replace(/ .*/,'');

  const command = commandMap.get(firstWord.toLowerCase());
  if(!command) {
    let result = ``;
    result += `<p>Command <b>${firstWord}</b> does not exist. Did you write it correctly?</p>`
    result += `<p>If you are looking for general help or a list of commands try typing <b>!help</b> without any param.`
    await APP.matrixClient.sendHtmlText(roomId, result)
    //TODO Potentially handle what happens when no command was recognized.
    return;
  };
  let error = null;
  APP.matrixClient.setTyping(roomId, true, 30000)
  try {
    let result = command.onTrigger(roomId, event, msg)
    if(result instanceof Promise) result = await result;
    if(result && result instanceof Error){
      error = result;
    }
  } catch(e){
    error = e;
  }
  APP.matrixClient.setTyping(roomId, false, 0)
  if(!error) return;
  console.error("Error in command: ", firstWord, error)
  APP.matrixClient.sendMessage(roomId, {body: `[ERROR] There has been an error in command: ${firstWord}: ${JSON.stringify(error)}`})
}

//// COMMAND Utils
type ParamListItem = {
  initiator?: string,
  value: any,
  param: Param | NamedParam | OptionalParam
  optional: boolean,
};
export function makeParamsList(command: Command, event: MessageEvent<any>, msg: string) : { params: ParamListItem[], namedParamsIndex: number, optionalParamsIndex: number}{
  const paramStringList : string[] = []
  const namedStringParamList : [string,string?][] = []
  const params = msg.split(" ").slice(1);
  for (let i = 0; i < params.length; i++) {
    const param = params[i];
    const namedParam= command.namedParams?.find((nParam) => {
      return nParam.initiator == param;
    })
    if(namedParam){
      if(namedParam.type != "empty") namedStringParamList.push([namedParam.initiator, params[++i]]);
      else namedStringParamList.push([namedParam.initiator]);
    } else {
      paramStringList.push(param);
    }
  }

  const paramList : ParamListItem[] = [];
  const requiredParams = [ ...( command?.params || [] ) ];
  const optionalParams = [ ...( command?.optionalParams || [] ) ];
  let optionalParamsIndex = 0;
  let namedParamsIndex = 0;
  paramStringList.forEach(param => {
    let currentParam : Param | OptionalParam | null = null
    let optional = false;
    if(requiredParams.length) {
      optionalParamsIndex++;
      currentParam = requiredParams.shift()
    }
    if(optionalParams.length) {
      optional = true
      currentParam = optionalParams.shift()
    }
    if(!currentParam) return // No optional or required param left;
    paramList.push({
      value: readParamValue(currentParam, param),
      param: currentParam,
      optional,
    })
  })
  namedParamsIndex = paramList.length -1;
  namedStringParamList.forEach(param => {
    const namedParam = command?.namedParams.find(nParam => param[0] == nParam.initiator);
    paramList.push({
      initiator: param[0],
      value: readParamValue(namedParam, param[1]),
      param: namedParam, 
      optional: true,
    })
  })
  return { params: paramList, namedParamsIndex, optionalParamsIndex };
}

function readParamValue(param: Param | OptionalParam | NamedParam, value: string) : any {
  if(param.type == "number"){
    const val = Number(value);
    if(Number.isNaN(val) && param.default) return param.default
    return val;
  } else if (param.type == "string") return value
  else if (param.type == "string | number") {
    const val = Number(value);
    return Number.isNaN(val) ? value : val;
  } 
  return null;
}