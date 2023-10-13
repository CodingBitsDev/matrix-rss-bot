import * as RSSParser from "rss-parser";
import { Store, createStore } from "../store/store";

export interface RSSReader { 
  parser: RSSParser;
  store: Store;
  ready: boolean;
  readCCCUpdates: (roomKey: string, maxUnreads?: number) => Promise<any[]>;
}

export async function initRSSReader() : Promise<RSSReader> {
  const parser = new RSSParser();
  const store = await createStore("rss");

  const rssReader : RSSReader = {
    ready: false,
    parser,
    store,
    readCCCUpdates: async (roomKey, maxUnreads) => {
      const readKey = `${roomKey}_ccc`
      let lastRead = await store.getItem(readKey);
      const feed = await parser.parseURL("https://events.ccc.de/feed")
      const items = feed?.items || [];

      const now = Date.now();
      await store.setItem(readKey, now);

      if(!lastRead){
        if(maxUnreads) return items.splice(0, maxUnreads);
        return items;
      }

      const readTime = new Date(lastRead).getTime();
      
      const filteredItems = items.filter(i => {
        const pubTime = new Date(i.isoDate).getTime();
        return pubTime > readTime;
      })

      if(maxUnreads) return filteredItems.splice(0, maxUnreads);
      return filteredItems;
    }
  };

  return rssReader
}
