export class Log {
  name: string = "";
  color: string = "33";
    
  constructor(name: string, color:string="33") {
    this.name = name;
    this.color = color;
  }
    
  logColor(c: string, ...msg: any) {
    const stack = getCallStacks();
    const [func, file] = stack[3];
    console.log(`${color(`[${this.name}]`, `${c};1`)} ${color(func, c)} ${color(file, `${c};2`)}`, ...msg);  
  } 
    
  log(...msg: any) {
    this.logColor(this.color, ...msg);
  }
    
  error(...msg: any) {
    this.logColor("31", ...msg);   
  }
}

const StackFileRegExp = /(^\s+at (.*) \((?:webpack-internal:\/\/\/\(.*\)\/){0,1}(.*)\)$)/gm;

function color(str:string, ansi:string) {
  return `\x1b[${ansi}m${str}\x1b[0m`;
}

function getCallStacks() {
  const stack = String(new Error().stack);
  
  var res =[];
  while (true){
    var result = StackFileRegExp.exec(stack);
    if (!!result) {
      res.push([result[2], result[3]]);
    }else {
      break;
    }
  }
  
  return res;
}