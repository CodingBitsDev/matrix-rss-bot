import { MatrixEvent, MessageEvent, StateEvent } from "matrix-bot-sdk";
import { debounce } from "lodash";
import { UserProfile, getUserData } from "../../userLoader";
import { makeMessagePrompt, sendPrompot } from "./prompt-system";
import { MatrixBot } from "../matrixBot";
import * as commands from "./commands/index"

type CommandResult = boolean | Error
export interface Command {
  name: string,
  description: string,
  command: string,
  params?: Param[],
  optionalParams?: OptionalParam[],
  onTrigger: (roomId:  string, event: MessageEvent<any>, msg: string) => CommandResult | Promise<CommandResult>;
}

type ParamType = "string" | "number";

export interface Param{
  name: string,
  description: string,
  type: ParamType
}

export interface OptionalParam{
  name: string,
  description: string,
  type: ParamType,
  initator: string //e.q.: -i 
}

const commandMap : Map<string, Command> = new Map();

export async function iniHandleCommand(client: MatrixBot) {
  Object.values( commands ).forEach(command => {
    commandMap.set(command.command, command);
  })
  client.on("room.message", (roomId: string, event: MessageEvent<any>) => handleCommands(roomId, event));
}

export async function handleCommands(roomId: string, event: MessageEvent<any>) {
  if(event.sender != APP.matrixClient.matrixUser) return;
  if(event.content.msgtype != "m.text") return;
  const msg = event.content.body;
  const firstWord = msg.replace(/ .*/,'');

  const command = commandMap.get(firstWord);
  if(!command) {
    //TODO Potentially handle what happens when no command was recognized.
    return;
  };
  let error = null;
  APP.matrixClient.setTyping(roomId, true, 30000)
  try {
    let result = command.onTrigger(roomId, event, msg)
    if(result instanceof Promise) result = await result;
    console.log("result", result, result instanceof Error)
    if(result && result instanceof Error){
      error = result;
      console.log("result", result)
    }
  } catch(e){
    error = e;
  }
  APP.matrixClient.setTyping(roomId, false, 0)
  if(!error) return;
  console.error("Error in command: ", firstWord, error)
  APP.matrixClient.sendMessage(roomId, {body: `[ERROR] There has been an error in command: ${firstWord}: ${JSON.stringify(error)}`})
}
