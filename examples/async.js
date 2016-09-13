/**
 * The use of async handlers
 **/
'use strict';

const debug = require('debug')('switch-case.examples.async');
const Switcher = require('..');

debug('loading ...');

const switcher = new Switcher();

const options = { break: false };

switcher.case(1, () => console.log(1), options);
switcher.case(1, () => new Promise((resolve, reject) => {
    setTimeout(() => {
        console.log(2);
        resolve();
    }, 1000);
}), options);
switcher.case(1, () => new Promise((resolve, reject) => {
    setTimeout(() => {
        console.log(3);
        resolve();
    }, 500);
}), options);
switcher.case(2, () => console.log(4), options);
switcher.case(2, () => new Promise((resolve, reject) => {
    setTimeout(() => {
        console.log(5);
        resolve();
    }, 1000);
}), options);
switcher.case(2, () => new Promise((resolve, reject) => {
    setTimeout(() => {
        console.log(6);
        resolve();
    }, 500);
}), options);

switcher.dispatch(1).then(() => switcher.dispatch(2));
