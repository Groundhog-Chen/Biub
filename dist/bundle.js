/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/main.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/core/compile/dirs.ts":
/*!**********************************!*\
  !*** ./src/core/compile/dirs.ts ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _subscribe_watcher__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../subscribe/watcher */ "./src/core/subscribe/watcher.ts");
/* harmony import */ var _updaters__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./updaters */ "./src/core/compile/updaters.ts");


const directives = {
    text: (node, vm, exp) => {
        directives.bind(node, vm, exp, _updaters__WEBPACK_IMPORTED_MODULE_1__["default"].text);
    },
    model: (node, vm, exp) => {
        directives.bind(node, vm, exp, _updaters__WEBPACK_IMPORTED_MODULE_1__["default"].model);
        let val = directives._getVMVal(vm, exp);
        node.addEventListener('input', (e) => {
            const newVal = e.target.value;
            if (val === newVal) {
                return;
            }
            directives._setVMVal(vm, exp, newVal);
            val = newVal;
        });
    },
    bind: (node, vm, exp, updater) => {
        const value = directives._getVMVal(vm, exp);
        updater && updater(node, value);
        new _subscribe_watcher__WEBPACK_IMPORTED_MODULE_0__["default"](vm, exp, (value, oldValue) => {
            updater && updater(node, value, oldValue);
        });
    },
    eventHandler: (node, vm, exp, dir) => {
        const eventType = dir.split(':')[1];
        const fn = vm.$options.methods && vm.$options.methods[exp];
        if (eventType && fn) {
            node.addEventListener(eventType, fn.bind(vm.proxy), false);
        }
    },
    _getVMVal: (vm, exp) => {
        let val = vm.proxy;
        exp = exp.split('.');
        exp.forEach((k) => {
            val = val[k];
        });
        return val;
    },
    _setVMVal: (vm, exp, val) => {
        vm.proxy[exp] = val;
    }
};
/* harmony default export */ __webpack_exports__["default"] = (directives);


/***/ }),

/***/ "./src/core/compile/index.ts":
/*!***********************************!*\
  !*** ./src/core/compile/index.ts ***!
  \***********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Compile; });
/* harmony import */ var _dirs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dirs */ "./src/core/compile/dirs.ts");

class Compile {
    constructor(el, vm) {
        this.$vm = vm;
        this.$el = document.querySelector(el);
        if (this.$el) {
            this.$fragment = this.node2Fragment(this.$el);
            this.init();
            this.$el.appendChild(this.$fragment);
        }
    }
    node2Fragment(el) {
        let fragment = document.createDocumentFragment(), child;
        while (child = el.firstChild) {
            fragment.appendChild(child);
        }
        return fragment;
    }
    init() {
        this.compileElement(this.$fragment);
    }
    compileElement(el) {
        const childNodes = el.childNodes;
        childNodes.forEach((node) => {
            const text = node.textContent;
            const reg = /\{\{(.*)\}\}/;
            if (this.isElementNode(node)) {
                this.compile(node);
            }
            else if (this.isTextNode(node) && reg.test(text)) {
                this.compileText(node, RegExp.$1.trim());
            }
            if (node.childNodes && node.childNodes.length) {
                this.compileElement(node);
            }
        });
    }
    compile(node) {
        const nodeAttrs = node.attributes;
        for (const attr of nodeAttrs) {
            const attrName = attr.name;
            if (this.isDirective(attrName)) {
                const exp = attr.value;
                const dir = attrName.substring(2);
                if (this.isEventDirective(dir)) {
                    _dirs__WEBPACK_IMPORTED_MODULE_0__["default"].eventHandler(node, this.$vm, exp, dir);
                }
                else {
                    _dirs__WEBPACK_IMPORTED_MODULE_0__["default"].model(node, this.$vm, exp);
                }
                node.removeAttribute(attrName);
            }
        }
    }
    compileText(node, exp) {
        _dirs__WEBPACK_IMPORTED_MODULE_0__["default"].text(node, this.$vm, exp);
    }
    isDirective(attr) {
        return attr.indexOf('v-') == 0;
    }
    isEventDirective(dir) {
        return dir.indexOf('on') === 0;
    }
    isElementNode(node) {
        return node.nodeType == 1;
    }
    isTextNode(node) {
        return node.nodeType == 3;
    }
}
;


/***/ }),

