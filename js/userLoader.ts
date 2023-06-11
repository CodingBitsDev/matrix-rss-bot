import { MatrixClient } from "matrix-bot-sdk";

export interface UserProfile {
  displayname: string
  avatar_url: string
}

const userList : Map<string, UserProfile> = new Map();

export async function getUserData(clinet: MatrixClient, userId: string){
  if(userList.get(userId)) return userList.get(userId);
  const user = await clinet.getUserProfile(userId);
  userList.set(userId, user);
  return user;
}