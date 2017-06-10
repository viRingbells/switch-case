'use strict';

const Switcher = require('..');

const main = new Switcher();
const sub  = new Switcher();

main.match = sub.match = (condition, target) => {
    const result = condition.toString() === target.toString()[0];
    return result;
};

main.nesting = (target) => {
    return [target % 10];
}

main.case(1, sub);

sub.case(1, () => { console.log('s11'); });
sub.case(2, () => { console.log('s12'); });
sub.case(3, () => { console.log('s13'); });
sub.case(4, () => { console.log('s14'); });

main.dispatch(12);
main.dispatch(14);
main.dispatch(24);
