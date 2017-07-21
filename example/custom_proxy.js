'use strict';

const Switcher = require('switch-case');

let count = 0;

const range = new Switcher({
    match(age, teen) {
        count++;
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
    }
});

for (let teen = 0; teen <= 100; teen += 10) {
    range.case(teen, async (age) => {
        console.log(`He is ${teen}+ (${age}) years old`);
        await new Promise(resolve => setTimeout(resolve, 500));
    });
}

range.default(age => console.log(`seems invalid age: ${age}`));

async function main() {
    for (let age of [1, 3, 5, 10, 15, 22, 34, 40, 50, 61, 88, 101, 120, -10]) {
        await range.switch(age);
    }
    console.log('count:' + count);
}

main().catch(e => console.log(e.stack));
