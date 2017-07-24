'use strict';

const assert    = require('assert');
const Switcher  = require('switch-case');

const range = new Switcher({
    match(age, teen, context) {
        switch (true) {
            case age > 0:
                context.description = 'baby';
                break;
            case age > 2:
                context.description = 'boy';
                break;
            case age > 16:
                context.description = 'young man';
                break;
            case age > 22:
                context.description = 'man';
                break;
            case age > 60:
                context.description = 'old man';
                break;
        }
        return age >= teen && (teen >= 100 || age <= teen + 9);
    },
    createIndex(teen, index, indexTable) {
        if (teen < 0) return;
        teen = Math.min(10, Math.floor(teen / 10, 10));
        indexTable[teen] = indexTable[teen] || [];
        indexTable[teen].push(index);
    },
    searchIndex(age, indexTable) {
        age = Math.min(10, Math.floor(age / 10, 10));
        return indexTable[age] || [];
    },
    validateCondition(teen) {
        assert(Number.isInteger(teen), 'teen should be a integer');
        assert(teen >= 0 && teen <= 120, 'teen should be in range [0, 120]');
        return true;
    },
    validateResult(result) {
        assert(result instanceof Function, 'result should be a function');
        return true;
    },
    execute(result, targetCondition, context) {
        return result(targetCondition, context.description || 'one');
    },
});

let message = "";

for (let teen = 0; teen <= 100; teen += 10) {
    range.case(teen, (age, description) => {
        message = `The ${description} is ${teen}+ (${age}) years old`;
    });
}

describe('using empty proxy', () => {
    it('should be ok', async () => {
        const switcher = new Switcher({
            validateCondition: null,
            validateResult: null,
            createIndex: null,
            searchIndex: null,
            match: null,
            execute: null,
        });
        switcher.case(1, () => message = 'This is 1');
        switcher.case(2, () => message = 'This is 2');
        switcher.switch(1);
        message.should.be.exactly('This is 1');
        switcher.switch(2);
        message.should.be.exactly('This is 2');
    });
});

describe('using proxy', () => {
    it('should be ok', async () => {
        await range.switch(1);
        message.should.be.exactly('The baby is 0+ (1) years old');
    });
});
