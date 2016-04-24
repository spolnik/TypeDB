export class TypeDB {

    private inMemory: any[] = [];

    insert<T>(obj: T): Promise<T> {
        return new Promise<T>((accept, reject) => {
            this.inMemory.push(obj);
            accept(obj);
        });
    }

    findFirst<T>(predicate: (item: T) => boolean): Promise<Optional<T>> {
        return new Promise<Optional<T>>((accept, reject) => {
            let obj = this.inMemory.find(predicate);
            accept(this.optional(obj));
        });
    }

    removeFirst<T>(predicate: (item: T) => boolean): Promise<Optional<T>> {
        return new Promise<Optional<T>>((accept, reject) => {
            let objIndex = this.inMemory.findIndex(predicate);
            let obj = this.inMemory.splice(objIndex, 1)[0];
            accept(this.optional(obj));
        });
    }

    findAll<T>(predicate?: (item: T) => boolean): Promise<T[]> {
        return new Promise<T[]>((accept, reject) => {
            let items = predicate
                ? this.inMemory.filter(predicate)
                : this.inMemory.slice();

            accept(items);
        });
    }

    private optional<T>(obj: T): Optional<T> {
        return obj ? new Present(obj) : new Absent<T>();
    }
}

export interface Optional<T> {
    isEmpty: boolean;
    value: T;
}

class Present<T> implements Optional<T> {
    isEmpty = false;

    constructor(public value: T) {
    }
}

class Absent<T> implements Optional<T> {
    isEmpty = true;
    value: T = undefined;
}