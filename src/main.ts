import Biub from './core/index';
let index = 10000;
const mvvm = new Biub({
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
mvvm.$watch('salary', function () {
    console.log(this.salary);
});