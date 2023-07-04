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
  roomId: string
}

export async function initWaRoomHandler(client: MatrixBot){
  //Wait for client ready
  await new Promise((res) => client.on("ready", () => { res(true); }))
  client.waRoomHandler= {
    ready: false,
    rooms: new Map(),
    client,
    handleRoom: handleRoom,
  };
  const orderedRooms = await client.getJoinedRooms();
  let rooms = orderedRooms.map(async roomId => await(client.waRoomHandler.handleRoom(roomId)))
  rooms = await Promise.all(rooms);
  client.waRoomHandler.ready = true;

  return true;
}

 async function handleRoom(roomId: string){
    const roomState = await this.client.getRoomState(roomId);
    const room : Room = {
      name: "",
      members: [],
      whatsappId: false,
      roomId,
    }
    roomState.forEach(ev => {
      if(ev.type == "m.room.member") room.members.push(ev.state_key)
      if(ev.type == "m.room.name") room.name = ev.content.name;
      if(ev.type == "c.room.waid") room.whatsappId = ev.content.id;
    })
    this.rooms.set(roomId, room);
    return room;
 }