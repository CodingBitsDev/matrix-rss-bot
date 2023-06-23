import { MatrixClient, MatrixEvent, MessageEvent } from "matrix-bot-sdk";
import { debounce } from "lodash";
import { UserProfile, getUserData } from "../../userLoader";
import { makeMessagePrompt, sendPrompot } from "./prompt-system";
import { MatrixBot } from "../matrixBot";
import { introCommand } from "./commands";


export async function initHandleRoomJoined(client: MatrixClient){
  client.on("room.event", (roomId: string, event: MessageEvent<any>) => handleJoined(roomId, event));
}

async function handleJoined(roomId: string, event: any) {
  if(event?.type != "m.room.member") return;
  if(event?.content?.membership != "join") return;
  if(event?.sender == await APP.matrixClient.getUserId()) return;

  if(event?.type == "m.room.member" && event?.content?.membership == "join"){
    await introCommand.onTrigger(roomId, undefined, undefined );

  }
}
