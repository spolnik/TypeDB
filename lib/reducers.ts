import {combineReducers} from "redux";
import {SET_FILENAME, ADD_ITEM, REMOVE_ITEM, UPDATE_ITEM} from "./actions";

interface TypeDBAction {
    type: string;
    item?: {};
    predicate?: (item: any) => boolean;
    filename?: string;
}

interface TypeDBState {
    filename: string;
    items: any[];
}

function items(state = [], action: TypeDBAction): any[] {
    switch (action.type) {
        case ADD_ITEM:
            return [
                ...state,
                action.item
            ];
        case REMOVE_ITEM:
            let index = state.findIndex(action.predicate);
            if (index === -1) {
                return state;
            }

            return [
                ...state.slice(0, index),
                ...state.slice(index + 1)
            ];
        case UPDATE_ITEM:
            return state.map((item) => {
                if (action.predicate(item)) {
                    return action.item;
                }
                return item;
            });
        default:
            return state;
    }
}

function filename(state = "", action: TypeDBAction): string {
    switch (action.type) {
        case SET_FILENAME:
            return action.filename;
        default:
            return state;
    }
}

const typeDbReducer = combineReducers({
    filename,
    items
});

export {typeDbReducer};