export interface RssSystem {
  runningTimeouts: Map<string, NodeJS.Timeout>;
  tickTime: number
  run: (room: string) => any;
  stop: (room: string) => any;
}

export function createRssSystem(){
  const rssSystem : RssSystem = {
    runningTimeouts: new Map(),
    tickTime: 30000, // 30sec
    run: (room) => {
      const runFunction = async () => {
        const runningRuningTimeout = rssSystem.runningTimeouts.get(room);
        if(!runningRuningTimeout) return;
        try {
          if(APP.matrixClient.ready){
            //Do RSS Stuff here
            const unreadNews = await APP.rssReader.readCCCUpdates(room, 1);
            if((await unreadNews).length){
              let answer = ``;
              answer += `<h1>${APP.name}</h1>`
              answer += `<p>New RSS News.</p>`
              await APP.matrixClient.sendHtmlText(room, answer)
              for (let index = 0; index < unreadNews.length; index++) {
                const item = unreadNews[index];
                let answer = ``;
                answer += `<h2>${item.title}</h2>`
                answer += `<p>Published: ${item.pubDate}</p>`
                answer += item.link;
                answer += item.content;
                await APP.matrixClient.sendHtmlText(room, answer)
              }
            }
            //RSS STUFF END
          }
        } catch(e){
          console.error("[RSS-System] Error in run function", e)
        }
        
        rssSystem.runningTimeouts.set(room, setTimeout(runFunction, rssSystem.tickTime))
      } 
      rssSystem.runningTimeouts.set(room, setTimeout(runFunction, rssSystem.tickTime))
    },
    stop: (room) => {
      const runningRuningTimeout = rssSystem.runningTimeouts.get(room);
      if(runningRuningTimeout){
        clearTimeout(runningRuningTimeout);
        rssSystem.runningTimeouts.delete(room);
      }
    },
  }

  return rssSystem;
}