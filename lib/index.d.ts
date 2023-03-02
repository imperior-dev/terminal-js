export default class Terminal {
    private _terminalTemplate;
    private _variables;
    private _affix;
    debug: Boolean;
    /**
     * @param template Template for logging to the terminal, By default use "#variableName#" to add variable "@colorName@" to add colors
     * @param variableAffix Use this to change "#" in variable placeholder to any other value
     * @param colorAffix Use this to change "@" in color placeholder to any other value
     */
    constructor(template: string, variableAffix?: string, colorAffix?: string);
    /**
     * @param name The name of the variable, this should be the same as the one used in template placeholder
     * @param data The data or the value of the variable, this can be anything, Note that it will be converted to string using JSON.stringify()
     */
    createVariable(name: string, data: any): Variable;
    update(): void;
    removeColors(string: string): string;
}
declare class Variable {
    name: string;
    data: any;
    terminal: Terminal;
    constructor(name: string, data: any, terminal: Terminal);
    get value(): any;
    set value(newData: any);
    get dataString(): string;
}
export {};
//# sourceMappingURL=index.d.ts.map