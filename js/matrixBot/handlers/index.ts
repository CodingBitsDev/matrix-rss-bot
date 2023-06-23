import { MatrixEvent, MessageEvent } from "matrix-bot-sdk";
import { handleLLamaMessage, initHandleLLamaMessage } from "./handleLLamaMessage";
import { initHandleDecryptionsErrors } from "./handleDecryptionErrors";
import { MatrixBot } from "../matrixBot";
import { initHandleCommand } from "./handleCommand";
import { initHandleRoomJoined } from "./handleRoomJoined";

export function initHandler(client: MatrixBot){
  initHandleRoomJoined(client)
  initHandleCommand(client);
  initHandleLLamaMessage(client);
  initHandleDecryptionsErrors(client);
}