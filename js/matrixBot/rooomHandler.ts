import { forEach } from "lodash";
import { MatrixBot } from "./matrixBot";

export interface RoomHandler{
  ready: boolean,
  rooms: Map<string, Room> 
}

export interface Room {
  name: string,
  members: string[];
  whatsappId: string | false;

}

export async function initRoomHandler(client: MatrixBot){
  //Wait for client ready
  await new Promise((res) => client.on("ready", () => { res(true); }))
  const roomHandler = {
    ready: false,
    rooms: new Map(),
  };
  const rooms = await client.getJoinedRooms();
  rooms.map(async roomId => {
    const roomState = await client.getRoomState(roomId);
    const room : Room = {
      name: "",
      members: [],
      whatsappId: false,
    }
    roomState.forEach(ev => {
      if(ev.type == "m.room.member") room.members.push(ev.state_key)
      if(ev.type == "m.room.name") room.name = ev.content.name;
      if(ev.type == "c.room.waid") room.whatsappId = ev.content.id;
    })
    roomHandler.rooms.set(roomId, room);
  })
  await Promise.all(rooms);
  roomHandler.ready = true;

  client.roomHandler = roomHandler;
  return true;
}