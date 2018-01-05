/**
 * Case switcher
 **/
'use strict';

const assert  = require('assert');
const debug   = require('debug')('switch-case.Switcher');
const extend  = require('extend');

const BREAK = 'BREAK';

class Switcher {
    static get BREAK() { return BREAK; }
    constructor(proxy) {
        debug('construct');
        const defaultProxy = extend(true, {}, DEFAULT_PROXY);
        this.proxy = extend(true, defaultProxy, proxy);
        this._caseList = [];
        this._defaultCaseList = [];
        this._indexTable = {};
    }
    async dispatch(targetCondition) {
        return await this.switch(targetCondition);
    }
    async switch(targetCondition) {
        debug('switch');
        let caseList = this._searchIndexCaseList(targetCondition)
            .map(({ condition, result }) => { return { condition, result, context: {}}; })
            .filter(({ condition, context }) => this._match(targetCondition, condition, context))
            .map(({ result, context }) => { return { result, context }; });
        caseList = caseList.length === 0 ?
            this._defaultCaseList.map(result => { return { result, context: {}}; }) : caseList;
        return await this._execute(targetCondition, caseList);
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
        if (this.proxy.validateCondition instanceof Function &&
            !this.proxy.validateCondition(condition)) {
            throw new Error('Invalid case condition');
        }
    }
    _validateResult(result) {
        debug('validate result');
        if (this.proxy.validateResult instanceof Function &&
            !this.proxy.validateResult(result)) {
            throw new Error('Invalid case condition');
        }
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
        let indexList = this.proxy.searchIndex(targetCondition, this._indexTable);
        if (Array.isArray(indexList)) {
            indexList.forEach(index => caseList.add(this._caseList[index]));
            return [...caseList.values()];
        }
        return this._caseList;
    }
    _match(targetCondition, condition, context) {
        debug('testing match');
        let matched = false;
        if (!(this.proxy.match instanceof Function)) {
            matched = targetCondition === condition;
        }
        else {
            matched = this.proxy.match(targetCondition, condition, context);
        }
        debug(matched ? 'matched' : 'not matched');
        return matched;
    }
    async _execute(targetCondition, caseList, index = 0) {
        if (index >= caseList.length) {
            return;
        }
        debug('executing');
        let result = null;
        let caseResult = caseList[index].result;
        let caseContext = caseList[index].context;
        if (!(this.proxy.execute instanceof Function)) {
            assert(caseResult instanceof Function, 'Case action should be a function');
            result = await caseResult(targetCondition);
        }
        else {
            result = await this.proxy.execute(caseResult, targetCondition, caseContext);
        }
        if (result === Switcher.BREAK) {
            return;
        }
        return (await this._execute(targetCondition, caseList, index + 1)) || result;
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
