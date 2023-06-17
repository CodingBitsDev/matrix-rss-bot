import { MessageEvent } from "matrix-bot-sdk";
import { Command } from "../handleCommand";

export const helpCommand : Command = {
  name: "Help Command",
  description: "Command that displays information about all available commands. Run !help [command] for extra specific Information.",
  command: "!help",
  onTrigger: async (roomId: string, event: MessageEvent<any>, msg: string) => {
    console.log("###", "helpCalled", roomId, event);
    APP.matrixClient.sendMessage(roomId, {body: "Thank you for calleng !help. This will be implented soon"});
    return true
  }
}