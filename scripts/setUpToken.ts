import { MatrixAuth } from "matrix-bot-sdk";
import { prompt } from "./prompt";
import * as fs from "fs";
const path = require('path');
const appRoot = path.resolve(__dirname);

async function main() {
  try{
    let type = "";
    while (type != "login" && type != "register"){
      type = await prompt("Do you want to login or register a new account? Please type either login or register.")
      type = type.toLocaleLowerCase();
    }
    
    let hostServer = await prompt("What host server are do you want to use?")
    let userName = await prompt("Please enter Username:")
    let password = await prompt("Please enter Password:", true)
    let connectedUser = await prompt("Please enter the matrix handle that the bot should listen to (e.g.: @name:homserver.org):")

    console.log("Loggin in \n");
    const auth = new MatrixAuth(hostServer);
    const authFunc = type == "login" ? auth.passwordLogin.bind(auth) : auth.passwordRegister.bind(auth);
    const client = await authFunc(userName, password);

    const envPath = appRoot + "/../.env"
    if(fs.existsSync(envPath)) fs.unlinkSync(envPath);
    const file = fs.createWriteStream(envPath)
    file.write(`ACCESS_TOKEN=${client.accessToken}\n`)
    file.write(`HOST_SERVER=${hostServer}\n`)
    file.write(`MATRIX_USER=${connectedUser}\n`)
    file.end();

    console.log("Sucess. New .env file creatged");
  } catch(e){
    console.log("ERROR: Something went wrong. Please try again.\n", e)
    console.log("\n");
    main();
  }
}

main()