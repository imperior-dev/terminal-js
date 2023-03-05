type ColorType = {
    [key: string]: number
}

const COLORS: ColorType = {
    CLEAR: 0,
    BLACK: 30,
    RED: 31,
    GREEN: 32,
    YELLOW: 33,
    BLUE: 34,
    MAGENTA: 35,
    CYAN: 36,
    WHITE: 37,
    BRIGHT_BLACK: 90,
    BRIGHT_RED: 91,
    BRIGHT_GREEN: 92,
    BRIGHT_YELLOW: 93,
    BRIGHT_BLUE: 94,
    BRIGHT_MAGENTA: 95,
    BRIGHT_CYAN: 96,
    BRIGHT_WHITE: 97
}

type GlobalType = {
    [key: string]: any
}

interface Global {
    essential: GlobalType    
}

declare var global: Global;

interface Affix{
    variable: string,
    color: string
}

export default class Terminal{
    private _terminalTemplate: string;
    private _variables: Array<Variable>;
    private _affix: Affix;
    public debug: Boolean;
    /**
     * @param template Template for logging to the terminal, By default use "#variableName#" to add variable "@colorName@" to add colors
     * @param variableAffix Use this to change "#" in variable placeholder to any other value
     * @param colorAffix Use this to change "@" in color placeholder to any other value
     */
    constructor(template: string, variableAffix: string = "#", colorAffix: string = "@"){
        if(global.essential && global.essential["terminal"]){
            throw new Error("A previous terminal was detected!");
        }   else{
            global.essential = {}
        }
        global.essential["terminal"] = ()=> this
        this._terminalTemplate = template
        this._variables = []
        this.debug = process.argv.includes("--debug");
        this._affix = {
            variable: variableAffix,
            color: colorAffix
        }
    }
    /**
     * @param name The name of the variable, this should be the same as the one used in template placeholder 
     * @param data The data or the value of the variable, this can be anything, Note that it will be converted to string using JSON.stringify()
     */
    createVariable(name:string, data: any){
        const variable = new Variable(name, data, this)
        this._variables.push(variable)
        if(!this.debug){
            this.update()
        } else{
            console.log(name + ": " + this.removeColors(data));
        }
        if(global.essential["logger"])  global.essential["logger"].log(name, data);
        return variable
    }
    update(){
        let terminalTemplate = this._terminalTemplate;
        this._variables.forEach((variable: Variable)=>{
            const affix = this._affix.variable;
            const searchString = affix + variable.name + affix;

            terminalTemplate = terminalTemplate.replace(searchString, variable.dataString)
            terminalTemplate = terminalTemplate.replaceAll(`"`, ``);
        })

        Object.keys(COLORS).forEach((color:string) => {
            const affix = this._affix.color;
            const searchString = affix + color + affix;
            const replaceString = `\x1b[1;${COLORS[color]}m`
            terminalTemplate = terminalTemplate.replaceAll(searchString, replaceString)
        });

        const COLORRESETCODE = "\x1b[1;0m"

        console.clear();
        console.log(terminalTemplate + COLORRESETCODE);
    }
    removeColors(string:string){
        string = string + ""
        Object.keys(COLORS).forEach((color:string) => {
            const affix = this._affix.color;
            const searchString = affix + color + affix;
            string = string.replaceAll(searchString, "")
        });
        return string
    };
};

class Variable{
    name: string;
    data: any;
    terminal: Terminal;
    constructor(name: string, data: any, terminal: Terminal){
        this.name = name;
        this.data = data;
        this.terminal = terminal;
    }

    get value(){
        return this.data;
    }

    set value(newData: any){
        if(global.essential["logger"])  global.essential["logger"].log(this.name, newData)
        this.data = newData;
        if(this.terminal.debug){
            console.log(this.name + ": " + this.terminal.removeColors(newData));
        }   else{
            this.terminal.update()
        }
    }

    get dataString(){
        return JSON.stringify(this.data);
    }
}