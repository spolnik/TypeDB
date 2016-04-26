import {createStore} from "redux";
import {typeDbReducer} from "./reducers";

const store = createStore(typeDbReducer);
export {store};
