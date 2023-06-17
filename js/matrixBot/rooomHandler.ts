import { forEach } from "lodash";
import { MatrixBot } from "./matrixBot";

export interface RoomHandler{
  ready: boolean,
  rooms: Map<string, Room> 
  client: MatrixBot,
  handleRoom: (roomId) => Promise<any>;
}

export interface Room {
  name: string,
  members: string[];
  whatsappId: string | false;
}

export async function initRoomHandler(client: MatrixBot){
  //Wait for client ready
  await new Promise((res) => client.on("ready", () => { res(true); }))
  client.roomHandler = {
    ready: false,
    rooms: new Map(),
    client,
    handleRoom: handleRoom,
  };
  const rooms = await client.getJoinedRooms();
  rooms.map(async roomId => await(client.roomHandler.handleRoom(roomId)))
  await Promise.all(rooms);
  client.roomHandler.ready = true;

  return true;
}

 async function handleRoom(roomId){
    const roomState = await this.client.getRoomState(roomId);
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
    this.rooms.set(roomId, room);
 }