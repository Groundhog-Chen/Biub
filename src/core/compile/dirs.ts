import Biub from "../index";
import Watcher from '../subscribe/watcher';
import updaters from './updaters';
const directives = {
    text: (node: Element, $biub: Biub, exp: string) => {
        directives.bind(node, $biub, exp, updaters.text);
    },
    model: (node: HTMLInputElement, $biub: Biub, exp: string) => {
        directives.bind(node, $biub, exp, updaters.model);
        let val = directives._getVMVal($biub, exp);
        node.addEventListener('input', (e: any) => {
            const newVal = e.target.value;
            if (val === newVal) {
                return;
            }
            directives._setVMVal($biub, exp, newVal);
            val = newVal;
        });
    },
    // dom节点 vm对象 exp vm.data对象属性名称 dir指令名称
    bind: (node: Node, $biub: Biub, exp: string, updater: Function) => {
        const value = directives._getVMVal($biub, exp);
        updater && updater(node, value);
        new Watcher($biub, exp, (value: any, oldValue?: any) => {
            updater && updater(node, value, oldValue);
        });
    },
    // 事件处理
    eventHandler: (node: Element, $biub: Biub, exp: string, dir: string) => {
        const eventType = dir.split(':')[1];
        const fn = $biub.$options.methods && $biub.$options.methods[exp];
        if (eventType && fn) {
            node.addEventListener(eventType, fn.bind($biub.proxy), false);
        }
    },
    _getVMVal: ($biub: Biub, exp: any) => {      
        let val = $biub.proxy;
        exp = exp.split('.');
        exp.forEach((k: string) => {            
            val = val[k];
        });
        return val;
    },

    _setVMVal: ($biub: Biub, exp: string, val: string) => {        
        $biub.proxy[exp] = val;
    }
}
export default directives;