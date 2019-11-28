import Dep from './dep';
import Biub from './index';
export default class Watcher {
    constructor(vm: Biub, expOrFn: string | Function, updater: Function);
    updater: Function;
    expOrFn: string | Function;
    depIds: {
        [key: number]: Dep;
    };
    value: string | number | symbol;
    vm: Biub;
    getter: any;
    update(val: any): void;
    run(val: any): void;
    addDep(dep: Dep): void;
    get(): any;
    parseGetter(exp: string): () => any;
}
