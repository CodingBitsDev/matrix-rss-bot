import { MatrixBot } from "../matrixBot";

export function initHandleDecryptionsErrors(client: MatrixBot){
  client.on("room.failed_decryption", (roomId: string, event: any, error: Error) => {
    // console.log("### decryption", roomId, event, error)
    // client.forgetRoom(roomId);
  })
}