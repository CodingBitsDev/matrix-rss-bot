export async function createMatrixRoomFromWA(name: string, whatsappid: string, isGroup: boolean = false){
    const roomId = await APP.matrixClient.createRoom({
      name: `[WA-${isGroup ? "G" : "P"}] ${name}`,
      initial_state: [
          {
              content: {id: whatsappid},
              state_key: whatsappid,
              type: "c.room.waid",
          }
      ],
      invite: [APP.matrixClient.matrixUser],
      preset: "private_chat",
      topic: `${isGroup ? "[Group]" : "[Private]"} ${name}`,
  })
  if(APP.matrixClient.ready) APP.matrixClient.roomHandler.handleRoom(roomId)
}
( global as any ).createMatrixRoomFromWA = createMatrixRoomFromWA;