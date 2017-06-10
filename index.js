/**
 * A Switcher
 **/
'use strict';

const extend  = require('extend');

class Switcher {
    constructor(options = {}) {
        this.caseEntry = null;
        this.caseTail = null;
    }
    case(condition, action, options = {}) {
        let defaultOptions = {
            break: true,
        };
        options = extend(true, defaultOptions, options);
        if (action instanceof Switcher) options.break = false;
        let switchCase = new SwitchCase({ condition, action, options, switcher: this });
        this.caseEntry = this.caseEntry || switchCase;
        if (this.caseTail instanceof SwitchCase) {
            this.caseTail.nextCase = switchCase;
        }
        this.caseTail = switchCase;
        return this;
    }
    switch(...args) {
        return this.dispatch(...args);
    }
    dispatch(...args) {
        if (!(this.caseEntry instanceof SwitchCase)) {
            return Promise.resolve();
        }
        return this.caseEntry.dispatch(...args);
    }
    //=================adapters===================//
    match(condition, ...args) {
        return condition === args[0];
    }
    execute(action, ...args) {
        return action(...args);
    }
    nesting(...args) {
        return;
    }
}

class SwitchCase {
    constructor(caseItem) {
        this.condition = caseItem.condition;
        this.action = caseItem.action;
        this.options = caseItem.options;
        this.switcher = caseItem.switcher;
    }
    next(...args) {
        if (!(this.nextCase instanceof SwitchCase)) {
            return Promise.resolve();
        }
        return this.nextCase.dispatch(...args);
    }
    dispatch(...args) {
        if (!this.switcher.match(this.condition, ...args)) {
            return this.next(...args);
        }
        let result;
        if (this.action instanceof Switcher) {
            let nestingArgs = this.switcher.nesting(...args);
            nestingArgs = Array.isArray(nestingArgs) ? nestingArgs : args;
            result = this.action.dispatch(...nestingArgs);
        }
        else {
            try {
                result = this.switcher.execute(this.action, ...args);
            }
            catch (error) {
                return Promise.reject(error);
            }
        }
        if (result instanceof Promise) {
            return result.then((result) => {
                return this.result(result, ...args);
            });
        }
        return this.result(result, ...args);
    }
    result(result, ...args) {
        if (this.options.break) {
            return;
        }
        return this.next(...args);
    }
}

Switcher.Case = SwitchCase;

module.exports = Switcher;
