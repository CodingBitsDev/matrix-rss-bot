import { MatrixBot, initMatrixBot } from "./matrixBot/matrixBot";
import { WhatsappClient, initWhatsappbot } from "./whatsappBot/whatsappBot";

interface APP {
  name: string;
  matrixClient?: MatrixBot;
  whatsappClient?: WhatsappClient;
}
declare global {
  var APP: APP 
}

function main(){
  global.APP = {
    name: "Matrix-Whatsapp-Bot",
    matrixClient: initMatrixBot(),
    whatsappClient: initWhatsappbot(),
  };
}
main();
