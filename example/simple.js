'use strict';

const Switcher = require('switch-case');

const switcher = new Switcher();

switcher.case('Greet', () => console.log("How are you"));
switcher.case('Leave', () => console.log("Good bye!"));
switcher.case('Thank', () => console.log("Thank you"));
switcher.case(1, () => 5);

switcher.switch('Greet');
switcher.switch('Leave');
switcher.switch('Thank');
switcher.switch(1).then(result => console.log(result));
