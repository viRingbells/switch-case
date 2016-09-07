/**
 * Tests for simple use of switcher
 **/
'use strict';

const debug   = require('debug')('lark-switcher.test.simple');

const Switcher  = require('..');

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
        const taskList = [];
        for (let num of testList) taskList.push(switcher.dispatch(num));

        Promise.all(taskList).then(() => {
            output.should.have.property('length', testList.length);
            for (let i = 0; i < testList.length; i++) {
                output[i].should.be.exactly(testList[i]);
            }

            done();
        });
    });

    it('should proxy to mounting switchers', done => {
        const main = new Switcher();
        const sub  = new Switcher();

        main.match = (condition, target) => {
            return parseInt(target / 10, 10) === condition;
        };

        sub.match = (condition, target) => {
            return parseInt(target % 10, 10) === condition;
        };

        let output = 0;

        main.case(1, sub);
        sub.case(1, () => { output = 1; });
        sub.case(2, () => { output = 2; });

        main.dispatch(12).then(() => {
            output.should.be.exactly(2);
            done();
        }).catch(e => console.log(e.stack));
    });
});
