import {Optional} from "./optional";
import {store} from "./store";
import {setFilename, addItem, removeItem} from "./actions";

export class TypeDB {

    constructor(private filename?: string) {
        store.subscribe(() => {
            console.log(store.getState());
        });

        if (filename) {
            store.dispatch(setFilename(filename));
        }
    }

    insert<T>(obj: T): T {
        store.dispatch(addItem(obj));
        return obj;
    }

    findFirst<T>(predicate: (item: T) => boolean): Optional<T> {
        let item = store.getState().items.find(predicate);
        return Optional.of(item);
    }

    removeFirst<T>(predicate: (item: T) => boolean): Optional<T> {
        let toBeRemoved = store.getState().items.find(predicate);
        store.dispatch(removeItem(predicate));
        return Optional.of(toBeRemoved);
    }

    findAll<T>(predicate?: (item: T) => boolean): T[] {
        return predicate
            ? store.getState().items.filter(predicate)
            : store.getState().items;
    }
}