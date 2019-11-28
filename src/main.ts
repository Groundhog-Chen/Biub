import Biub from './core/index';
var index = 10000;
var vm = new Biub({
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