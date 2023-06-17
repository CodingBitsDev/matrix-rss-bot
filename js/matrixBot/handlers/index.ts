import { MatrixEvent, MessageEvent } from "matrix-bot-sdk";
import { handleLLamaMessage, initHandleLLamaMessage } from "./handleLLamaMessage";
import { initHandleDecryptionsErrors } from "./handleDecryptionErrors";
import { MatrixBot } from "../matrixBot";

export function initHandler(client: MatrixBot){
  initHandleLLamaMessage(client);
  initHandleDecryptionsErrors(client);
}