import { options } from "../types/index";
import Dep from "./dep";
export default class Biub {
    constructor(options: options);
    $options: options;
    proxy: Biub;
    deps: {
        [name: string]: Dep;
    };
    [propName: string]: any;
    defineProxy(): Biub;
    _initSet(): void;
    _initComputed(): void;
}
