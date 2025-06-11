import HashMap from './hashMap.js';

const test = new HashMap(0.75);
test.set('apple', 'red')
test.set('banana', 'yellow')
test.set('carrot', 'orange')
test.set('dog', 'brown')
test.set('elephant', 'gray')
test.set('frog', 'green')
test.set('grape', 'purple')
test.set('hat', 'black')
test.set('ice cream', 'white')
test.set('jacket', 'blue')
test.set('kite', 'pink')
test.set('lion', 'golden')


let entries = test.entries();
for (let i = 0; i < entries.length; i++) {
    console.log(`${i + 1} ${entries[i][0]} -> ${entries[i][1]}`);
}
console.log('num of keys:' + test.length() + ' / table size: ' + test.capacity);
console.log('-');

test.set('elephant', 'blurp')
test.set('frog', 'slurp')
test.set('grape', 'pickle')

entries = test.entries();
for (let i = 0; i < entries.length; i++) {
    console.log(`${i + 1} ${entries[i][0]} -> ${entries[i][1]}`);
}
console.log('num of keys:' + test.length() + ' / table size: ' + test.capacity);
console.log('-');


/////

test.set('moon', 'silver')
entries = test.entries();
for (let i = 0; i < entries.length; i++) {
    console.log(`${i + 1} ${entries[i][0]} -> ${entries[i][1]}`);
}
console.log('num of keys:' + test.length() + ' / table size: ' + test.capacity);
console.log('-');



test.set('hat', 'pico')
test.set('ice cream', 'turquoise')
test.set('jacket', 'monkey')
test.set('kite', 'icebuerg')
entries = test.entries();
for (let i = 0; i < entries.length; i++) {
    console.log(`${i + 1} ${entries[i][0]} -> ${entries[i][1]}`);
}
console.log('num of keys:' + test.length() + ' / table size: ' + test.capacity);

console.log('-');

console.log(test.remove('ice cream'));
console.log(test.remove('bread'));
console.log(test.remove('frog'));
console.log(test.remove('carrot'));
console.log(test.remove('grape'));

entries = test.entries();
for (let i = 0; i < entries.length; i++) {
    console.log(`${i + 1} ${entries[i][0]} -> ${entries[i][1]}`);
}
console.log('num of keys:' + test.length() + ' / table size: ' + test.capacity);
