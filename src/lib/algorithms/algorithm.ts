class Node<T> {
    data: T;
    next: Node<T> | null;

    constructor(data: T) {
        this.data = data;
        this.next = null;
    }
}

export class LinkedList<T> {
    private head: Node<T> | null;

    constructor() {
        this.head = null;
    }

    insert(data: T, index: number): void {
        const newNode = new Node(data);
        if (index === 0) {
            newNode.next = this.head;
            this.head = newNode;
        } else {
            let current = this.head;
            let previous: Node<T> | null = null;
            let i = 0;
            while (i < index) {
                previous = current;
                current = current!.next;
                i++;
            }
            newNode.next = current;
            if (previous) {
                previous.next = newNode;
            } else {
                this.head = newNode;
            }
        }
    }

    delete(data: T): void {
        if (!this.head) {
            return;
        }
        if (this.head.data === data) {
            this.head = this.head.next;
        } else {
            let current = this.head;
            let previous: Node<T> | null = null;
            while (current) {
                if (current.data === data) {
                    if (previous) {
                        previous.next = current.next;
                    }
                    break;
                }
                previous = current;
                current = current.next as Node<T>;
            }
        }
    }

    prepend(data: T): void {
        const newNode = new Node(data);
        newNode.next = this.head;
        this.head = newNode;
    }

    get(index: number): T | null {
        if (!this.head) {
            return null;
        }
        let current = this.head;
        let i = 0;
        while (i < index) {
            current = current.next as Node<T>;
            i++;
        }
        return current ? current.data : null;
    }

    search(data: T): T | null {
        if (!this.head) {
            return null;
        }
        let current = this.head;
        while (current) {
            if (current.data === data) {
                return current.data;
            }
            current = current.next as Node<T>;
        }
        return null;
    }

    append(data: T): void {
        const newNode = new Node(data);
        if (!this.head) {
            this.head = newNode;
        } else {
            let current = this.head;
            while (current.next) {
                current = current.next;
            }
            current.next = newNode;
        }
    }

    isEmpty(): boolean {
        return this.head === null;
    }

    size(): number {
        let current = this.head;
        let count = 0;

        while (current) {
            count++;
            current = current.next;
        }

        return count;
    }
}

export class Stack<T> {
    private items: T[];

    constructor() {
        this.items = [];
    }

    push(data: T): void {
        this.items.push(data);
    }

    pop(): T | undefined {
        if (!this.isEmpty()) {
            return this.items.pop();
        }
    }

    isEmpty(): boolean {
        return this.items.length === 0;
    }

    peek(): T | undefined {
        if (!this.isEmpty()) {
            return this.items[this.items.length - 1];
        }
    }

    size(): number {
        return this.items.length;
    }
}

export class Queue<T> {
    private items: T[];

    constructor() {
        this.items = [];
    }

    enqueue(data: T): void {
        this.items.push(data);
    }

    dequeue(): T | undefined {
        if (!this.isEmpty()) {
            return this.items.shift();
        }
    }

    isEmpty(): boolean {
        return this.items.length === 0;
    }

    size(): number {
        return this.items.length;
    }
}