/***/ "./src/core/compile/updaters.ts":
/*!**************************************!*\
  !*** ./src/core/compile/updaters.ts ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
    text(node, value) {
        const regex = /\{\{(.*)\}\}/;
        if (regex.exec(node.textContent)) {
            const str = (regex.exec(node.textContent))[0];
            if (typeof value !== 'undefined') {
                node.textContent = node.textContent.replace(str, value);
                node.setVal = value;
            }
            else {
                node.textContent = node.textContent.replace(str, '');
            }
        }
        else {
            node.textContent = node.textContent.replace(node.setVal + '', value);
            node.setVal = value;
        }
    },
    model(node, value, oldValue) {
        node.value = typeof value == 'undefined' ? '' : value;
    }
});


/***/ }),

/***/ "./src/core/index.ts":
/*!***************************!*\
  !*** ./src/core/index.ts ***!
  \***************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Biub; });
/* harmony import */ var _compile_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./compile/index */ "./src/core/compile/index.ts");
/* harmony import */ var _subscribe_watcher__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./subscribe/watcher */ "./src/core/subscribe/watcher.ts");
/* harmony import */ var _subscribe_dep__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./subscribe/dep */ "./src/core/subscribe/dep.ts");



class Biub {
    constructor(options) {
        this.$options = options;
        this._initSet();
        this.deps = {};
        this.proxy = this.defineProxy();
        this.$compile = new _compile_index__WEBPACK_IMPORTED_MODULE_0__["default"](options.el, this);
    }
    $watch(key, cb) {
        new _subscribe_watcher__WEBPACK_IMPORTED_MODULE_1__["default"](this, key, cb);
    }
    defineProxy() {
        const deps = this.deps;
        return new Proxy(this, {
            get: function (target, key) {
                if (target[key]) {
                    if (!deps[key]) {
                        deps[key] = new _subscribe_dep__WEBPACK_IMPORTED_MODULE_2__["default"]();
                    }
                    else {
                        if (_subscribe_dep__WEBPACK_IMPORTED_MODULE_2__["default"].target) {
                            deps[key].depend();
                        }
                    }
                    return target[key];
                }
                return Reflect.get(target, key);
            },
            set: function (target, key, value, receiver) {
                const keys = key.split('.');
                if (keys.length > 1) {
                    key = keys[0];
                }
                const dep = deps[key];
                dep && dep.notify(value);
                return Reflect.set(target, key, value);
            }
        });
    }
    _initSet() {
        const { methods, data } = this.$options;
        Object.keys(data).forEach((key) => {
            this[key] = data[key];
        });
        Object.keys(methods).forEach((key) => {
            this[key] = methods[key];
        });
    }
    _initComputed() {
    }
}
;


/***/ }),

/***/ "./src/core/subscribe/dep.ts":
/*!***********************************!*\
  !*** ./src/core/subscribe/dep.ts ***!
  \***********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Dep; });
let depid = 0;
class Dep {
    constructor() {
        this.id = depid++;
        this.subs = [];
    }
    addSub(watcher) {
        this.subs.push(watcher);
    }
    depend() {
        if (Dep.target) {
            Dep.target.addDep(this);
        }
    }
    removeSub(watcher) {
        const index = this.subs.indexOf(watcher);
        if (index != -1) {
            this.subs.splice(index, 1);
        }
    }
    notify(vm) {
        this.subs.forEach((watcher) => {
            watcher.update(vm);
        });
    }
}
Dep.target = null;
;


/***/ }),

/***/ "./src/core/subscribe/watcher.ts":
/*!***************************************!*\
  !*** ./src/core/subscribe/watcher.ts ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Watcher; });
/* harmony import */ var _dep__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dep */ "./src/core/subscribe/dep.ts");

class Watcher {
    constructor(vm, expOrFn, updater) {
        this.updater = updater;
        this.vm = vm;
        this.expOrFn = expOrFn;
        this.depIds = {};
        if (typeof expOrFn === 'function') {
            this.getter = expOrFn;
        }
        else {
            this.getter = this.parseGetter(expOrFn.trim());
        }
        this.value = this.get();
    }
    update(val) {
        this.run(val);
    }
    run(val) {
        const oldVal = this.value;
        if (val !== oldVal) {
            this.value = val;
            this.updater.call(this.vm, val, oldVal);
        }
    }
    addDep(dep) {
        if (!this.depIds.hasOwnProperty(dep.id)) {
            dep.addSub(this);
            this.depIds[dep.id] = dep;
        }
    }
    get() {
        _dep__WEBPACK_IMPORTED_MODULE_0__["default"].target = this;
        const value = this.getter.call(this.vm, this.vm);
        _dep__WEBPACK_IMPORTED_MODULE_0__["default"].target = null;
        return value;
    }
    parseGetter(exp) {
        const exps = exp.split('.');
        return function () {
            let val = this.proxy;
            exps.forEach((k) => {
                val = val[k];
            });
            return val;
        };
    }
}
;


