import Dep from './dep';
import Biub from '../index';

export default class Watcher {
    constructor(vm: Biub, expOrFn: string | Function, updater: Function) {
        this.updater = updater;
        this.vm = vm;
        this.expOrFn = expOrFn;
        this.depIds = {};
        if (typeof expOrFn === 'function') {
            this.getter = expOrFn;
        } else {
            this.getter = this.parseGetter(expOrFn.trim());
        }
        this.value = this.get();
    }
    updater: Function;
    expOrFn: string | Function;
    depIds: { [key: number]: Dep };
    value: string | number | symbol;
    vm: Biub;
    getter: any;
    update(val: any) {
        this.run(val);
    }

    run(val: any) {
        var oldVal = this.value;
        if (val !== oldVal) {
            this.value = val;
            this.updater.call(this.vm, val, oldVal);
        }
    }

    addDep(dep: Dep) {
        if (!this.depIds.hasOwnProperty(dep.id)) {
            dep.addSub(this);
            this.depIds[dep.id] = dep;
        }
    }

    get() {
        Dep.target = this;
        var value = this.getter.call(this.vm, this.vm);
        Dep.target = null;
        return value;
    }

    parseGetter(exp: string ) {
        const exps = exp.split('.');
        return function () {
            var val = this.proxy;
            exps.forEach((k: any) => {
                val = val[k]
            });
            return val;
        }
    }

};