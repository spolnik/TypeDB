export class Optional<T> {

    static EMPTY = new Optional(undefined);

    constructor(public value: T) {}

    isEmpty() {
        return this.value ? false : true;
    };

    static of<T>(obj: T): Optional<T> {
        return obj ? new Optional(obj) : Optional.EMPTY;
    }
}
