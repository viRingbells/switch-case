/**
 * Tests for simple use of switcher
 **/
'use strict';

const debug   = require('debug')('switch-case.test.simple');

const Switcher  = require('switch-case');

describe('lark-switcher instance', () => {
    const switcher = new Switcher();

    it('should be an object with case methods', done => {
        switcher.should.have.property('switch').which.is.an.instanceOf(Function);
        switcher.should.have.property('dispatch').which.is.an.instanceOf(Function);
        done();
    });

    it('should add routing rules', async () => {
        const output = [];
        const handler = async (num) => {
            await new Promise(resolve => setImmediate(() => {
                output.push(num);
                resolve();
            }));
        };
        switcher.case(1, handler);
        switcher.case(2, handler);
        switcher.case(3, handler);
        switcher.case(4, handler);
        switcher.case(5, handler);
        switcher.case(6, handler);

        const testList = [4, 3, 2, 6, 5, 4, 3, 2, 1];

        debug('start to handle async processros ...');
        for (let num of testList) {
            await switcher.dispatch(num);
        }

        debug('async processors done!');
        output.should.have.property('length', testList.length);
        for (let i = 0; i < testList.length; i++) {
            output[i].should.be.exactly(testList[i]);
        }

    });

    it('should reject when error comes', async () => {
        const switcher = new Switcher();

        switcher.case(1, () => {
            throw new Error('Faked Error!');
        });

        let error = {};
        try {
            await switcher.dispatch(1);
        }
        catch (e) {
            error = e;
        }
        error.should.be.an.instanceOf(Error);
        error.should.have.ownProperty('message', 'Faked Error!');
    });

    it('should do noting if no case set', async () => {
        const switcher = new Switcher();
        await switcher.dispatch(1);
    });

    it('should be ok switching into default', async () => {
        let number = 0;
        const switcher = new Switcher();
        switcher.case(1, () => number = 1);
        switcher.case(2, () => number = 2);
        switcher.case(3, () => number = 3);
        switcher.case(4, () => number = 4);
        switcher.default(() => number = 5);
        await switcher.dispatch(100);
        number.should.be.exactly(5);
    });

    it('should be ok with BREAK', async () => {
        let number = '';
        const switcher = new Switcher();
        switcher.case(1, () => number += 1);
        switcher.case(1, () => number += 2);
        switcher.case(1, () => { number += 3; return Switcher.BREAK; });
        switcher.case(1, () => number += 4);
        switcher.case(1, () => number += 5);
        await switcher.dispatch(1);
        number.should.be.exactly('123');
    });

    it('should be ok with BREAK in async result', async () => {
        let number = '';
        const switcher = new Switcher();
        switcher.case(1, () => number += 1);
        switcher.case(1, () => number += 2);
        switcher.case(1, async () => { number += 3; return Switcher.BREAK; });
        switcher.case(1, () => number += 4);
        switcher.case(1, () => number += 5);
        await await switcher.dispatch(1);
        number.should.be.exactly('123');
    });
});
