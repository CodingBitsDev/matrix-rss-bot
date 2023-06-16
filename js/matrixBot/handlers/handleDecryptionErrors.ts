import { MatrixBot } from "../matrixBot";

export function handleDecryptionErrors(client: MatrixBot, roomId: string, event: any, error: Error){
  console.log("### decryption", roomId, event, error)
  // client.forgetRoom(roomId);
}