import { MatrixEvent, MessageEvent } from "matrix-bot-sdk";
import { debounce } from "lodash";
import { UserProfile, getUserData } from "../../userLoader";
import { makeMessagePrompt, sendPrompot } from "./prompt-system";
import { MatrixBot } from "../matrixBot";

export async function handleLLamaMessage(client: MatrixBot, roomId: string, event: MessageEvent<any>) {
  //TODO MAKE HANDLE COMMAND FUNCTION
}
