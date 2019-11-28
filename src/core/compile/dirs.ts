import Biub from "../index";
import Watcher from '../subscribe/watcher';
import updaters from './updaters';
const directives = {
    text: (node: Element, vm: Biub, exp: string) => {
        directives.bind(node, vm, exp, updaters.text);
    },
    model: (node: HTMLInputElement, vm: Biub, exp: string) => {
        directives.bind(node, vm, exp, updaters.model);
        let val = directives._getVMVal(vm, exp);
        node.addEventListener('input', (e: any) => {
            const newVal = e.target.value;
            if (val === newVal) {
                return;
            }
            directives._setVMVal(vm, exp, newVal);
            val = newVal;
        });
    },
    // dom节点 vm对象 exp vm.data对象属性名称 dir指令名称
    bind: (node: Node, vm: Biub, exp: string, updater: Function) => {
        const value = directives._getVMVal(vm, exp);
        updater && updater(node, value);
        new Watcher(vm, exp, (value: any, oldValue?: any) => {
            updater && updater(node, value, oldValue);
        });
    },
    // 事件处理
    eventHandler: (node: Element, vm: Biub, exp: string, dir: string) => {
        const eventType = dir.split(':')[1];
        const fn = vm.$options.methods && vm.$options.methods[exp];
        if (eventType && fn) {
            node.addEventListener(eventType, fn.bind(vm.proxy), false);
        }
    },
    _getVMVal: (vm: Biub, exp: any) => {      
        var val = vm.proxy;
        exp = exp.split('.');
        exp.forEach((k: string) => {            
            val = val[k];
        });
        return val;
    },

    _setVMVal: (vm: Biub, exp: string, val: string) => {        
        vm.proxy[exp] = val;
    }
}
export default directives;