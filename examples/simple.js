/**
 * The simple use of lark-switcher
 **/
'use strict';

const debug = require('debug')('switch-case.examples.simple');
const Switcher = require('..');

debug('loading ...');

const switcher = new Switcher();
switcher.match = (condition, target, o) => {
    if (o.matched || target > condition) return false;
    o.matched = true;
    return true;
};

switcher.case(3,   age => console.log(age + ' years old, less than 3 years old'));
switcher.case(18,  age => console.log(age + ' years old, less than 18 years old boy'));
switcher.case(30,  age => console.log(age + ' years old, less than 30 years old boy'));
switcher.case(55,  age => console.log(age + ' years old, less than 55 years old boy'));

for (let i = 1; i <= 80; i += parseInt(Math.random() * 10, 10)) {
    switcher.dispatch(i, {});
}

debug('loaded!');
