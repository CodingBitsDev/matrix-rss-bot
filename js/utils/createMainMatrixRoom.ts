// const RECREATE_TIME = 1000 * 60 * 10; // 10 minutes 
const RECREATE_TIME = 1000
export async function createMainMatrixRoom(){
    const now = Date.now();
    const rooms = await APP.matrixClient.getJoinedRooms();
    const mainRoomId = await new Promise(async res => {
        for (let index = 0; index < rooms.length; index++) {
            const roomId = rooms[index];
            const roomState = await APP.matrixClient.getRoomState(roomId);
            let isWaBotMain = false;
            let creationTime = 0;
            let members = [];
            roomState.forEach(ev => {
                if(ev.type == "m.room.member") {
                    const membership = ev.content?.membership
                    if(membership == "join") members.push(ev.state_key);
                    else if (membership == "leave") members = members.filter((key => key == ev.state_key))
                }
                if(ev.type != "c.room.wa-bot-main") return false;
                isWaBotMain = true;
                creationTime = ev.content?.created || 0;
            })
            if(isWaBotMain){
                const recreateTimeExceded = now - creationTime > RECREATE_TIME;
                //If room doesn't have enough members and is older than 10 minutes it should be deleted
                if(recreateTimeExceded && !members.includes(APP.matrixClient.matrixUser)){
                    await APP.matrixClient.leaveRoom(roomId);
                    await APP.matrixClient.forgetRoom(roomId);
                    res(null)
                }

                res(roomId);
            }
        }
        res(null);
    })
    if(mainRoomId) return mainRoomId
    // return null;
    
    return await APP.matrixClient.createRoom({
      name: `WA-Bot`,
      initial_state: [
          {
              content: {created: now},
              state_key: ""+ Math.floor( Math.random() * 10000000),
              type: "c.room.wa-bot-main",
          }
      ],
      invite: [APP.matrixClient.matrixUser],
      preset: "private_chat",
      topic: `WA-Bot Main Room`,
  })
}