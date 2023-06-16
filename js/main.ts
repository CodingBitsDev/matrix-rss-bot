import { MatrixBot, initMatrixBot } from "./matrixBot/matrixBot";
import { WhatsappClient, initWhatsappbot } from "./whatsappBot/whatsappBot";

interface APP {
  matrixClient?: MatrixBot;
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
