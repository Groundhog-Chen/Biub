# Biub

使用 ES6 的 `Proxy` 结合观察者模式来实现数据双向绑定，具体实现步骤大致分为下面四个步骤

* 1、实现 Observer 观察数据更新触发更新 
* 2、实现 Compile 模板解析 
* 3、实现 Subscriber 收集订阅
* 4、实现 Watcher 触发 Compile 中绑定的订阅回调

> 本文代码用 TypeScript 写的，第一次用 Webpack + TS 自己搭项目，很烂，能看就将就看吧。。。

## 1、实现 Observer 观察数据更新 

观察数据更新，然后通知订阅者更新视图从而达到数据双向绑定效果，Vue 使用了 `Object.defineProperty()` 这个方法来劫持了 VM 实例对象的属性的读写，我这里主要采用了 `ES6` `Proxy`，实例化的时候   `_initSet()` 把 `data` 的数据挂载到 `this` 上面, 再在把 `Biub` 传给 `Proxy` 实例化一个对象挂在自己身上这样后面的方法执行时直接 `.call(this.proxy)`，这样在传进去的方法里 `this` 的指向就是 `Biub` 自身了，接着执行了 `Compile` 模板解析完成了渲染。

```JavaScript

class Biub {
    $options: options;
    proxy: Biub;
    deps: {
        [name: string]: Dep
    }
    [propName: string]: any;
    constructor(options: options) {
        this.$options = options;
        this._initSet(); // 把数据挂到 this 上面
        this.deps = {};
        this.proxy = this.defineProxy(); 
        this.$compile = new Compile(options.el, this); // 解析模板
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
            set: function (target, key: any, value, receiver) {
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
}

```

## 2、实现 Compile 模板解析 

`Compile` 主要做的事情是解析模板变量和指令，通过 `compileElement`递归 DOM 将模板中的变量替换成数据，并对 DOM 相应的指令函数，添加订阅者，下面代码不全，全文请戳 [compile](https://github.com/Groundhog-Chen/Biub/tree/master/src/core/compile)，这里要感谢 [DMQ](https://github.com/DMQ) 大神提供 `compile` `subscribe` 两个模块，我把大佬的 es5 改成了 TypeScript 并简化了模板编译指令，由好几个简化成了两个，哈哈哈！
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

`Dep` 通过 `subs` 数组收集订阅者，当 `proxy` 发生数据变更时通过 `notify()` 通知订阅更新视图

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
    // 通知 Watcher 触发回调
    notify(vm: Biub) {
        this.subs.forEach((watcher: Watcher) => {
            watcher.update(vm);
        });
    }
};

```

## 4、实现 Watcher 

`Compile` 模板解析到指令或者变量的时候实例化一个 `Watcher` 往 `Biub` 的 `deps` 对应 `Dep` 里添加自己并订阅了一个回调函数 `updater()`，这样 `proxy` 触发 `set` 时候就能根据 `deps` 对应 `Dep` 发送 `notify()` 并通过 `forEach` 遍历所有订阅者触发自身的 `update()` 并而触发  `Compile` 中绑定的回调函数 `updater()` 更新视图，这里不好理解的应该就是 `updater()` 这个回调方法和添加订阅 `getter` 这个方法触发的闭包在 `Biub` 产生 `get` 完成把自己添加进 `Dep` `subs` 操作把！

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

## 编译一波看看效果

```
npm run dev
```

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