/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./core/index */ "./src/core/index.ts");

let index = 10000;
const vm = new _core_index__WEBPACK_IMPORTED_MODULE_0__["default"]({
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
        click(e) {
            this.salary = index += 1000;
        }
    }
});
vm.$watch('salary', function () {
    console.log(this.salary);
});


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvcmUvY29tcGlsZS9kaXJzLnRzIiwid2VicGFjazovLy8uL3NyYy9jb3JlL2NvbXBpbGUvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvcmUvY29tcGlsZS91cGRhdGVycy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY29yZS9pbmRleC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY29yZS9zdWJzY3JpYmUvZGVwLnRzIiwid2VicGFjazovLy8uL3NyYy9jb3JlL3N1YnNjcmliZS93YXRjaGVyLnRzIiwid2VicGFjazovLy8uL3NyYy9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7UUFBQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTs7O1FBR0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDBDQUEwQyxnQ0FBZ0M7UUFDMUU7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSx3REFBd0Qsa0JBQWtCO1FBQzFFO1FBQ0EsaURBQWlELGNBQWM7UUFDL0Q7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLHlDQUF5QyxpQ0FBaUM7UUFDMUUsZ0hBQWdILG1CQUFtQixFQUFFO1FBQ3JJO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMkJBQTJCLDBCQUEwQixFQUFFO1FBQ3ZELGlDQUFpQyxlQUFlO1FBQ2hEO1FBQ0E7UUFDQTs7UUFFQTtRQUNBLHNEQUFzRCwrREFBK0Q7O1FBRXJIO1FBQ0E7OztRQUdBO1FBQ0E7Ozs7Ozs7Ozs7Ozs7QUNqRkE7QUFBQTtBQUFBO0FBQTJDO0FBQ1Q7QUFDbEMsTUFBTSxVQUFVLEdBQUc7SUFDZixJQUFJLEVB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QUM7S0FDSjtDQUNKLENBQUMsQ0FBQztBQUNILEVBQUUsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFO0lBQ2hCLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzdCLENBQUMsQ0FBQyxDQUFDIiwiZmlsZSI6ImJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL21haW4udHNcIik7XG4iLCJpbXBvcnQgQml1YiBmcm9tIFwiLi4vaW5kZXhcIjtcclxuaW1wb3J0IFdhdGNoZXIgZnJvbSAnLi4vc3Vic2NyaWJlL3dhdGNoZXInO1xyXG5pbXBvcnQgdXBkYXRlcnMgZnJvbSAnLi91cGRhdGVycyc7XHJcbmNvbnN0IGRpcmVjdGl2ZXMgPSB7XHJcbiAgICB0ZXh0OiAobm9kZTogRWxlbWVudCwgdm06IEJpdWIsIGV4cDogc3RyaW5nKSA9PiB7XHJcbiAgICAgICAgZGlyZWN0aXZlcy5iaW5kKG5vZGUsIHZtLCBleHAsIHVwZGF0ZXJzLnRleHQpO1xyXG4gICAgfSxcclxuICAgIG1vZGVsOiAobm9kZTogSFRNTElucHV0RWxlbWVudCwgdm06IEJpdWIsIGV4cDogc3RyaW5nKSA9PiB7XHJcbiAgICAgICAgZGlyZWN0aXZlcy5iaW5kKG5vZGUsIHZtLCBleHAsIHVwZGF0ZXJzLm1vZGVsKTtcclxuICAgICAgICBsZXQgdmFsID0gZGlyZWN0aXZlcy5fZ2V0Vk1WYWwodm0sIGV4cCk7XHJcbiAgICAgICAgbm9kZS5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIChlOiBhbnkpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgbmV3VmFsID0gZS50YXJnZXQudmFsdWU7XHJcbiAgICAgICAgICAgIGlmICh2YWwgPT09IG5ld1ZhbCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGRpcmVjdGl2ZXMuX3NldFZNVmFsKHZtLCBleHAsIG5ld1ZhbCk7XHJcbiAgICAgICAgICAgIHZhbCA9IG5ld1ZhbDtcclxuICAgICAgICB9KTtcclxuICAgIH0sXHJcbiAgICAvLyBkb23oioLngrkgdm3lr7nosaEgZXhwIHZtLmRhdGHlr7nosaHlsZ7mgKflkI3np7AgZGly5oyH5Luk5ZCN56ewXHJcbiAgICBiaW5kOiAobm9kZTogTm9kZSwgdm06IEJpdWIsIGV4cDogc3RyaW5nLCB1cGRhdGVyOiBGdW5jdGlvbikgPT4ge1xyXG4gICAgICAgIGNvbnN0IHZhbHVlID0gZGlyZWN0aXZlcy5fZ2V0Vk1WYWwodm0sIGV4cCk7XHJcbiAgICAgICAgdXBkYXRlciAmJiB1cGRhdGVyKG5vZGUsIHZhbHVlKTtcclxuICAgICAgICBuZXcgV2F0Y2hlcih2bSwgZXhwLCAodmFsdWU6IGFueSwgb2xkVmFsdWU/OiBhbnkpID0+IHtcclxuICAgICAgICAgICAgdXBkYXRlciAmJiB1cGRhdGVyKG5vZGUsIHZhbHVlLCBvbGRWYWx1ZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG4gICAgLy8g5LqL5Lu25aSE55CGXHJcbiAgICBldmVudEhhbmRsZXI6IChub2RlOiBFbGVtZW50LCB2bTogQml1YiwgZXhwOiBzdHJpbmcsIGRpcjogc3RyaW5nKSA9PiB7XHJcbiAgICAgICAgY29uc3QgZXZlbnRUeXBlID0gZGlyLnNwbGl0KCc6JylbMV07XHJcbiAgICAgICAgY29uc3QgZm4gPSB2bS4kb3B0aW9ucy5tZXRob2RzICYmIHZtLiRvcHRpb25zLm1ldGhvZHNbZXhwXTtcclxuICAgICAgICBpZiAoZXZlbnRUeXBlICYmIGZuKSB7XHJcbiAgICAgICAgICAgIG5vZGUuYWRkRXZlbnRMaXN0ZW5lcihldmVudFR5cGUsIGZuLmJpbmQodm0ucHJveHkpLCBmYWxzZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIF9nZXRWTVZhbDogKHZtOiBCaXViLCBleHA6IGFueSkgPT4geyAgICAgIFxyXG4gICAgICAgIGxldCB2YWwgPSB2bS5wcm94eTtcclxuICAgICAgICBleHAgPSBleHAuc3BsaXQoJy4nKTtcclxuICAgICAgICBleHAuZm9yRWFjaCgoazogc3RyaW5nKSA9PiB7ICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHZhbCA9IHZhbFtrXTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gdmFsO1xyXG4gICAgfSxcclxuXHJcbiAgICBfc2V0Vk1WYWw6ICh2bTogQml1YiwgZXhwOiBzdHJpbmcsIHZhbDogc3RyaW5nKSA9PiB7ICAgICAgICBcclxuICAgICAgICB2bS5wcm94eVtleHBdID0gdmFsO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydCBkZWZhdWx0IGRpcmVjdGl2ZXM7IiwiaW1wb3J0IEJpdWIgZnJvbSBcIi4uL2luZGV4XCI7XHJcbmltcG9ydCBkaXJlY3RpdmVzIGZyb20gJy4vZGlycyc7XHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbXBpbGUge1xyXG4gICAgJHZtOiBCaXViO1xyXG4gICAgJGVsOiBFbGVtZW50O1xyXG4gICAgJGZyYWdtZW50OiBEb2N1bWVudEZyYWdtZW50O1xyXG4gICAgY29uc3RydWN0b3IoZWw6IHN0cmluZywgdm06IEJpdWIpIHtcclxuICAgICAgICB0aGlzLiR2bSA9IHZtO1xyXG4gICAgICAgIHRoaXMuJGVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihlbCk7XHJcbiAgICAgICAgaWYgKHRoaXMuJGVsKSB7XHJcbiAgICAgICAgICAgIHRoaXMuJGZyYWdtZW50ID0gdGhpcy5ub2RlMkZyYWdtZW50KHRoaXMuJGVsKTtcclxuICAgICAgICAgICAgLy8g5aSE55CG5a6M5pWw5o2u5YaN5riy5p+TZG9tXHJcbiAgICAgICAgICAgIHRoaXMuaW5pdCgpOyAvLyDlpITnkIbmlbDmja5cclxuICAgICAgICAgICAgdGhpcy4kZWwuYXBwZW5kQ2hpbGQodGhpcy4kZnJhZ21lbnQpOyAvLyDnm7jlvZPkuo7muLLmn5PmlbDmja5cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBub2RlMkZyYWdtZW50KGVsOiBFbGVtZW50KSB7XHJcbiAgICAgICAgbGV0IGZyYWdtZW50ID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpLCBjaGlsZDtcclxuICAgICAgICAvLyDlsIbljp/nlJ/oioLngrnmi7fotJ3liLBmcmFnbWVudFxyXG4gICAgICAgIHdoaWxlIChjaGlsZCA9IGVsLmZpcnN0Q2hpbGQpIHtcclxuICAgICAgICAgICAgZnJhZ21lbnQuYXBwZW5kQ2hpbGQoY2hpbGQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZnJhZ21lbnQ7XHJcbiAgICB9XHJcbiAgICBpbml0KCkge1xyXG4gICAgICAgIHRoaXMuY29tcGlsZUVsZW1lbnQodGhpcy4kZnJhZ21lbnQpO1xyXG4gICAgfVxyXG4gICAgY29tcGlsZUVsZW1lbnQoZWw6IERvY3VtZW50RnJhZ21lbnQgfCBOb2RlKSB7XHJcbiAgICAgICAgY29uc3QgY2hpbGROb2RlcyA9IGVsLmNoaWxkTm9kZXM7XHJcbiAgICAgICAgY2hpbGROb2Rlcy5mb3JFYWNoKChub2RlOiBhbnkpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgdGV4dCA9IG5vZGUudGV4dENvbnRlbnQ7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlZyA9IC9cXHtcXHsoLiopXFx9XFx9LztcclxuICAgICAgICAgICAgaWYgKHRoaXMuaXNFbGVtZW50Tm9kZShub2RlKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jb21waWxlKG5vZGUpO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuaXNUZXh0Tm9kZShub2RlKSAmJiByZWcudGVzdCh0ZXh0KSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jb21waWxlVGV4dChub2RlLCBSZWdFeHAuJDEudHJpbSgpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAobm9kZS5jaGlsZE5vZGVzICYmIG5vZGUuY2hpbGROb2Rlcy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY29tcGlsZUVsZW1lbnQobm9kZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIGNvbXBpbGUobm9kZTogYW55KSB7XHJcbiAgICAgICAgY29uc3Qgbm9kZUF0dHJzID0gbm9kZS5hdHRyaWJ1dGVzO1xyXG4gICAgICAgIGZvciAoY29uc3QgYXR0ciBvZiBub2RlQXR0cnMpIHtcclxuICAgICAgICAgICAgY29uc3QgYXR0ck5hbWUgPSBhdHRyLm5hbWU7XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5pc0RpcmVjdGl2ZShhdHRyTmFtZSkpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGV4cCA9IGF0dHIudmFsdWU7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBkaXIgPSBhdHRyTmFtZS5zdWJzdHJpbmcoMik7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pc0V2ZW50RGlyZWN0aXZlKGRpcikpIHsgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIC8vIOS6i+S7tuaMh+S7pFxyXG4gICAgICAgICAgICAgICAgICAgIGRpcmVjdGl2ZXMuZXZlbnRIYW5kbGVyKG5vZGUsIHRoaXMuJHZtLCBleHAsIGRpcik7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIG1vZGVs5oyH5LukXHJcbiAgICAgICAgICAgICAgICAgICAgZGlyZWN0aXZlcy5tb2RlbChub2RlLCB0aGlzLiR2bSwgZXhwKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIG5vZGUucmVtb3ZlQXR0cmlidXRlKGF0dHJOYW1lKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGNvbXBpbGVUZXh0KG5vZGU6IEVsZW1lbnQsIGV4cDogc3RyaW5nKSB7XHJcbiAgICAgICAgZGlyZWN0aXZlcy50ZXh0KG5vZGUsIHRoaXMuJHZtLCBleHApO1xyXG4gICAgfVxyXG4gICAgLy8g5pmu6YCa5oyH5LukXHJcbiAgICBpc0RpcmVjdGl2ZShhdHRyOiBzdHJpbmcpIHtcclxuICAgICAgICByZXR1cm4gYXR0ci5pbmRleE9mKCd2LScpID09IDA7XHJcbiAgICB9XHJcbiAgICAvLyDkuovku7bmjIfku6RcclxuICAgIGlzRXZlbnREaXJlY3RpdmUoZGlyOiBzdHJpbmcpIHtcclxuICAgICAgICByZXR1cm4gZGlyLmluZGV4T2YoJ29uJykgPT09IDA7XHJcbiAgICB9XHJcbiAgICAvLyDmlofmoaPoioLngrlcclxuICAgIGlzRWxlbWVudE5vZGUobm9kZTogYW55KSB7XHJcbiAgICAgICAgcmV0dXJuIG5vZGUubm9kZVR5cGUgPT0gMTtcclxuICAgIH1cclxuICAgIC8vIOaWh+acrOiKgueCuVxyXG4gICAgaXNUZXh0Tm9kZShub2RlOiBhbnkpIHtcclxuICAgICAgICByZXR1cm4gbm9kZS5ub2RlVHlwZSA9PSAzO1xyXG4gICAgfVxyXG59OyIsImV4cG9ydCBkZWZhdWx0IHtcclxuICAgIHRleHQobm9kZTogYW55LCB2YWx1ZTogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgICAgY29uc3QgcmVnZXggPSAvXFx7XFx7KC4qKVxcfVxcfS87XHJcbiAgICAgICAgaWYgKHJlZ2V4LmV4ZWMobm9kZS50ZXh0Q29udGVudCkpIHtcclxuICAgICAgICAgICAgY29uc3Qgc3RyID0gKHJlZ2V4LmV4ZWMobm9kZS50ZXh0Q29udGVudCkpWzBdO1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIHZhbHVlICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICAgICAgbm9kZS50ZXh0Q29udGVudCA9IG5vZGUudGV4dENvbnRlbnQucmVwbGFjZShzdHIsIHZhbHVlKTtcclxuICAgICAgICAgICAgICAgIG5vZGUuc2V0VmFsID0gdmFsdWU7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBub2RlLnRleHRDb250ZW50ID0gbm9kZS50ZXh0Q29udGVudC5yZXBsYWNlKHN0ciwgJycpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgeyAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBub2RlLnRleHRDb250ZW50ID0gbm9kZS50ZXh0Q29udGVudC5yZXBsYWNlKG5vZGUuc2V0VmFsICsgJycsIHZhbHVlKTtcclxuICAgICAgICAgICAgbm9kZS5zZXRWYWwgPSB2YWx1ZTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgbW9kZWwobm9kZTogSFRNTElucHV0RWxlbWVudCwgdmFsdWU6IHN0cmluZywgb2xkVmFsdWU6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgICAgIG5vZGUudmFsdWUgPSB0eXBlb2YgdmFsdWUgPT0gJ3VuZGVmaW5lZCcgPyAnJyA6IHZhbHVlO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgb3B0aW9ucyB9IGZyb20gXCIuLi90eXBlcy9pbmRleFwiO1xyXG5pbXBvcnQgQ29tcGlsZSBmcm9tICcuL2NvbXBpbGUvaW5kZXgnO1xyXG5pbXBvcnQgV2F0Y2hlciBmcm9tICcuL3N1YnNjcmliZS93YXRjaGVyJztcclxuaW1wb3J0IERlcCBmcm9tIFwiLi9zdWJzY3JpYmUvZGVwXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCaXViIHtcclxuICAgICRvcHRpb25zOiBvcHRpb25zO1xyXG4gICAgcHJveHk6IEJpdWI7XHJcbiAgICBkZXBzOiB7XHJcbiAgICAgICAgW25hbWU6IHN0cmluZ106IERlcFxyXG4gICAgfVxyXG4gICAgW3Byb3BOYW1lOiBzdHJpbmddOiBhbnk7XHJcbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zOiBvcHRpb25zKSB7XHJcbiAgICAgICAgdGhpcy4kb3B0aW9ucyA9IG9wdGlvbnM7XHJcbiAgICAgICAgdGhpcy5faW5pdFNldCgpO1xyXG4gICAgICAgIHRoaXMuZGVwcyA9IHt9O1xyXG4gICAgICAgIHRoaXMucHJveHkgPSB0aGlzLmRlZmluZVByb3h5KCk7XHJcbiAgICAgICAgdGhpcy4kY29tcGlsZSA9IG5ldyBDb21waWxlKG9wdGlvbnMuZWwsIHRoaXMpO1xyXG4gICAgfVxyXG4gICAgJHdhdGNoKGtleTogc3RyaW5nLCBjYjogRnVuY3Rpb24pIHtcclxuICAgICAgICBuZXcgV2F0Y2hlcih0aGlzLCBrZXksIGNiKTtcclxuICAgIH1cclxuICAgIGRlZmluZVByb3h5KCkge1xyXG4gICAgICAgIGNvbnN0IGRlcHMgPSB0aGlzLmRlcHM7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm94eSh0aGlzLCB7XHJcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKHRhcmdldDogQml1Yiwga2V5OiBzdHJpbmcgfCBudW1iZXIpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0YXJnZXRba2V5XSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghZGVwc1trZXldKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlcHNba2V5XSA9IG5ldyBEZXAoKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoRGVwLnRhcmdldCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVwc1trZXldLmRlcGVuZCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IFxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGFyZ2V0W2tleV07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gUmVmbGVjdC5nZXQodGFyZ2V0LCBrZXkpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uICh0YXJnZXQsIGtleTogYW55LCB2YWx1ZSwgcmVjZWl2ZXIpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGtleXMgPSBrZXkuc3BsaXQoJy4nKTtcclxuICAgICAgICAgICAgICAgIGlmIChrZXlzLmxlbmd0aCA+IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICBrZXkgPSBrZXlzWzBdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY29uc3QgZGVwID0gZGVwc1trZXldO1xyXG4gICAgICAgICAgICAgICAgZGVwICYmIGRlcC5ub3RpZnkodmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFJlZmxlY3Quc2V0KHRhcmdldCwga2V5LCB2YWx1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgfVxyXG4gICAgX2luaXRTZXQoKSB7XHJcbiAgICAgICAgY29uc3QgeyBtZXRob2RzLCBkYXRhIH0gPSB0aGlzLiRvcHRpb25zXHJcbiAgICAgICAgT2JqZWN0LmtleXMoZGF0YSkuZm9yRWFjaCgoa2V5KSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXNba2V5XSA9IGRhdGFba2V5XTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBPYmplY3Qua2V5cyhtZXRob2RzKS5mb3JFYWNoKChrZXkpID0+IHtcclxuICAgICAgICAgICAgdGhpc1trZXldID0gbWV0aG9kc1trZXldO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgX2luaXRDb21wdXRlZCgpIHtcclxuICAgICAgICAvLyB0aGlzLiRvcHRpb25zLmNvbXB1dGVkICYmIHRoaXMuJG9wdGlvbnMuY29tcHV0ZWQuY2FsbCh0aGlzLnByb3h5KTsgICAgICAgICBcclxuICAgIH1cclxufTsiLCJpbXBvcnQgV2F0Y2hlciBmcm9tICcuL3dhdGNoZXInO1xyXG5pbXBvcnQgQml1YiBmcm9tICcuLi9pbmRleCc7XHJcbmxldCBkZXBpZCA9IDA7XHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERlcCB7XHJcbiAgICBzdGF0aWMgdGFyZ2V0OiBXYXRjaGVyIHwgbnVsbCA9IG51bGw7XHJcbiAgICBpZDogbnVtYmVyOyAgICBcclxuICAgIHN1YnM6IEFycmF5PFdhdGNoZXI+O1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5pZCA9IGRlcGlkKys7XHJcbiAgICAgICAgdGhpcy5zdWJzID0gW107XHJcbiAgICB9ICBcclxuICAgIGFkZFN1Yih3YXRjaGVyOiBXYXRjaGVyKSB7XHJcbiAgICAgICAgdGhpcy5zdWJzLnB1c2god2F0Y2hlcik7XHJcbiAgICB9XHJcbiAgICBkZXBlbmQoKSB7XHJcbiAgICAgICAgaWYgKERlcC50YXJnZXQpIHtcclxuICAgICAgICAgICAgRGVwLnRhcmdldC5hZGREZXAodGhpcyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmVtb3ZlU3ViKHdhdGNoZXI6IFdhdGNoZXIpIHtcclxuICAgICAgICBjb25zdCBpbmRleCA9IHRoaXMuc3Vicy5pbmRleE9mKHdhdGNoZXIpO1xyXG4gICAgICAgIGlmIChpbmRleCAhPSAtMSkge1xyXG4gICAgICAgICAgICB0aGlzLnN1YnMuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBub3RpZnkodm06IEJpdWIpIHtcclxuICAgICAgICB0aGlzLnN1YnMuZm9yRWFjaCgod2F0Y2hlcjogV2F0Y2hlcikgPT4ge1xyXG4gICAgICAgICAgICB3YXRjaGVyLnVwZGF0ZSh2bSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn07XHJcblxyXG4iLCJpbXBvcnQgRGVwIGZyb20gJy4vZGVwJztcclxuaW1wb3J0IEJpdWIgZnJvbSAnLi4vaW5kZXgnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV2F0Y2hlciB7XHJcbiAgICB1cGRhdGVyOiBGdW5jdGlvbjtcclxuICAgIGV4cE9yRm46IHN0cmluZyB8IEZ1bmN0aW9uO1xyXG4gICAgZGVwSWRzOiB7IFtrZXk6IG51bWJlcl06IERlcCB9O1xyXG4gICAgdmFsdWU6IHN0cmluZyB8IG51bWJlciB8IHN5bWJvbDtcclxuICAgIHZtOiBCaXViO1xyXG4gICAgZ2V0dGVyOiBhbnk7XHJcbiAgICBjb25zdHJ1Y3Rvcih2bTogQml1YiwgZXhwT3JGbjogc3RyaW5nIHwgRnVuY3Rpb24sIHVwZGF0ZXI6IEZ1bmN0aW9uKSB7XHJcbiAgICAgICAgdGhpcy51cGRhdGVyID0gdXBkYXRlcjtcclxuICAgICAgICB0aGlzLnZtID0gdm07XHJcbiAgICAgICAgdGhpcy5leHBPckZuID0gZXhwT3JGbjtcclxuICAgICAgICB0aGlzLmRlcElkcyA9IHt9O1xyXG4gICAgICAgIGlmICh0eXBlb2YgZXhwT3JGbiA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICB0aGlzLmdldHRlciA9IGV4cE9yRm47XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5nZXR0ZXIgPSB0aGlzLnBhcnNlR2V0dGVyKGV4cE9yRm4udHJpbSgpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy52YWx1ZSA9IHRoaXMuZ2V0KCk7XHJcbiAgICB9ICAgIFxyXG4gICAgdXBkYXRlKHZhbDogYW55KSB7XHJcbiAgICAgICAgdGhpcy5ydW4odmFsKTtcclxuICAgIH1cclxuICAgIHJ1bih2YWw6IGFueSkge1xyXG4gICAgICAgIGNvbnN0IG9sZFZhbCA9IHRoaXMudmFsdWU7XHJcbiAgICAgICAgaWYgKHZhbCAhPT0gb2xkVmFsKSB7XHJcbiAgICAgICAgICAgIHRoaXMudmFsdWUgPSB2YWw7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlci5jYWxsKHRoaXMudm0sIHZhbCwgb2xkVmFsKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBhZGREZXAoZGVwOiBEZXApIHtcclxuICAgICAgICBpZiAoIXRoaXMuZGVwSWRzLmhhc093blByb3BlcnR5KGRlcC5pZCkpIHtcclxuICAgICAgICAgICAgZGVwLmFkZFN1Yih0aGlzKTtcclxuICAgICAgICAgICAgdGhpcy5kZXBJZHNbZGVwLmlkXSA9IGRlcDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBnZXQoKSB7XHJcbiAgICAgICAgRGVwLnRhcmdldCA9IHRoaXM7XHJcbiAgICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLmdldHRlci5jYWxsKHRoaXMudm0sIHRoaXMudm0pO1xyXG4gICAgICAgIERlcC50YXJnZXQgPSBudWxsO1xyXG4gICAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgIH1cclxuICAgIHBhcnNlR2V0dGVyKGV4cDogc3RyaW5nICkge1xyXG4gICAgICAgIGNvbnN0IGV4cHMgPSBleHAuc3BsaXQoJy4nKTtcclxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBsZXQgdmFsID0gdGhpcy5wcm94eTtcclxuICAgICAgICAgICAgZXhwcy5mb3JFYWNoKChrOiBhbnkpID0+IHtcclxuICAgICAgICAgICAgICAgIHZhbCA9IHZhbFtrXVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcmV0dXJuIHZhbDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn07IiwiaW1wb3J0IEJpdWIgZnJvbSAnLi9jb3JlL2luZGV4JztcclxubGV0IGluZGV4ID0gMTAwMDA7XHJcbmNvbnN0IHZtID0gbmV3IEJpdWIoe1xyXG4gICAgZWw6ICcjYXBwJyxcclxuICAgIGRhdGE6IHtcclxuICAgICAgICBzYWxhcnk6IDEwMDAwLFxyXG4gICAgICAgIG5hbWU6ICduYW5jeScsXHJcbiAgICAgICAgb2JqOiB7XHJcbiAgICAgICAgICAgIGtrOiB7XHJcbiAgICAgICAgICAgICAgICBjaGlsZE5hbWU6ICdwb255JyxcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBtZXRob2RzOiB7XHJcbiAgICAgICAgY2xpY2soZTogRXZlbnQpIHtcclxuICAgICAgICAgICAgdGhpcy5zYWxhcnkgPSBpbmRleCArPSAxMDAwO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSk7XHJcbnZtLiR3YXRjaCgnc2FsYXJ5JywgZnVuY3Rpb24gKCkge1xyXG4gICAgY29uc29sZS5sb2codGhpcy5zYWxhcnkpO1xyXG59KTsiXSwic291cmNlUm9vdCI6IiJ9