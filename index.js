/**
 * Switcher
 **/
'use strict';

const $       = require('lodash');
const debug   = require('debug')('switch-case');
const assert  = require('assert');

debug('loading ...');

class Switcher {
    constructor () {
        this._cases = [];
    }
    /**
     * Set the case condition and result
     **/
    case (condition, result) {
        debug('setting case ...');
        assert(undefined !== condition, 'Condition should not be undefined!');
        assert(Array.isArray(this._cases), 'Internal Error, [Switcher] switcher._cases should be an Array!');
        this._cases.push({ condition, result });
        return this;
    }
    /**
     * Switch the target, returns the list of results
     **/
    switch (...args) {
        debug('switching ...');
        assert(this.match instanceof Function, 'Switcher\' matching tester should be a Function');
        const results = [];
        for (const _case of this._cases) {
            if (this.match($.cloneDeep(_case.condition), ...args)) {
                debug('condition matched!');
                results.push(_case.result);
            }
        }
        return results;
    }
    dispatch (...args) {
        debug('dispatching ...');
        const results = this.switch(...args);
        let promise = new Promise(resolve => resolve());
        for (let result of results) {
            if (result instanceof Switcher) {
                promise = result.dispatch(...args);
            }
            else {
                promise = promise.then(() => {
                    return this.execute(result, ...args);
                });
            }
        }
        return promise;
    }
    //=================adapters===================//
    match (condition, ...args) {
        const target = args[0];
        return target === condition;
    }
    execute (result, ...args) {
        debug('executing ...');
        assert(result instanceof Function, 'Result to execute should be a Function');
        return result(...args);
    }
}

module.exports = Switcher;
debug('loaded');
