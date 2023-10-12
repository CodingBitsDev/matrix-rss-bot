import * as Storage from "node-persist";

export interface Store{
  name: string;
  setItem: (key: string, val: any) => Promise<any>;
  getItem: (key: string) => Promise<any>;
  removeItem: (key: string) => Promise<any>;
}

let storeReady = prepareStore();

async function prepareStore(){
  await Storage.init({
    dir: `./store`,
    stringify: JSON.stringify,
    parse: JSON.parse,
    encoding: 'utf8',
    // can also be custom logging function
    logging: false,  

    // ttl* [NEW], can be true for 24h default or a number in MILLISECONDS or a valid Javascript Date object
    ttl: false,

    // every 2 minutes the process will clean-up the expired cache
    expiredInterval: 2 * 60 * 1000, 

    // in some cases, you (or some other service) might add non-valid storage files to your
    // storage dir, i.e. Google Drive, make this true if you'd like to ignore these files and not throw an error
    forgiveParseErrors: false,
    
    // instead of writing to file immediately, each "file" will have its own mini queue to avoid corrupted files, keep in mind that this would not properly work in multi-process setting.
    writeQueue: true, 
    
    // how often to check for pending writes, don't worry if you feel like 1s is a lot, it actually tries to process every time you setItem as well
    writeQueueIntervalMs: 1000, 
    
    // if you setItem() multiple times to the same key, only the last one would be set, BUT the others would still resolve with the results of the last one, if you turn this to false, each one will execute, but might slow down the writing process.
    writeQueueWriteOnlyLast: true, 
  });

  return true;
}

export async function createStore(storeName){
  const ready = await storeReady;

  if(!ready){
    console.error("[STORE] Something went wrong with creating the store")
  }
  const store : Store = {
    name: storeName,
    getItem: async (key: string) => {
      const value = await Storage.getItem(`${store.name}_${key}`);
      return value;
    },
    setItem: async (key: string, val: any) => {
      const value = await Storage.getItem(`${store.name}_${key}`);
      if(!value){
        await Storage.setItem(`${store.name}_${key}`, val);
      } else {
        await Storage.updateItem(`${store.name}_${key}`, val);
      }
      return val;
    },
    removeItem: async (key: string) => {
      return await Storage.removeItem(`${store.name}_${key}`);
    }
  }
  return store;
}