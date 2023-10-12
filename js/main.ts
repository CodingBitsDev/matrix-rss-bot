import { MatrixBot, initMatrixBot } from "./matrixBot/matrixBot";
import { RSSReader, initRSSReader } from "./rss/rss";

interface APP {
  name: string;
  matrixClient?: MatrixBot;
  rssReader?: RSSReader;
}
declare global {
  var APP: APP 
}

function main(){
  global.APP = {
    name: "Matrix-RSS-Bot",
    matrixClient: initMatrixBot(),
  };
  initRSSReader().then(reader => global.APP.rssReader = reader)
}
main();
