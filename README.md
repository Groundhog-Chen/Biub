# Biub

使用 `ES6` 的 `Proxy` 结合观察者模式实现数据双向绑定，步骤大致分为下面四个步骤。

* 1、实现 Observer 观察数据更新触发更新 
* 2、实现 Compile 模板解析 
* 3、实现 Subscriber 收集订阅
* 4、实现 Watcher 触发 Compile 中绑定的订阅回调

## 1、实现 Observer 观察数据更新 

`Observer` 使用观察数据更新，然后通知订阅者更新视图，Vue 使用了 `Object.defineProperty()` 这个方法来劫持了 VM 实例对象的属性的读写，我这里主要采用了 `ES6` `Proxy`，代码如下，全文请戳 [gitHub](https://github.com/Groundhog-Chen/Biub/tree/master/src/core)

```JavaScript

class Biub {
    proxy: Biub;
    deps: {
        [name: string]: Dep
    }
    constructor(options: options) {
        this.proxy = this.defineProxy();
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
            set: function (target, key: any, value, receiver) {
                const dep = deps[key];
                dep && dep.notify(value);
                return Reflect.set(target, key, value);
            }
        })
    }
}

```

## 2、实现 Compile 模板解析 

`Compile` 主要做的事情是解析模板变量和指令，将模板中的变量替换成数据，并对 DOM 相应的指令函数，添加订阅者，代码修剪过，全文请戳 [compile](https://github.com/Groundhog-Chen/Biub/tree/master/src/core/compile)
```JavaScript
class Compile {
    // 省略。。。
    // 递归文档节点
    compileElement(el: DocumentFragment | Node) {
        var childNodes = el.childNodes;
        childNodes.forEach((node: any) => {
            const text = node.textContent;
            const reg = /\{\{(.*)\}\}/;
            if (this.isElementNode(node)) {
                this.compile(node); // 解析指令
            } else if (this.isTextNode(node) && reg.test(text)) {
                this.compileText(node, RegExp.$1.trim()); // 解析模板变量
            }
            if (node.childNodes && node.childNodes.length) {
                this.compileElement(node);// 递归文档节点
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
                    // 绑定事件指令
                    directives.eventHandler(node, this.$vm, exp, dir);
                } else {
                    // model指令
                    directives.model(node, this.$vm, exp);
                }
                node.removeAttribute(attrName);
            }
        }
    }
    // 省略。。。
}

```

## 3、实现 Subscriber 收集订阅

`Dep` 通过 `subs` 数组收集订阅者，当 `proxy` 发生数据变更时通过 `notify` 通知订阅更新视图

```JavaScript

let depid = 0;
class Dep {
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
    // 通知 Watcher 回调
    notify(vm: Biub) {
        this.subs.forEach((watcher: Watcher) => {
            watcher.update(vm);
        });
    }
};

```

## 4、实现 Watcher 触发 Compile 中绑定的订阅回调

```JavaScript

export default class Watcher {
    updater: Function;
    expOrFn: string | Function;
    depIds: { [key: number]: Dep };
    value: string | number | symbol;
    vm: Biub;
    getter: any;
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
    
    update(val: any) {
        this.run(val);
    }
    run(val: any) {
        var oldVal = this.value;
        if (val !== oldVal) {
            this.value = val;
            // 触发更新 compile 传进来的
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
        // 触发 proxy get，添加订阅
        const value = this.getter.call(this.vm, this.vm);
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
```
## 最终效果

```html

<div id="app">
    <input type="text" v-model="name">
    <input type="text" v-model="obj.kk.childName">
    <p>名字：{{ name }}</p>
    <p>Salary：{{salary}}</p>
    <p>深对象：{{obj.kk.childName}}</p>
    <button v-on:click="click">Add Salary</button>
</div>

```

```JavaScript

let index = 10000;
const vm = new Biub({
    el: '#app',
    data: {
        salary: 10000,
        name: 'nancy',
        obj: {
            kk: {
                childName: 'pony',
            }
        }
    },
    methods: {
        click(e: Event) {
            this.salary = index += 1000;
        }
    }
});
vm.$watch('salary', function () {
    console.log(this.salary);
});

```
![Biub](https://raw.githubusercontent.com/Groundhog-Chen/Biub/master/src/assets/rv.png)



## Emmm~

+ 喜欢就帮忙点个赞啦！

## 感谢大神提供 `compile` `subscribe` 两个模块

+ [DMQ](https://github.com/DMQ/mvvm)

