
export class TypeDB {

    private inMemory: any[] = [];

    insert<T>(obj: T): Promise<T> {
        return new Promise<T>((accept, reject) => {
            this.inMemory.push(obj);
            accept(obj);
        });
    }
    
    find<T>(predicate: (data: T) => boolean): Promise<Optional<T>> {
        return new Promise<Optional<T>>((accept, reject) => {
            let obj = this.inMemory.find(predicate);
            accept(obj ? new Present(obj) : new Absent());
        });
    }
}

export interface Optional<T> {
    isNull: boolean;
    value: T;
}

export class Present<T> implements Optional<T> {
    isNull = false;
    constructor(public value: T) {}
}

export class Absent<T> implements Optional<T> {
    isNull = true;
    value: T = undefined;
}