import { options } from "../types/index";
import Compile from './compile/index';
import Watcher from './subscribe/watcher';
import Dep from "./subscribe/dep";

export default class Biub {
    $options: options;
    proxy: Biub;
    deps: {
        [name: string]: Dep
    }
    [propName: string]: any;
    constructor(options: options) {
        this.$options = options;
        this._initSet();
        this.deps = {};
        this.proxy = this.defineProxy();
        this.$compile = new Compile(options.el, this);
    }
    $watch(key: string, cb: Function) {
        new Watcher(this, key, cb);
    }
    defineProxy() {
        const deps = this.deps;
        return new Proxy(this, {
            get: function (target: Biub, key: string | number) {
                if (target[key]) {
                    if (!deps[key]) {
                        deps[key] = new Dep();
                    } else {
                        if (Dep.target) {
                            deps[key].depend();
                        }
                    }
                    return target[key];
                }
                return Reflect.get(target, key);
            },
            set: function (target, key: any, value) {
                const keys = key.split('.');
                if (keys.length > 1) {
                    key = keys[0];
                }
                const dep = deps[key];
                dep && dep.notify(value);
                return Reflect.set(target, key, value);
            }
        })
    }
    _initSet() {
        const { methods, data } = this.$options
        Object.keys(data).forEach((key) => {
            this[key] = data[key];
        });
        Object.keys(methods).forEach((key) => {
            this[key] = methods[key];
        });
    }
    _initComputed() {
        // this.$options.computed && this.$options.computed.call(this.proxy);
    }
};
