# switch-case
A switcher for complex and dynamic cases.

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![NPM downloads][downloads-image]][npm-url]
[![Node.js dependencies][david-image]][david-url]

## Install

```
$ npm install --save switch-case
```

## Get started

Use it just like `switch case`

```
const Switcher = require('switch-case');
const switcher = new Switcher();

switcher
    .case(1, () => {
        console.log(1);
    })
    .case(2, () => {
        console.log(2);
    });


switcher.switch(1);   // ===> prints 1 on the screen
```

## Why

For most cases the native syntax `switch case` is adequate, if you know every case well.
But if your cases are not so clear or just dynamic during your program running time, you may need this.

For me, I use this module for a router module, which I would never want to write with native `siwtch case` syntax.

## async handlers

This module supports async handlers in cases.

```
const result = await switcher.case(1, async () => {
    await sleep(100);
    return 100;
});
```


## Custom proxy

You can change the behavior by providing a proxy:

```
const switcher = new Switcher(proxy);
```

While these properties as expected in the proxy:

### proxy.match(targetCondition, condition)

Checks if the target condition passed by switcher.switch matched the case condition. If true returned, the result will be executed.

### proxy.execute(result, targetCondition) 

Executes the result with the target condition as a param. Support both async or sync functions.

### proxy.validateCondition(condition)

Check if the condition is valid. If not, an error will be thrown.

### proxy.validateResult(result)

Check if the result is valid. If not, an error will be thrown.

### proxy.createIndex(condition, index, indexTable)

Create an index on the condition, and store it on the index table.

### proxy.searchIndex(condition, indexTable)

Search an index from the index table. Should return the index number list. If false returned, means index not found, the switcher will scan all cases to match.

## extend switcher into a router

see [lark-router](https://github.com/larkjs/lark-router)

## LICENCE
MIT


[npm-image]: https://img.shields.io/npm/v/switch-case.svg?style=flat-square
[npm-url]: https://npmjs.org/package/switch-case
[travis-image]: https://img.shields.io/travis/viRingbells/switch-case/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/viRingbells/switch-case
[downloads-image]: https://img.shields.io/npm/dm/switch-case.svg?style=flat-square
[david-image]: https://img.shields.io/david/viRingbells/switch-case.svg?style=flat-square
[david-url]: https://david-dm.org/viRingbells/switch-case
[coveralls-image]: https://img.shields.io/codecov/c/github/viRingbells/switch-case.svg?style=flat-square
[coveralls-url]: https://codecov.io/github/viRingbells/switch-case
