import { MatrixClient } from "matrix-bot-sdk";
import { initMatrixBot } from "./matrixBot";

interface APP {
  matrixClient?: MatrixClient;
}
declare global {
  var APP: APP 
}


function main(){
  global.APP = {
    matrixClient: initMatrixBot(),
  }
}
main();
