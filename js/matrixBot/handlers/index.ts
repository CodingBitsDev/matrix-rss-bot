import { MatrixEvent, MessageEvent } from "matrix-bot-sdk";
import { handleLLamaMessage, initHandleLLamaMessage } from "./handleLLamaMessage";
import { initHandleDecryptionsErrors } from "./handleDecryptionErrors";
import { MatrixBot } from "../matrixBot";
import { iniHandleCommand } from "./handleCommand";

export function initHandler(client: MatrixBot){
  iniHandleCommand(client);
  initHandleLLamaMessage(client);
  initHandleDecryptionsErrors(client);
}