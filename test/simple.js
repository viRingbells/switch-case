/**
 * Tests for simple use of switcher
 **/
'use strict';

const debug   = require('debug')('switch-case.test.simple');

const Switcher  = require('..');

debug('loading ...');

describe('lark-switcher instance', () => {
    const switcher = new Switcher();

    it('should be an object with case methods', done => {
        switcher.should.have.property('caseEntry').which.is.exactly(null);
        switcher.should.have.property('caseTail').which.is.exactly(null);
        switcher.should.have.property('case').which.is.an.instanceOf(Function).with.lengthOf(2);
        switcher.should.have.property('switch').which.is.an.instanceOf(Function);
        switcher.should.have.property('dispatch').which.is.an.instanceOf(Function);
        switcher.should.have.property('match').which.is.an.instanceOf(Function);
        switcher.should.have.property('execute').which.is.an.instanceOf(Function);
        done();
    });

    it('should add routing rules', done => {
        const output = [];
        const handler = num => new Promise(resolve => { output.push(num); resolve(); });
        switcher.case(1, handler);
        switcher.case(2, handler);
        switcher.case(3, handler);
        switcher.case(4, handler);
        switcher.case(5, handler);
        switcher.case(6, handler);

        switcher.should.have.property('caseEntry').which.is.an.instanceOf(Switcher.Case);
        switcher.should.have.property('caseTail').which.is.an.instanceOf(Switcher.Case);

        const testList = [4, 3, 2, 6, 5, 4, 3, 2, 1];

        debug('start to handle async processros ...');
        let promise = new Promise(resolve => resolve());
        for (let num of testList) promise = promise.then(() => switcher.dispatch(num));

        promise.then(() => {
            debug('async processors done!');
            output.should.have.property('length', testList.length);
            for (let i = 0; i < testList.length; i++) {
                output[i].should.be.exactly(testList[i]);
            }

            done();
        }).catch(e => console.log(e.stack));
    });

    it('should proxy to nesting switchers', async () => {
        const main = new Switcher();
        const sub  = new Switcher();
        const another = new Switcher();

        main.match = sub.match = (condition, target) => {
            const result = condition.toString() === target.toString()[0];
            return result;
        };

        main.nesting = (target) => {
            return [target % 10];
        }

        let output = 0;
        let anotherOutput = 0;
        let another2Output = 0;

        main.case(1, sub);
        another.case(3, sub);

        sub.case(1, () => { output = 1; });
        sub.case(2, () => { output = 2; });
        sub.case(3, () => { anotherOutput = 3; });
        sub.case(4, () => { anotherOutput = 4; });

        await main.switch(12);
        output.should.be.exactly(2);

        await another.switch(3);
        anotherOutput.should.be.exactly(3);
    });

    it('should reject when error comes', done => {
        const switcher = new Switcher();

        switcher.case(1, () => {
            throw new Error('Faked Error!');
        });

        switcher.dispatch(1).catch(error => {
            error.should.be.an.instanceOf(Error);
            error.should.have.ownProperty('message', 'Faked Error!');
            done();
        });
    });

    it('should do noting if no case set', async () => {
        const switcher = new Switcher();
        await switcher.dispatch(1);
    });
});

debug('loaded!');
