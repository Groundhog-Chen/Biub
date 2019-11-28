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
/* harmony import */ var _watcher__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../watcher */ "./src/core/watcher.ts");
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
        new _watcher__WEBPACK_IMPORTED_MODULE_0__["default"](vm, exp, (value, oldValue) => {
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
        var val = vm.proxy;
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
        console.log(el);
        this.$vm = vm;
        this.$el = document.querySelector(el);
        console.log(document.querySelector('body'));
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
        var childNodes = el.childNodes;
        childNodes.forEach((node) => {
            console.log(node);
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
                    _dirs__WEBPACK_IMPORTED_MODULE_0__["default"].text(node, this.$vm, exp);
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
        node.textContent = typeof value == 'undefined' ? '' : value;
    },
    model(node, value, oldValue) {
        node.value = typeof value == 'undefined' ? '' : value;
    }
});


/***/ }),

/***/ "./src/core/dep.ts":
/*!*************************!*\
  !*** ./src/core/dep.ts ***!
  \*************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Dep; });
let depid = 0;
class Dep {
    constructor() {
        this.id = depid++;
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
/* harmony import */ var _dep__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./dep */ "./src/core/dep.ts");


class Biub {
    constructor(options) {
        this.$options = options;
        this._initSet();
        console.log(this);
        this.proxy = this.defineProxy();
        this.$compile = new _compile_index__WEBPACK_IMPORTED_MODULE_0__["default"](options.el, this);
    }
    defineProxy() {
        const deps = this.deps;
        return new Proxy(this, {
            get: function (target, key) {
                if (target[key]) {
                    if (!deps[key]) {
                        deps[key] = new _dep__WEBPACK_IMPORTED_MODULE_1__["default"]();
                    }
                    else {
                        deps[key].depend();
                    }
                    return target[key];
                }
                return Reflect.get(target, key);
            },
            set: function (target, key, value) {
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

/***/ "./src/core/watcher.ts":
/*!*****************************!*\
  !*** ./src/core/watcher.ts ***!
  \*****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Watcher; });
/* harmony import */ var _dep__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dep */ "./src/core/dep.ts");

class Watcher {
    constructor(vm, expOrFn, updater) {
        this.updater = updater;
        this.vm = vm;
        this.expOrFn = expOrFn;
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
        var oldVal = this.value;
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
        var value = this.getter.call(this.vm, this.vm);
        _dep__WEBPACK_IMPORTED_MODULE_0__["default"].target = null;
        return value;
    }
    parseGetter(exp) {
        const exps = exp.split('.');
        return function () {
            var val = this.proxy;
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

var index = 1;
new _core_index__WEBPACK_IMPORTED_MODULE_0__["default"]({
    el: '#app',
    data: {
        id: 1,
        name: 'nancy',
        obj: {
            childName: 'tony',
            kk: {
                childName: 'pony',
            }
        }
    },
    methods: {
        clickBtn(e) {
            this.id = index += 1;
        }
    },
});


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvcmUvY29tcGlsZS9kaXJzLnRzIiwid2VicGFjazovLy8uL3NyYy9jb3JlL2NvbXBpbGUvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvcmUvY29tcGlsZS91cGRhdGVycy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY29yZS9kZXAudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvcmUvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvcmUvd2F0Y2hlci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbWFpbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO1FBQUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7OztRQUdBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwwQ0FBMEMsZ0NBQWdDO1FBQzFFO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0Esd0RBQXdELGtCQUFrQjtRQUMxRTtRQUNBLGlEQUFpRCxjQUFjO1FBQy9EOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSx5Q0FBeUMsaUNBQWlDO1FBQzFFLGdIQUFnSCxtQkFBbUIsRUFBRTtRQUNySTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDJCQUEyQiwwQkFBMEIsRUFBRTtRQUN2RCxpQ0FBaUMsZUFBZTtRQUNoRDtRQUNBO1FBQ0E7O1FBRUE7UUFDQSxzREFBc0QsK0RBQStEOztRQUVySDtRQUNBOzs7UUFHQTtRQUNBOzs7Ozs7Ozs7Ozs7O0FDakZBO0FBQUE7QUFBQTtBQUFpQztBQUNDO0FBQ2xDLE1BQU0sVUFBVSxHQUFHO0lBQ2YsSUFBSSxFQUFFLENBQUMsSUFBYSxFQUFFLEVB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QVMsRUFBRSxNQUFNO1lBQ2pCLEVBQUUsRUFBRTtnQkFDQSxTQUFTLEVBQUUsTUFBTTthQUNwQjtTQUNKO0tBQ0o7SUFDRCxPQUFPLEVBQUU7UUFDTCxRQUFRLENBQUMsQ0FBUTtZQUNiLElBQUksQ0FBQyxFQUFFLEdBQUcsS0FBSyxJQUFJLENBQUMsQ0FBQztRQUN6QixDQUFDO0tBQ0o7Q0FDSixDQUFDLENBQUMiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvbWFpbi50c1wiKTtcbiIsImltcG9ydCBCaXViIGZyb20gXCIuLi9pbmRleFwiO1xyXG5pbXBvcnQgV2F0Y2hlciBmcm9tICcuLi93YXRjaGVyJztcclxuaW1wb3J0IHVwZGF0ZXJzIGZyb20gJy4vdXBkYXRlcnMnO1xyXG5jb25zdCBkaXJlY3RpdmVzID0ge1xyXG4gICAgdGV4dDogKG5vZGU6IEVsZW1lbnQsIHZtOiBCaXViLCBleHA6IHN0cmluZykgPT4ge1xyXG4gICAgICAgIGRpcmVjdGl2ZXMuYmluZChub2RlLCB2bSwgZXhwLCB1cGRhdGVycy50ZXh0KTtcclxuICAgIH0sXHJcbiAgICBtb2RlbDogKG5vZGU6IEhUTUxJbnB1dEVsZW1lbnQsIHZtOiBCaXViLCBleHA6IHN0cmluZykgPT4ge1xyXG4gICAgICAgIGRpcmVjdGl2ZXMuYmluZChub2RlLCB2bSwgZXhwLCB1cGRhdGVycy5tb2RlbCk7XHJcbiAgICAgICAgbGV0IHZhbCA9IGRpcmVjdGl2ZXMuX2dldFZNVmFsKHZtLCBleHApO1xyXG4gICAgICAgIG5vZGUuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCAoZTogYW55KSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IG5ld1ZhbCA9IGUudGFyZ2V0LnZhbHVlO1xyXG4gICAgICAgICAgICBpZiAodmFsID09PSBuZXdWYWwpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBkaXJlY3RpdmVzLl9zZXRWTVZhbCh2bSwgZXhwLCBuZXdWYWwpO1xyXG4gICAgICAgICAgICB2YWwgPSBuZXdWYWw7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG4gICAgLy8gZG9t6IqC54K5IHZt5a+56LGhIGV4cCB2bS5kYXRh5a+56LGh5bGe5oCn5ZCN56ewIGRpcuaMh+S7pOWQjeensFxyXG4gICAgYmluZDogKG5vZGU6IE5vZGUsIHZtOiBCaXViLCBleHA6IHN0cmluZywgdXBkYXRlcjogRnVuY3Rpb24pID0+IHtcclxuICAgICAgICBjb25zdCB2YWx1ZSA9IGRpcmVjdGl2ZXMuX2dldFZNVmFsKHZtLCBleHApO1xyXG4gICAgICAgIHVwZGF0ZXIgJiYgdXBkYXRlcihub2RlLCB2YWx1ZSk7XHJcbiAgICAgICAgbmV3IFdhdGNoZXIodm0sIGV4cCwgKHZhbHVlOiBhbnksIG9sZFZhbHVlPzogYW55KSA9PiB7XHJcbiAgICAgICAgICAgIHVwZGF0ZXIgJiYgdXBkYXRlcihub2RlLCB2YWx1ZSwgb2xkVmFsdWUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSxcclxuICAgIC8vIOS6i+S7tuWkhOeQhlxyXG4gICAgZXZlbnRIYW5kbGVyOiAobm9kZTogRWxlbWVudCwgdm06IEJpdWIsIGV4cDogc3RyaW5nLCBkaXI6IHN0cmluZykgPT4ge1xyXG4gICAgICAgIGNvbnN0IGV2ZW50VHlwZSA9IGRpci5zcGxpdCgnOicpWzFdO1xyXG4gICAgICAgIGNvbnN0IGZuID0gdm0uJG9wdGlvbnMubWV0aG9kcyAmJiB2bS4kb3B0aW9ucy5tZXRob2RzW2V4cF07XHJcbiAgICAgICAgaWYgKGV2ZW50VHlwZSAmJiBmbikge1xyXG4gICAgICAgICAgICBub2RlLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRUeXBlLCBmbi5iaW5kKHZtLnByb3h5KSwgZmFsc2UpO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBfZ2V0Vk1WYWw6ICh2bTogQml1YiwgZXhwOiBhbnkpID0+IHtcclxuICAgICAgICB2YXIgdmFsID0gdm0ucHJveHk7XHJcbiAgICAgICAgZXhwID0gZXhwLnNwbGl0KCcuJyk7XHJcbiAgICAgICAgZXhwLmZvckVhY2goKGs6IHN0cmluZykgPT4ge1xyXG4gICAgICAgICAgICB2YWwgPSB2YWxba11cclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gdmFsO1xyXG4gICAgfSxcclxuXHJcbiAgICBfc2V0Vk1WYWw6ICh2bTogQml1YiwgZXhwOiBzdHJpbmcsIHZhbDogc3RyaW5nKSA9PiB7XHJcbiAgICAgICAgdm0ucHJveHlbZXhwXSA9IHZhbDtcclxuICAgIH1cclxufVxyXG5leHBvcnQgZGVmYXVsdCBkaXJlY3RpdmVzOyIsImltcG9ydCBCaXViIGZyb20gXCIuLi9pbmRleFwiO1xyXG5pbXBvcnQgZGlyZWN0aXZlcyBmcm9tICcuL2RpcnMnO1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb21waWxlIHtcclxuICAgICR2bTogQml1YjtcclxuICAgICRlbDogRWxlbWVudDtcclxuICAgICRmcmFnbWVudDogRG9jdW1lbnRGcmFnbWVudDtcclxuICAgIGNvbnN0cnVjdG9yKGVsOiBzdHJpbmcsIHZtOiBCaXViKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coZWwpXHJcbiAgICAgICAgdGhpcy4kdm0gPSB2bTtcclxuICAgICAgICB0aGlzLiRlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoZWwpO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdhcHAnKSlcclxuICAgICAgICBjb25zb2xlLmxvZyhkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdib2R5JykpXHJcbiAgICAgICAgaWYgKHRoaXMuJGVsKSB7XHJcbiAgICAgICAgICAgIHRoaXMuJGZyYWdtZW50ID0gdGhpcy5ub2RlMkZyYWdtZW50KHRoaXMuJGVsKTtcclxuICAgICAgICAgICAgLy8g5aSE55CG5a6M5pWw5o2u5YaN5riy5p+TZG9tXHJcbiAgICAgICAgICAgIHRoaXMuaW5pdCgpOyAvLyDlpITnkIbmlbDmja5cclxuICAgICAgICAgICAgdGhpcy4kZWwuYXBwZW5kQ2hpbGQodGhpcy4kZnJhZ21lbnQpOyAvLyDnm7jlvZPkuo7muLLmn5PmlbDmja5cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBub2RlMkZyYWdtZW50KGVsOiBFbGVtZW50KSB7XHJcbiAgICAgICAgbGV0IGZyYWdtZW50ID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpLCBjaGlsZDtcclxuICAgICAgICAvLyDlsIbljp/nlJ/oioLngrnmi7fotJ3liLBmcmFnbWVudFxyXG4gICAgICAgIHdoaWxlIChjaGlsZCA9IGVsLmZpcnN0Q2hpbGQpIHtcclxuICAgICAgICAgICAgZnJhZ21lbnQuYXBwZW5kQ2hpbGQoY2hpbGQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZnJhZ21lbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdCgpIHtcclxuICAgICAgICB0aGlzLmNvbXBpbGVFbGVtZW50KHRoaXMuJGZyYWdtZW50KTtcclxuICAgIH1cclxuXHJcbiAgICBjb21waWxlRWxlbWVudChlbDogRG9jdW1lbnRGcmFnbWVudCB8IE5vZGUpIHtcclxuICAgICAgICB2YXIgY2hpbGROb2RlcyA9IGVsLmNoaWxkTm9kZXM7XHJcbiAgICAgICAgY2hpbGROb2Rlcy5mb3JFYWNoKChub2RlOiBhbnkpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2cobm9kZSlcclxuICAgICAgICAgICAgY29uc3QgdGV4dCA9IG5vZGUudGV4dENvbnRlbnQ7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlZyA9IC9cXHtcXHsoLiopXFx9XFx9LztcclxuICAgICAgICAgICAgaWYgKHRoaXMuaXNFbGVtZW50Tm9kZShub2RlKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jb21waWxlKG5vZGUpO1xyXG5cclxuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLmlzVGV4dE5vZGUobm9kZSkgJiYgcmVnLnRlc3QodGV4dCkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY29tcGlsZVRleHQobm9kZSwgUmVnRXhwLiQxLnRyaW0oKSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChub2RlLmNoaWxkTm9kZXMgJiYgbm9kZS5jaGlsZE5vZGVzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jb21waWxlRWxlbWVudChub2RlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbXBpbGUobm9kZTogYW55KSB7XHJcbiAgICAgICAgY29uc3Qgbm9kZUF0dHJzID0gbm9kZS5hdHRyaWJ1dGVzO1xyXG4gICAgICAgIGZvciAoY29uc3QgYXR0ciBvZiBub2RlQXR0cnMpIHtcclxuICAgICAgICAgICAgY29uc3QgYXR0ck5hbWUgPSBhdHRyLm5hbWU7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlzRGlyZWN0aXZlKGF0dHJOYW1lKSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZXhwID0gYXR0ci52YWx1ZTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGRpciA9IGF0dHJOYW1lLnN1YnN0cmluZygyKTtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzRXZlbnREaXJlY3RpdmUoZGlyKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIOS6i+S7tuaMh+S7pFxyXG4gICAgICAgICAgICAgICAgICAgIGRpcmVjdGl2ZXMuZXZlbnRIYW5kbGVyKG5vZGUsIHRoaXMuJHZtLCBleHAsIGRpcik7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIOaZrumAmuaMh+S7pFxyXG4gICAgICAgICAgICAgICAgICAgIGRpcmVjdGl2ZXMudGV4dChub2RlLCB0aGlzLiR2bSwgZXhwKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIG5vZGUucmVtb3ZlQXR0cmlidXRlKGF0dHJOYW1lKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjb21waWxlVGV4dChub2RlOiBFbGVtZW50LCBleHA6IHN0cmluZykge1xyXG4gICAgICAgIGRpcmVjdGl2ZXMudGV4dChub2RlLCB0aGlzLiR2bSwgZXhwKTtcclxuICAgIH1cclxuICAgIC8vIOaZrumAmuaMh+S7pFxyXG4gICAgaXNEaXJlY3RpdmUoYXR0cjogc3RyaW5nKSB7XHJcbiAgICAgICAgcmV0dXJuIGF0dHIuaW5kZXhPZigndi0nKSA9PSAwO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIOS6i+S7tuaMh+S7pFxyXG4gICAgaXNFdmVudERpcmVjdGl2ZShkaXI6IHN0cmluZykge1xyXG4gICAgICAgIHJldHVybiBkaXIuaW5kZXhPZignb24nKSA9PT0gMDtcclxuICAgIH1cclxuXHJcbiAgICAvLyDmlofmoaPoioLngrlcclxuICAgIGlzRWxlbWVudE5vZGUobm9kZTogYW55KSB7XHJcbiAgICAgICAgcmV0dXJuIG5vZGUubm9kZVR5cGUgPT0gMTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDmlofmnKzoioLngrlcclxuICAgIGlzVGV4dE5vZGUobm9kZTogYW55KSB7XHJcbiAgICAgICAgcmV0dXJuIG5vZGUubm9kZVR5cGUgPT0gMztcclxuICAgIH1cclxuXHJcbn07IiwiZXhwb3J0IGRlZmF1bHQge1xyXG4gICAgdGV4dChub2RlOiBFbGVtZW50LCB2YWx1ZTogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgICAgbm9kZS50ZXh0Q29udGVudCA9IHR5cGVvZiB2YWx1ZSA9PSAndW5kZWZpbmVkJyA/ICcnIDogdmFsdWU7XHJcbiAgICB9LFxyXG4gICAgbW9kZWwobm9kZTogSFRNTElucHV0RWxlbWVudCwgdmFsdWU6IHN0cmluZywgb2xkVmFsdWU6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgICAgIG5vZGUudmFsdWUgPSB0eXBlb2YgdmFsdWUgPT0gJ3VuZGVmaW5lZCcgPyAnJyA6IHZhbHVlO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IFdhdGNoZXIgZnJvbSAnLi93YXRjaGVyJztcclxuaW1wb3J0IEJpdWIgZnJvbSAnLi9pbmRleCc7XHJcbmxldCBkZXBpZCA9IDA7XHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERlcCB7XHJcblxyXG4gICAgc3RhdGljIHRhcmdldDogV2F0Y2hlciB8IG51bGwgPSBudWxsO1xyXG5cclxuICAgIGlkOiBudW1iZXI7XHJcbiAgICBcclxuICAgIHN1YnM6IEFycmF5PFdhdGNoZXI+O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuaWQgPSBkZXBpZCsrO1xyXG4gICAgfSAgXHJcbiAgICBhZGRTdWIod2F0Y2hlcjogV2F0Y2hlcikge1xyXG4gICAgICAgIHRoaXMuc3Vicy5wdXNoKHdhdGNoZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIGRlcGVuZCgpIHtcclxuICAgICAgICBpZiAoRGVwLnRhcmdldCkge1xyXG4gICAgICAgICAgICBEZXAudGFyZ2V0LmFkZERlcCh0aGlzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmVtb3ZlU3ViKHdhdGNoZXI6IFdhdGNoZXIpIHtcclxuICAgICAgICBjb25zdCBpbmRleCA9IHRoaXMuc3Vicy5pbmRleE9mKHdhdGNoZXIpO1xyXG4gICAgICAgIGlmIChpbmRleCAhPSAtMSkge1xyXG4gICAgICAgICAgICB0aGlzLnN1YnMuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgbm90aWZ5KHZtOiBCaXViKSB7XHJcbiAgICAgICAgdGhpcy5zdWJzLmZvckVhY2goKHdhdGNoZXI6IFdhdGNoZXIpID0+IHtcclxuICAgICAgICAgICAgd2F0Y2hlci51cGRhdGUodm0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59O1xyXG5cclxuIiwiaW1wb3J0IHsgb3B0aW9ucyB9IGZyb20gXCIuLi90eXBlcy9pbmRleFwiO1xyXG5pbXBvcnQgQ29tcGlsZSBmcm9tICcuL2NvbXBpbGUvaW5kZXgnO1xyXG5pbXBvcnQgRGVwIGZyb20gXCIuL2RlcFwiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQml1YiB7XHJcbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zOiBvcHRpb25zKSB7XHJcbiAgICAgICAgdGhpcy4kb3B0aW9ucyA9IG9wdGlvbnM7XHJcbiAgICAgICAgdGhpcy5faW5pdFNldCgpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMpO1xyXG4gICAgICAgIHRoaXMucHJveHkgPSB0aGlzLmRlZmluZVByb3h5KCk7XHJcbiAgICAgICAgdGhpcy4kY29tcGlsZSA9IG5ldyBDb21waWxlKG9wdGlvbnMuZWwsIHRoaXMpO1xyXG4gICAgfVxyXG4gICAgJG9wdGlvbnM6IG9wdGlvbnM7XHJcbiAgICBwcm94eTogQml1YjtcclxuICAgIGRlcHM6IHtcclxuICAgICAgICBbbmFtZTogc3RyaW5nXTogRGVwXHJcbiAgICB9XHJcbiAgICBbcHJvcE5hbWU6IHN0cmluZ106IGFueTtcclxuICAgIGRlZmluZVByb3h5KCkge1xyXG4gICAgICAgIGNvbnN0IGRlcHMgPSB0aGlzLmRlcHM7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm94eSh0aGlzLCB7XHJcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKHRhcmdldDogQml1Yiwga2V5OiBzdHJpbmcgfCBudW1iZXIpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0YXJnZXRba2V5XSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghZGVwc1trZXldKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlcHNba2V5XSA9IG5ldyBEZXAoKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZXBzW2tleV0uZGVwZW5kKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0YXJnZXRba2V5XTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiBSZWZsZWN0LmdldCh0YXJnZXQsIGtleSk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHRhcmdldCwga2V5OiBzdHJpbmcgfCBudW1iZXIsIHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyh0YXJnZXQpXHJcbiAgICAgICAgICAgICAgICBjb25zdCBkZXAgPSBkZXBzW2tleV07XHJcbiAgICAgICAgICAgICAgICBkZXAgJiYgZGVwLm5vdGlmeSh2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gUmVmbGVjdC5zZXQodGFyZ2V0LCBrZXksIHZhbHVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcbiAgICBfaW5pdFNldCgpIHtcclxuICAgICAgICBjb25zdCB7IG1ldGhvZHMsIGRhdGEgfSA9IHRoaXMuJG9wdGlvbnNcclxuICAgICAgICBPYmplY3Qua2V5cyhkYXRhKS5mb3JFYWNoKChrZXkpID0+IHtcclxuICAgICAgICAgICAgdGhpc1trZXldID0gZGF0YVtrZXldO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIE9iamVjdC5rZXlzKG1ldGhvZHMpLmZvckVhY2goKGtleSkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzW2tleV0gPSBtZXRob2RzW2tleV07XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBfaW5pdENvbXB1dGVkKCkge1xyXG4gICAgICAgIC8vIHRoaXMuJG9wdGlvbnMuY29tcHV0ZWQgJiYgdGhpcy4kb3B0aW9ucy5jb21wdXRlZC5jYWxsKHRoaXMucHJveHkpOyAgICAgICAgXHJcbiAgICB9XHJcbn07IiwiaW1wb3J0IERlcCBmcm9tICcuL2RlcCc7XHJcbmltcG9ydCBCaXViIGZyb20gJy4vaW5kZXgnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV2F0Y2hlciB7XHJcbiAgICBjb25zdHJ1Y3Rvcih2bTogQml1YiwgZXhwT3JGbjogc3RyaW5nIHwgRnVuY3Rpb24sIHVwZGF0ZXI6IEZ1bmN0aW9uKSB7XHJcbiAgICAgICAgdGhpcy51cGRhdGVyID0gdXBkYXRlcjtcclxuICAgICAgICB0aGlzLnZtID0gdm07XHJcbiAgICAgICAgdGhpcy5leHBPckZuID0gZXhwT3JGbjtcclxuICAgICAgICBpZiAodHlwZW9mIGV4cE9yRm4gPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgdGhpcy5nZXR0ZXIgPSBleHBPckZuO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuZ2V0dGVyID0gdGhpcy5wYXJzZUdldHRlcihleHBPckZuLnRyaW0oKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMudmFsdWUgPSB0aGlzLmdldCgpO1xyXG4gICAgfVxyXG4gICAgdXBkYXRlcjogRnVuY3Rpb247XHJcbiAgICBleHBPckZuOiBzdHJpbmcgfCBGdW5jdGlvbjtcclxuICAgIGRlcElkczogeyBba2V5OiBudW1iZXJdOiBEZXAgfTtcclxuICAgIHZhbHVlOiBzdHJpbmcgfCBudW1iZXIgfCBzeW1ib2w7XHJcbiAgICB2bTogQml1YjtcclxuICAgIGdldHRlcjogYW55O1xyXG4gICAgdXBkYXRlKHZhbDogYW55KSB7XHJcbiAgICAgICAgdGhpcy5ydW4odmFsKTtcclxuICAgIH1cclxuXHJcbiAgICBydW4odmFsOiBhbnkpIHtcclxuICAgICAgICB2YXIgb2xkVmFsID0gdGhpcy52YWx1ZTtcclxuICAgICAgICBpZiAodmFsICE9PSBvbGRWYWwpIHtcclxuICAgICAgICAgICAgdGhpcy52YWx1ZSA9IHZhbDtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVyLmNhbGwodGhpcy52bSwgdmFsLCBvbGRWYWwpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBhZGREZXAoZGVwOiBEZXApIHtcclxuICAgICAgICBpZiAoIXRoaXMuZGVwSWRzLmhhc093blByb3BlcnR5KGRlcC5pZCkpIHtcclxuICAgICAgICAgICAgZGVwLmFkZFN1Yih0aGlzKTtcclxuICAgICAgICAgICAgdGhpcy5kZXBJZHNbZGVwLmlkXSA9IGRlcDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0KCkge1xyXG4gICAgICAgIERlcC50YXJnZXQgPSB0aGlzO1xyXG4gICAgICAgIHZhciB2YWx1ZSA9IHRoaXMuZ2V0dGVyLmNhbGwodGhpcy52bSwgdGhpcy52bSk7XHJcbiAgICAgICAgRGVwLnRhcmdldCA9IG51bGw7XHJcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIHBhcnNlR2V0dGVyKGV4cDogc3RyaW5nICkge1xyXG4gICAgICAgIGNvbnN0IGV4cHMgPSBleHAuc3BsaXQoJy4nKTtcclxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgdmFsID0gdGhpcy5wcm94eTtcclxuICAgICAgICAgICAgZXhwcy5mb3JFYWNoKChrOiBhbnkpID0+IHtcclxuICAgICAgICAgICAgICAgIHZhbCA9IHZhbFtrXVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcmV0dXJuIHZhbDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59OyIsImltcG9ydCBCaXViIGZyb20gJy4vY29yZS9pbmRleCc7XHJcbnZhciBpbmRleCA9IDE7XHJcbm5ldyBCaXViKHtcclxuICAgIGVsOiAnI2FwcCcsXHJcbiAgICBkYXRhOiB7XHJcbiAgICAgICAgaWQ6IDEsXHJcbiAgICAgICAgbmFtZTogJ25hbmN5JyxcclxuICAgICAgICBvYmo6IHtcclxuICAgICAgICAgICAgY2hpbGROYW1lOiAndG9ueScsXHJcbiAgICAgICAgICAgIGtrOiB7XHJcbiAgICAgICAgICAgICAgICBjaGlsZE5hbWU6ICdwb255JyxcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBtZXRob2RzOiB7XHJcbiAgICAgICAgY2xpY2tCdG4oZTogRXZlbnQpIHtcclxuICAgICAgICAgICAgdGhpcy5pZCA9IGluZGV4ICs9IDE7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxufSk7XHJcbiJdLCJzb3VyY2VSb290IjoiIn0=