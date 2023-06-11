import { MatrixAuth } from "matrix-bot-sdk";
import { prompt } from "./prompt";

async function main() {
  try{
    let type = "";
    while (type != "login" && type != "register"){
      type = await prompt("Do you want to login or register a new account? Please type either login or register.")
      type = type.toLocaleLowerCase();
    }
    
    let hostServer = await prompt("What host server are do you want to use?")
    let userName = await prompt("Please enter Username")
    let password = await prompt("Please enter Password", true)

    console.log("Loggin in \n");
    const auth = new MatrixAuth(hostServer);
    const authFunc = type == "login" ? auth.passwordLogin.bind(auth) : auth.passwordRegister.bind(auth);
    const client = await authFunc(userName, password);

    console.log("Sucess. Copy this access token to your .env: ", client.accessToken);
  } catch(e){
    console.log("ERROR: Something went wrong. Please try again.\n", e)
    console.log("\n");
    main();
  }
}

main()