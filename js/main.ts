import { MatrixClient } from "matrix-bot-sdk";
import { initMatrixBot } from "./matrixBot/matrixBot";
import { WhatsappClient, initWhatsappbot } from "./whatsappBot/whatsappBot";

interface APP {
  matrixClient?: MatrixClient;
  whatsappClient?: WhatsappClient;
}
declare global {
  var APP: APP 
}

function main(){
  global.APP = {};
  global.APP.matrixClient = initMatrixBot();
  global.APP.whatsappClient = initWhatsappbot();
}
main();
