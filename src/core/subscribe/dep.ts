import Watcher from './watcher';
import Biub from '../index';
let depid = 0;
export default class Dep {

    static target: Watcher | null = null;

    id: number;
    
    subs: Array<Watcher>;

    constructor() {
        this.id = depid++;
        this.subs = [];
    }  
    addSub(watcher: Watcher) {
        this.subs.push(watcher);
    }

    depend() {
        if (Dep.target) {
            Dep.target.addDep(this);
        }
    }

    removeSub(watcher: Watcher) {
        const index = this.subs.indexOf(watcher);
        if (index != -1) {
            this.subs.splice(index, 1);
        }
    }

    notify(vm: Biub) {
        this.subs.forEach((watcher: Watcher) => {
            watcher.update(vm);
        });
    }
};

