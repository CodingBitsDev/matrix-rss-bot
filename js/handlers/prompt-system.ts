export function makeMessagePrompt(name: string, message: string){
  return `${name}: ${message}`;
}

export function sendPrompot(messages: string[]){
  console.log("### sending", messages);
}