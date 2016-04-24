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
            try {
                this.storage.push(obj);
                accept(obj);
            } catch (err) {
                reject(err);
            }
        });
    }

    findFirst<T>(predicate: (item: T) => boolean): Promise<Optional<T>> {
        return new Promise<Optional<T>>((accept, reject) => {
            try {
                let obj = this.storage.findFirst(predicate);
                accept(this.optional(obj));
            } catch (err) {
                reject(err);
            }
        });
    }

    removeFirst<T>(predicate: (item: T) => boolean): Promise<Optional<T>> {
        return new Promise<Optional<T>>((accept, reject) => {
            try {
                let obj = this.storage.removeFirst(predicate);
                accept(this.optional(obj));
            } catch (err) {
                reject(err);
            }
        });
    }

    findAll<T>(predicate?: (item: T) => boolean): Promise<T[]> {
        return new Promise<T[]>((accept, reject) => {
            try {
                let items = this.storage.findAll(predicate);
                accept(items);
            } catch (err) {
                reject(err);
            }
        });
    }

    private optional<T>(obj: T): Optional<T> {
        return obj ? new Present(obj) : new Absent<T>();
    }
}

interface Storage {
    push(obj: any): void;
    findFirst(predicate: (item: any) => boolean): any;
    removeFirst(predicate: (item: any) => boolean): any;
    findAll(predicate: (item: any) => boolean): any[];
}

class InMemoryStorage implements Storage {

    constructor(public data?: any[]) {
        if (!data) {
            this.data = [];
        }
    }

    push(obj: any): void {
        this.data.push(obj);
    }

    findFirst(predicate: (item: any) => boolean): any {
        return this.data.find(predicate);
    }

    removeFirst(predicate: (item: any) => boolean): any {
        let objIndex = this.data.findIndex(predicate);
        return this.data.splice(objIndex, 1)[0];
    }

    findAll(predicate: (item: any) => boolean): any[] {
        return predicate
            ? this.data.filter(predicate)
            : this.data.slice();
    }
}

class FileStorage implements Storage {

    private storage: InMemoryStorage;

    constructor(private filename: string) {
        if (!fs.existsSync(filename)) {
            fs.writeFileSync(filename, []);
        }

        const data = fs.readFileSync(filename, "utf-8").trim() || "[]";
        this.storage = new InMemoryStorage(JSON.parse(data));
    }

    push(obj: any): void {
        this.storage.push(obj);
        this.writeFile(this.storage.data, console.log);
    }

    findFirst(predicate: (item: any) => boolean): any {
        return this.storage.findFirst(predicate);
    }

    removeFirst(predicate: (item: any) => boolean): any {
        let obj = this.storage.removeFirst(predicate);
        this.writeFile(this.storage.data, console.log);
        return obj;
    }

    findAll(predicate: (item: any) => boolean): any[] {
        return this.storage.findAll(predicate);
    }

    private readFile(): Promise<any[]> {

        return new Promise((accept, reject) => {
            fs.readFile(this.filename, {}, function (err, data) {
                if (err) {
                    return reject(err);
                }

                try {
                    let obj = JSON.parse(<any>data);
                    accept(obj);
                } catch (err2) {
                    err2.message = `${this.filename}: ${err2.message}`;
                    return reject(err2);
                }
            });
        });
    }

    private writeFile(obj: any, callback: (err: NodeJS.ErrnoException) => void): Promise<{}> {

        return new Promise((accept, reject) => {
            try {
                let str = `${JSON.stringify(obj)}\n`;
                fs.writeFile(this.filename, str, {}, reject);
            } catch (err) {
                if (callback) {
                    return reject(err);
                }
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