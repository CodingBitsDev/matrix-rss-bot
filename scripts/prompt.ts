export function prompt(question: string, secure: boolean = false): Promise<string>{
  return new Promise(res => {
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });
    if(secure) readline.stdoutMuted = true;

    const query = `${question}\n`;
    readline.question(query, ( answer : string ) => {
      res(answer)
      console.log("\n")
      readline.close();
    })
    readline._writeToOutput = function _writeToOutput(stringToWrite) {
      if (readline.stdoutMuted)
        readline.output.write("\x1B[2K\x1B[200D"+ "["+((readline.line.length%2==1)?"=-":"-=")+"]");
        // readline.output.write("*");
      else
        readline.output.write(stringToWrite);
    };
  })
}