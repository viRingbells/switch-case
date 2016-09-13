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

switcher.dispatch(1); // ===> print "1"
switcher.dispatch(2); // ===> print "2"
```

## When to use switch-case

If you know every case you are going to handle, use the native statement `switch(..) { case ... }`. 
In other cases, use this to set case automaticaly:

```javascript
const cases = getTheRandomCases();
cases.forEach(case => switcher.case(case.condition, case.result));

switcher.dispatch(...).then(() => { ... });
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

## extend

You can extend switcher for complex uses.

```javascript
class Router extend Switcher {
    //@overwrite
    match (condition, req, res) {
        return condition === req.url.split('?')[0];
    }
}

const router = new Router();
router.case('/foo', (req, res) => res.end('foo'));
router.case('/bar', (req, res) => res.end('bar'));

http.createServer(router.dispatch).listen(3000);
```

## DOCS

API (TBD...)

## LICENCE
MIT
