import Biub from "../index";
declare const directives: {
    text: (node: Element, vm: Biub, exp: string) => void;
    model: (node: HTMLInputElement, vm: Biub, exp: string) => void;
    bind: (node: Node, vm: Biub, exp: string, updater: Function) => void;
    eventHandler: (node: Element, vm: Biub, exp: string, dir: string) => void;
    _getVMVal: (vm: Biub, exp: any) => Biub;
    _setVMVal: (vm: Biub, exp: string, val: string) => void;
};
export default directives;
