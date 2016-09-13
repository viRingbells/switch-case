# switch-case
switcher for complex conditions

[![NPM version](https://img.shields.io/npm/v/switch-case.svg)](https://www.npmjs.com/package/switch-case)
[![Build Status](https://travis-ci.org/viRingbells/switch-case.svg?branch=master)](https://travis-ci.org/viRingbells/switch-case)

## How to use

First set some cases, then switch and dispatch a certain input, like:

```javascript
const Switcher = require('switch-case');
const switcher = new Switcher();

switcher
.case(1, () => {
    //todo with case 1
})
.case(2, () => {
    //todo with case 2
});

switcher.switch(1); // ===> print "1"
switcher.dispatch(2); // ===> print "2"
```

## When to use switch-case

If you know every case you are going to handle, use the native statement `switch(..) { case ... }`. 
In other cases, use this to set case automaticaly:

```javascript
const cases = getTheRandomCases();
cases.forEach(case => switcher.case(case.condition, case.result));

switcher.dispatch(...);
```

## async handlers

You can set async handlers by returning a promise.

```javascript
switcher.case(1, () => new Promise((resolve, reject) => {
    setTimeout(resolve, 1000);
});
```

## mounting/proxing switchers

You can mount a switcher on another.

```javascript
switcher.case(1, anotherSwitcher);
```

## API

### use

#### switcher.case(condition, result, options = {})

Set a case. Then match condition is `condition` and result is `result`. If matched, `switcher.execute(result, ...input)` will be executed. If `result` is a switcher, the input will be deilvered to `result.dispatch()`, just after `input = switcher.proxy(...input)` called for that proxying.
For options, if `options.break` is set true and that case matches, all cases set after that case will be ignored.

#### switcher.switch(...input) / switcher.dispatch(...input)

Start to dispatch that input for every case. If a condition is matched, the corresponding case result will be hanled.

### overwrite

You can overwite the following methods to customize the switcher

#### swticher.prepare(...input) @overwrite

Prepare before each case start to test. The returning result should be an array and will replace input for matching and executing logics. You should overwrite this for your own use.

#### switcher.proxy(...input) @overwrite

Process the input before proxying. The returning result should be an array and will replace the input for the proxy switcher. You should overwrite this for your own use.

#### switcher.match(condition, ...input) @overwrite

Test if a condition matches the input, should return a boolean. You should overwrite this for your own use.

#### switcher.execte(result, ...input) @overwrite

Execute the result. If the executing is async, return a promise. You should overwrite this for your own use.

## extend switcher into a router

see [lark-router](https://github.com/larkjs/lark-router)

## LICENCE
MIT
