export class Optional<T> {
    isEmpty: boolean;
    value: T;

    static of<T>(obj: T): Optional<T> {
        return obj ? new Present(obj) : new Absent<T>();
    }
}

class Present<T> extends Optional<T> {
    isEmpty = false;

    constructor(public value: T) {
        super();
    }
}

class Absent<T> extends Optional<T> {
    isEmpty = true;
    value: T = undefined;

    constructor() {
        super();
    }
}