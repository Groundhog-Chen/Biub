import Biub from "../index";
import directives from './dirs';
export default class Compile {
    $biub: Biub;
    $el: Element;
    $fragment: DocumentFragment;
    constructor(el: string, vm: Biub) {
        this.$biub = vm;
        this.$el = document.querySelector(el);
        if (this.$el) {
            this.$fragment = this.node2Fragment(this.$el);
            // 处理完数据再渲染dom
            this.init(); // 处理数据
            this.$el.appendChild(this.$fragment); // 相当于渲染数据
        }
    }
    node2Fragment(el: Element) {
        let fragment = document.createDocumentFragment(), child;
        // 将原生节点拷贝到fragment
        while (child = el.firstChild) {
            fragment.appendChild(child);
        }
        return fragment;
    }
    init() {
        this.compileElement(this.$fragment);
    }
    compileElement(el: DocumentFragment | Node) {
        const childNodes = el.childNodes;
        childNodes.forEach((node: any) => {
            const text = node.textContent;
            const reg = /\{\{(.*)\}\}/;
            if (this.isElementNode(node)) {
                this.compile(node);
            } else if (this.isTextNode(node) && reg.test(text)) {
                this.compileText(node, RegExp.$1.trim());
            }
            if (node.childNodes && node.childNodes.length) {
                this.compileElement(node);
            }
        });
    }
    compile(node: any) {
        const nodeAttrs = node.attributes;
        for (const attr of nodeAttrs) {
            const attrName = attr.name;

            if (this.isDirective(attrName)) {
                const exp = attr.value;
                const dir = attrName.substring(2);
                if (this.isEventDirective(dir)) {                    
                    // 事件指令
                    directives.eventHandler(node, this.$biub, exp, dir);
                } else {
                    // model指令
                    directives.model(node, this.$biub, exp);
                }
                node.removeAttribute(attrName);
            }
        }
    }
    compileText(node: Element, exp: string) {
        directives.text(node, this.$biub, exp);
    }
    // 普通指令
    isDirective(attr: string) {
        return attr.indexOf('v-') == 0;
    }
    // 事件指令
    isEventDirective(dir: string) {
        return dir.indexOf('on') === 0;
    }
    // 文档节点
    isElementNode(node: any) {
        return node.nodeType == 1;
    }
    // 文本节点
    isTextNode(node: any) {
        return node.nodeType == 3;
    }
};