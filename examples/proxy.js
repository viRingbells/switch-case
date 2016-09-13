/**
 * The use of mounting
 **/
'use strict';

const debug = require('debug')('lark-switcher.examples.mount');
const Switcher = require('..');

debug('loading ...');

const mainSwitcher = new Switcher();
const subSwitcher  = new Switcher();

mainSwitcher.match = setMatch('main');
subSwitcher.match = setMatch('sub');
function setMatch (name) {
    return (condition, target) => {
        const result = target.toString()[0] === condition.toString();
        return result;
    };
}

mainSwitcher.proxy = (target) => {
    target = parseInt(target % 10, 10);
    return target;
};

mainSwitcher.case(1, target => console.log('m1    ' + target));
mainSwitcher.case(2, subSwitcher);

subSwitcher.case(1, target => console.log('s1    ' + target));
subSwitcher.case(2, target => console.log('s2    ' + target));

mainSwitcher.dispatch(10);
mainSwitcher.dispatch(11);
mainSwitcher.dispatch(12);
mainSwitcher.dispatch(20);
mainSwitcher.dispatch(21);
mainSwitcher.dispatch(22);

debug('loaded!');
