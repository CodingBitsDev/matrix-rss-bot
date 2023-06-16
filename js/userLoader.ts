import { MatrixBot } from "./matrixBot/matrixBot";

export interface UserProfile {
  displayname: string
  avatar_url: string
}

const userList : Map<string, UserProfile> = new Map();

export async function getUserData(client: MatrixBot, userId: string){
  if(userList.get(userId)) return userList.get(userId);
  const user = await client.getUserProfile(userId);
  userList.set(userId, user);
  return user;
}