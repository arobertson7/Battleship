import LinkedList from './LinkedList.js';

class Pair {
    constructor(key, value) {
        this.key = key;
        this.value = value;
    }
}

class HashMap {
    constructor(loadFactor = 1) {
        this.table = new Array(16);
        for (let i = 0; i < this.table.length; i++) {
            const list = new LinkedList();
            this.table[i] = list;
        }
        this.size = 0;
        this.capacity = 16;
        this.loadFactor = loadFactor;
    }

    hash(key) {
        let hashCode = 0;
            
        const primeNumber = 31;
        for (let i = 0; i < key.length; i++) {
            hashCode = (primeNumber * hashCode + key.charCodeAt(i)) % this.capacity;
        }

        return hashCode;
    }

    rehash() {
        this.capacity = this.capacity * 2;
        this.size = 0; // calling set() on all the keys while filling new table will correct this
        const entries = this.entries();
        this.table = new Array(this.capacity);
        for (let i = 0; i < this.table.length; i++) {
            const list = new LinkedList();
            this.table[i] = list;
        }

        for (let i = 0; i < entries.length; i++) {
            const key = entries[i][0];
            const value = entries[i][1];
            this.set(key, value);
        }
    }

    set(key, value) {
        const hashCode = this.hash(key);
        let listPtr = this.table[hashCode].head;

        while (listPtr) {
            // if key already exists, update it's value
            if (listPtr.val.key == key) {
                listPtr.val.value = value;
                return;
            }
            listPtr = listPtr.next;
        }
        // if key did not already exist, insert pair at head of list
        const pair = new Pair(key, value);
        this.table[hashCode].prepend(pair);
        this.size++;

        // rehash if necessary
        if (this.size / this.capacity > this.loadFactor) {
            this.rehash();
        }
    }

    get(key) {
        const hashCode = this.hash(key);
        let listPtr = this.table[hashCode].head;

        while (listPtr) {
            if (listPtr.val.key == key) {
                return listPtr.val.value;
            }
            listPtr = listPtr.next;
        }
        return null;
    }

    has(key) {
        const hashCode = this.hash(key);
        let listPtr = this.table[hashCode].head;

        while (listPtr) {
            if (listPtr.val.key == key) {
                return true;
            }
            listPtr = listPtr.next;
        }
        return false;
    }

    remove(key) {
        if (!this.has(key)) {
            return false;
        }
        const hashCode = this.hash(key);
        const hashedList = this.table[hashCode];
        let listPtr = hashedList.head;
        while (listPtr && listPtr.val.key != key) {
            listPtr = listPtr.next;
        }

        hashedList.remove(listPtr.val);
        this.size--;
        return true;
    }

    length() {
        return this.size;
    }

    clear() {
        this.table = new Array(16);
        for (let i = 0; i < this.table.length; i++) {
            const list = new LinkedList();
            this.table[i] = list;
        }
        this.size = 0;
        this.capacity = 16;
    }

    keys() {
        let keysArray = [];
        for (let i = 0; i < this.table.length; i++) {
            const list = this.table[i];
            let listPtr = list.head;
            while (listPtr) {
                keysArray.push(listPtr.val.key);
                listPtr = listPtr.next;
            }
        }
        return keysArray;
    }

    values() {
        let valuesArray = [];
        for (let i = 0; i < this.table.length; i++) {
            const list = this.table[i];
            let listPtr = list.head;
            while (listPtr) {
                valuesArray.push(listPtr.val.value);
                listPtr = listPtr.next;
            }
        }
        return valuesArray;
    }

    entries() {
        let entries = [];
        for (let i = 0; i < this.table.length; i++) {
            const list = this.table[i];
            let listPtr = list.head;
            while (listPtr) {
                entries.push([listPtr.val.key, listPtr.val.value]);
                listPtr = listPtr.next;
            }
        }
        return entries;
    }

}

export default HashMap;