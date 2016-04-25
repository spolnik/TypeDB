import * as fs from "fs";

export interface Storage {
    push<T>(obj: T): Promise<T>;
    findFirst<T>(predicate: (item: T) => boolean): Promise<T>;
    removeFirst<T>(predicate: (item: T) => boolean): Promise<T>;
    findAll<T>(predicate: (item: T) => boolean): Promise<T[]>;
}

export class StorageFactory {
    static create(filename?: string): Storage {
        return filename
            ? new FileStorage(filename)
            : new InMemoryStorage();
    }
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
        return this.storage.findFirst(predicate);
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
        return this.storage.findAll(predicate);
    }

    private writeFile(obj: any): Promise<{}> {

        return new Promise((accept, reject) => {
            try {
                let str = `${JSON.stringify(obj)}\n`;
                fs.writeFile(this.filename, str, { flag: "w"}, accept);
            } catch (err) {
                return reject(err);
            }
        });
    }
}