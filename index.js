/**
 * Case switcher
 **/
'use strict';

const assert  = require('assert');
const debug   = require('debug')('switch-case.Switcher');

const BREAK = 'BREAK';

let matched = false;
let caseList = null;
let caseResult = null;
let result = null;

class Switcher {
    static get BREAK() { return BREAK; }
    constructor(proxy) {
        debug('construct');
        this.proxy = proxy || DEFAULT_PROXY;
        this._caseList = [];
        this._defaultCaseList = [];
        this._indexTable = {};
    }
    dispatch(targetCondition) {
        return this.switch(targetCondition);
    }
    switch(targetCondition) {
        debug('switch');
        caseList = this._searchIndexCaseList(targetCondition)
            .filter(({ condition }) => this._match(targetCondition, condition))
            .map(({ result }) => result);
        caseList = caseList.length === 0 ? this._defaultCaseList : caseList;
        return this._execute(targetCondition, caseList);
    }
    case(...conditions) {
        const result = conditions.pop();
        debug('set case');
        assert(conditions.length > 0, 'No condition for Switcher.case');
        let condition = null;
        for (condition of conditions) {
            this._addCase(condition, result);
        }
    }
    default(result) {
        debug('set default case');
        this._validateResult(result);
        this._defaultCaseList.push(result);
    }
    _addCase(condition, result) {
        debug('add case');
        this._validateCondition(condition);
        this._validateResult(result);
        this._caseList.push({ condition, result });
        this._createIndex(condition, this._caseList.length - 1);
    }
    _validateCondition(condition) {
        debug('validate condition');
        assert(!(this.proxy.validateCondition instanceof Function) || 
            this.proxy.validateCondition(condition), 'Invalid case condition');
    }
    _validateResult(result) {
        debug('validate result');
        assert(!(this.proxy.validateResult instanceof Function) || 
            this.proxy.validateResult(result), 'Invalid case condition');
    }
    _createIndex(condition, index) {
        debug('create index');
        if (!(this.proxy.createIndex instanceof Function)) {
            return;
        }
        this.proxy.createIndex(condition, index, this._indexTable);
    }
    _searchIndexCaseList(targetCondition) {
        debug('search index');
        if (!(this.proxy.searchIndex instanceof Function)) {
            return this._caseList;
        }
        const caseList = new Set();
        (this.proxy.searchIndex(targetCondition, this._indexTable) || [])
            .forEach(index => caseList.add(this._caseList[index]));
        return [...caseList.values()];
    }
    _match(targetCondition, condition) {
        debug('testing match');
        if (!(this.proxy.match instanceof Function)) {
            matched = targetCondition === condition;
        }
        else {
            matched = this.proxy.match(targetCondition, condition);
        }
        debug(matched ? 'matched' : 'not matched');
        return matched;
    }
    _execute(targetCondition, caseList, index = 0) {
        if (index >= caseList.length) {
            return;
        }
        debug('executing');
        caseResult = caseList[index];
        if (!(this.proxy.execute instanceof Function)) {
            assert(caseResult instanceof Function, 'Case action should be a function');
            result = caseResult(targetCondition);
        }
        else {
            result = this.proxy.execute(caseResult, targetCondition);
        }
        if (result instanceof Promise) {
            return result.then(result => {
                if (result === Switcher.BREAK) {
                    return;
                }
                return this._execute(targetCondition, caseList, index + 1);
            });
        }
        if (result === Switcher.BREAK) {
            return;
        }
        return this._execute(targetCondition, caseList, index + 1);
    }
}

const DEFAULT_PROXY = {
    match(targetCondition, condition) {
        return targetCondition === condition;
    },
    createIndex(condition, index, indexTable) {
        indexTable[condition] = indexTable[condition] || [];
        indexTable[condition].push(index);
    },
    searchIndex(condition, indexTable) {
        return indexTable[condition];
    }
};

module.exports = Switcher;
