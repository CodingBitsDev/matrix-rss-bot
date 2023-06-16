import { MatrixClient } from "matrix-bot-sdk";

export function handleDecryptionErrors(client: MatrixClient, roomId: string, event: any, error: Error){
  console.log("### decryption", roomId, event, error)
  // client.forgetRoom(roomId);
}