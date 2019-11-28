import Biub from "../index";
export default class Compile {
    $vm: Biub;
    $el: Element;
    $fragment: DocumentFragment;
    constructor(el: string, vm: Biub);
    node2Fragment(el: Element): DocumentFragment;
    init(): void;
    compileElement(el: DocumentFragment | Node): void;
    compile(node: any): void;
    compileText(node: Element, exp: string): void;
    isDirective(attr: string): boolean;
    isEventDirective(dir: string): boolean;
    isElementNode(node: any): boolean;
    isTextNode(node: any): boolean;
}
