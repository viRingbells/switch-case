/**
 * Switcher
 **/
'use strict';

const $       = require('lodash');
const debug   = require('debug')('switch-case');
const assert  = require('assert');
const extend  = require('extend');

debug('loading ...');

class Switcher {
    constructor () {
        this._cases = [];
    }
    /**
     * Set the case condition and result
     **/
    case (condition, result, options = {}) {
        debug('setting case ...');
        assert(undefined !== condition, 'Condition should not be undefined!');
        assert(Array.isArray(this._cases), 'Internal Error, [Switcher] switcher._cases should be an Array!');
        options = extend(true, defaultOptions, options);
        if (result instanceof Switcher) options.break = false;
        this._cases.push({ condition, result, options });
        return this;
    }
    /**
     * Switch the cases
     **/
    switch (...args) {
        debug('switching ...');
        return this.dispatch(...args);
    }
    /**
     * Dispatch the args to all cases
     **/
    dispatch (...args) {
        debug('dispatching ...');
        let promise = new Promise((resolve, reject) => resolve());
        const o = {};
        for (const caseItem of this._cases) {
            if (this.sync === true) {
                this._process(o, caseItem, ...args);
            }
            else {
                promise = promise.then(() => this._process(o, caseItem, ...args));
            }
        }
        return promise;
    }
    /**
     * Process for each case
     **/
    _process (o, caseItem, ...args) {
        debug('internal processing ...');
        args = this.prepare(...args);
        return !this._match(o, caseItem, ...args) || this._execute(o, caseItem, ...args);
    }
    /**
     * Test if the case matches
     **/
    _match (o, caseItem, ...args) {
        if (o.break) return false;
        debug('internal matching ...');
        assert(this.match instanceof Function, 'Switcher\' matching tester should be a Function');
        if (!this.match($.cloneDeep(caseItem.condition), ...args)) {
            debug('NOT MATCH!');
            return false;
        }
        debug('MATCH!');
        if (caseItem.options.break) {
            debug('BREAK!');
            o.break = true;
        }
        return true;
    }
    /**
     * Execute the handlers
     **/
    _execute (o, caseItem, ...args) {
        debug('internal executing ...');
        const result = caseItem.result;
        if (result instanceof Switcher) {
            debug('result is another switcher, will proxy the condition to it ...');
            args = this.proxy(...args);
            if (!Array.isArray(args)) args = [args];
            return result.dispatch(...args);
        }
        assert(this.execute instanceof Function, 'Switcher\' executing handler should be a Function');
        return this.execute(result, ...args);
    }
    //=================adapters===================//
    prepare (...args) {
        debug('preparing ...');
        return args;
    }
    match (condition, ...args) {
        debug('matching ...');
        const target = args[0];
        return target === condition;
    }
    proxy (...args) {
        debug('proxying ...');
        return args;
    }
    execute (result, ...args) {
        debug('executing ...');
        assert(result instanceof Function, 'Result to execute should be a Function');
        return result(...args);
    }
}

const defaultOptions = {
    break: true,
};

module.exports = Switcher;
debug('loaded');
