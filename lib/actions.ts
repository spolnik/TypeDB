export const ADD_ITEM = "ADD_ITEM";
export function addItem(item: {}) {
    return {
        type: ADD_ITEM,
        item
    };
}

export const REMOVE_ITEM = "REMOVE_ITEM";
export function removeItem<T>(predicate: (item: T) => boolean) {
    return {
        type: REMOVE_ITEM,
        predicate
    };
}

export const UPDATE_ITEM = "UPDATE_ITEM";
export function updateItem<T>(predicate: (item: T) => boolean, item: {}) {
    return {
        type: UPDATE_ITEM,
        predicate,
        item
    };
}

export const FIND_ITEM = "FIND_ITEM";
export function findItem<T>(predicate: (item: T) => boolean) {
    return {
        type: FIND_ITEM,
        predicate
    };
}

export const FIND_ALL = "FIND_ALL";
export function findAll<T>(predicate: (item: T) => boolean) {
    return {
        type: FIND_ALL,
        predicate
    };
}

export const SET_FILENAME = "SET_FILENAME";
export function setFilename(filename: string) {
    return {
        type: SET_FILENAME,
        filename
    };
}
