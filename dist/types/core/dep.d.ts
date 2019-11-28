import Watcher from './watcher';
import Biub from './index';
export default class Dep {
    static target: Watcher | null;
    id: number;
    subs: Array<Watcher>;
    constructor();
    addSub(watcher: Watcher): void;
    depend(): void;
    removeSub(watcher: Watcher): void;
    notify(vm: Biub): void;
}
