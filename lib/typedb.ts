import {Optional} from "./optional";
import {StorageFactory, Storage} from "./storage";

export class TypeDB {

    private storage: Storage;

    constructor(private filename?: string) {
        this.storage = StorageFactory.create(filename);
    }

    insert<T>(obj: T): Promise<T> {
        return this.storage.push(obj);
    }

    findFirst<T>(predicate: (item: T) => boolean): Promise<Optional<T>> {
        return new Promise<Optional<T>>((accept, reject) => {
            this.storage.findFirst(predicate)
                .then((data) => {
                    accept(Optional.of(data));
                }).catch(reject);
        });
    }

    removeFirst<T>(predicate: (item: T) => boolean): Promise<Optional<T>> {
        return new Promise<Optional<T>>((accept, reject) => {
            this.storage.removeFirst(predicate)
                .then((data) => {
                    accept(Optional.of(data));
                }).catch(reject);
        });
    }

    findAll<T>(predicate?: (item: T) => boolean): Promise<T[]> {
        return this.storage.findAll(predicate);
    }
}