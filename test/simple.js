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
        switcher.should.have.property('_cases').which.is.an.instanceOf(Array);
        switcher.should.have.property('case').which.is.an.instanceOf(Function).with.lengthOf(2);
        switcher.should.have.property('switch').which.is.an.instanceOf(Function);
        switcher.should.have.property('dispatch').which.is.an.instanceOf(Function);
        switcher.should.have.property('match').which.is.an.instanceOf(Function);
        switcher.should.have.property('execute').which.is.an.instanceOf(Function);
        done();
    });

    it('should add routing rules', done => {
        const output = [];
        const handler = num => { output.push(num); };
        switcher.case(1, handler);
        switcher.case(2, handler);
        switcher.case(3, handler);
        switcher.case(4, handler);
        switcher.case(5, handler);
        switcher.case(6, handler);

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

    it('should proxy to mounting switchers', done => {
        const main = new Switcher();
        const sub  = new Switcher();
        const another = new Switcher();

        main.match = sub.match = (condition, target) => {
            const result = condition.toString() === target.toString()[0];
            return result;
        };

        main.proxy = (target) => {
            return target % 10;
        }

        let output = 0;
        let anotherOutput = 0;

        main.case(1, sub);
        another.case(3, sub);

        sub.case(1, () => { output = 1; });
        sub.case(2, () => { output = 2; });
        sub.case(3, () => { anotherOutput = 3; });
        sub.case(4, () => { anotherOutput = 4; });

        main.switch(12).then(() => {
            output.should.be.exactly(2);
        }).then(() => {
            another.switch(3).then(() => {
                anotherOutput.should.be.exactly(3);
                done();
            }).catch(e => console.log(e.stack));
        });
    });
});

debug('loaded!');
