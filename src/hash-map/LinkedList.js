class Node {
    constructor(value = null) {
        this.val = value;
        this.next = null;
    }
}

class LinkedList {
    constructor() {
        this.head = null;
    }

    append(value) {
        const newNode = new Node(value);
        if (!this.head) {
            this.head = newNode;
        }
        else {
            let ptr = this.head;
            while (ptr.next) {
                ptr = ptr.next;
            }
            ptr.next = newNode;
        }
    }

    prepend(value) {
        const newNode = new Node(value);
        if (!this.head) {
            this.head = newNode;
        }
        else {
            newNode.next = this.head;
            this.head = newNode;
        }
    }

    size() {
        let ptr = this.head;
        let nodeCount = 0;
        while (ptr) {
            nodeCount++;
            ptr = ptr.next;
        }
        return nodeCount;
    }

    gethead() {
        return this.head;
    }

    tail() {
        let ptr = this.head;
        if (!ptr) {
            return null;
        }
        while (ptr.next) {
            ptr = ptr.next;
        }
        return ptr;
    }

    // 0-indexed list
    at(index) {
        if (index < 0 || index >= this.size()) {
            return -1;
        }
        let ptr = this.head;
        let curIndex = 0;
        while (curIndex != index) {
            ptr = ptr.next;
            curIndex++;
        }
        return ptr;
    }

    pop() {
        if (!this.head) {
            return -1;
        }
        else if (!this.head.next) {
            this.head = null;
        }
        else {
            let ptr = this.head;
            while (ptr.next.next) {
                ptr = ptr.next;
            }
            ptr.next = null;
        }
    }

    contains(value) {
        let ptr = this.head;
        while (ptr) {
            if (ptr.val == value) {
                return true;
            }
            ptr = ptr.next;
        }
        return false;
    }

    // 0-indexed list
    find(value) {
        let curIndex = 0;
        let ptr = this.head;
        while (ptr) {
            if (ptr.val == value) {
                return curIndex;
            }
            ptr = ptr.next;
            curIndex++;
        }
        return null;
    }

    remove(value) {
        if (!this.contains(value)) {
            return false;
        }
        // case: head node is the node to be removed
        if (this.head.val == value) {
            this.head = this.head.next;
        }
        else { // case: not the head node
            let ptr = this.head;
            while (ptr.next.val != value) {
                ptr = ptr.next;
            }
            ptr.next = ptr.next.next;
        }
        return true;
    }

    toString() {
        let listString = "";
        let ptr = this.head;
        while (ptr) {
            listString += `( ${ptr.val} ) -> `;
            ptr = ptr.next;
        }
        listString += 'null';
        return listString;
    }
}

export default LinkedList;