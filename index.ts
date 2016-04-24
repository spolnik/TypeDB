import * as fs from "fs";

export class TypeDB {

    private storage: Storage;

    constructor(private filename?: string) {
        this.storage = filename
            ? new FileStorage(filename)
            : new InMemoryStorage();
    }

    insert<T>(obj: T): Promise<T> {
        return new Promise<T>((accept, reject) => {
            this.storage.push(obj)
                .then(accept)
                .catch(reject);
        });
    }

    findFirst<T>(predicate: (item: T) => boolean): Promise<Optional<T>> {
        return new Promise<Optional<T>>((accept, reject) => {
            this.storage.findFirst(predicate)
                .then((data) => {
                    accept(this.optional(data));
                }).catch(reject);
        });
    }

    removeFirst<T>(predicate: (item: T) => boolean): Promise<Optional<T>> {
        return new Promise<Optional<T>>((accept, reject) => {
            this.storage.removeFirst(predicate)
                .then((data) => {
                    accept(this.optional(data));
                }).catch(reject);
        });
    }

    findAll<T>(predicate?: (item: T) => boolean): Promise<T[]> {
        return new Promise<T[]>((accept, reject) => {
            this.storage.findAll(predicate)
                .then(accept).catch(reject);
        });
    }

    private optional<T>(obj: T): Optional<T> {
        return obj ? new Present(obj) : new Absent<T>();
    }
}

interface Storage {
    push<T>(obj: T): Promise<T>;
    findFirst<T>(predicate: (item: T) => boolean): Promise<T>;
    removeFirst<T>(predicate: (item: T) => boolean): Promise<T>;
    findAll<T>(predicate: (item: T) => boolean): Promise<T[]>;
}

class InMemoryStorage implements Storage {

    constructor(public data?: any[]) {
        if (!data) {
            this.data = [];
        }
    }

    push<T>(obj: T): Promise<T> {
        return new Promise((accept, reject) => {
            this.data.push(obj);
            accept(obj);
        });
    }

    findFirst<T>(predicate: (item: T) => boolean): Promise<T> {
        return new Promise((accept, reject) => {
            accept(this.data.find(predicate));
        });
    }

    removeFirst<T>(predicate: (item: T) => boolean): Promise<T> {
        return new Promise((accept, reject) => {
            try {
                let objIndex = this.data.findIndex(predicate);
                accept(this.data.splice(objIndex, 1)[0]);
            } catch (err) {
                reject(err);
            }
        });
    }

    findAll<T>(predicate: (item: T) => boolean): Promise<T[]> {
        return new Promise((accept, reject) => {
            try {
                accept(predicate
                    ? this.data.filter(predicate)
                    : this.data.slice());
            } catch (err) {
                reject(err);
            }
        });
    }
}

class FileStorage implements Storage {

    private storage: InMemoryStorage;

    constructor(private filename: string) {
        if (!fs.existsSync(filename)) {
            fs.writeFileSync(filename, "[]");
        }

        const data = fs.readFileSync(filename, "utf-8").trim() || "[]";
        this.storage = new InMemoryStorage(JSON.parse(data));
    }

    push<T>(obj: T): Promise<T> {
        return new Promise<T>((accept, reject) => {
            this.storage.push(obj)
                .then((data) => {
                    this.writeFile(this.storage.data)
                        .then(() => {
                            accept(data);
                        }).catch(reject);
                }).catch(reject);
        });
    }

    findFirst<T>(predicate: (item: T) => boolean): Promise<T> {
        return new Promise((accept, reject) => {
            accept(this.storage.findFirst(predicate));
        });
    }

    removeFirst<T>(predicate: (item: T) => boolean): Promise<T> {
        return new Promise((accept, reject) => {
            this.storage.removeFirst(predicate)
                .then((data) => {
                    this.writeFile(this.storage.data)
                        .then(() => {
                            accept(data);
                        }).catch(reject);
                }).catch(reject);
        });
    }

    findAll<T>(predicate: (item: T) => boolean): Promise<T[]> {
        return new Promise((accept, reject) => {
            this.storage.findAll(predicate)
                .then(accept).catch(reject);
        });
    }

    private writeFile(obj: any): Promise<{}> {

        return new Promise((accept, reject) => {
            try {
                let str = `${JSON.stringify(obj)}\n`;
                fs.writeFile(this.filename, str, {}, accept);
            } catch (err) {
                return reject(err);
            }
        });
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