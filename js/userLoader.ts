import { MatrixBot } from "./matrixBot/matrixBot";

export interface UserProfile {
  displayname: string
  avatar_url: string
}

const userList : Map<string, UserProfile> = new Map();

export async function getUserData(userId: string){
  if(userList.get(userId)) return userList.get(userId);
  const user = await this.getUserProfile(userId);
  userList.set(userId, user);
  return user;
}