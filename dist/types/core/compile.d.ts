declare class Compile {
    constructor(el: any, vm: any);
    node2Fragment(el: any): DocumentFragment;
    init(): void;
    compileElement(el: any): void;
    compile(node: any): void;
    compileText(node: any, exp: any): void;
    isDirective(attr: any): boolean;
    isEventDirective(dir: any): boolean;
    isElementNode(node: any): boolean;
    isTextNode(node: any): boolean;
}
