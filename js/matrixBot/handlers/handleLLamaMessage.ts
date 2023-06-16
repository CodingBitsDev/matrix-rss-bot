import { MatrixEvent, MessageEvent } from "matrix-bot-sdk";
import { debounce } from "lodash";
import { UserProfile, getUserData } from "../../userLoader";
import { makeMessagePrompt, sendPrompot } from "./prompt-system";
import { MatrixBot } from "../matrixBot";

const MESSAGE_WAIT_TIME = 5000;

const messageQueueMap : Map<string,MessageEvent<any>[]> = new Map();
const queueHandlers : Map<string,Promise<unknown>> = new Map();
const chatPromptHistory : Map<string, string[]> = new Map();
export async function handleLLamaMessage(client: MatrixBot, roomId: string, event: MessageEvent<any>) {
  if(!shouldHandle(client, roomId, event)) return;
  let queue = messageQueueMap.get(roomId);
  if(!queue){
    queue = [];
    messageQueueMap.set(roomId, queue)
  } 
  queue.push(event);
  if(!queueHandlers.get(roomId)){
    queueHandlers.set(roomId, new Promise(res => {
      setTimeout(async () => {
        const mergedEvents = []
        while(queue.length){
          const event = queue.shift();
          const prevEvent = mergedEvents[mergedEvents.length-1];
          if(canMerge(prevEvent, event)){
            mergedEvents[mergedEvents.length -1 ] = mergeEvents(prevEvent, event);
          } else mergedEvents.push(event)
        }
        for (let i = 0; i < mergedEvents.length; i++) {

          const history = chatPromptHistory.get(roomId) || [];
          if(!chatPromptHistory.get(roomId)) chatPromptHistory.set(roomId, history);
          await handleEvent(client, mergedEvents[i], history);
        }
        queueHandlers.delete(roomId);
      }, MESSAGE_WAIT_TIME)
    }))
  } 
}

function shouldHandle(client: MatrixBot, roomId: string, event: MessageEvent<any>){
  //TODO Implement when event should be handled
  return true
}

function mergeEvents(event1: MessageEvent<any>, event2: MessageEvent<any>){
  return {...event2,
    content: {...event2.content,
      body: event1.content.body + event2.content.body,
    }
  }
}

function canMerge(event1: MessageEvent<any> | undefined, event2: MessageEvent<any>){
  if(!event1) return false;
  if(event1.sender != event2.sender) return false;
  if(event1.content?.msgType != event2.content?.msgType) return false;
  return true;
}

async function handleEvent(client: MatrixBot, event: MessageEvent<any>, history: string[]){
  const user = await getUserData(client, event.sender);
  history.push(await makeMessagePrompt(user.displayname, event.content.body));

  const promots = history.slice(-5);
  sendPrompot(promots)
}