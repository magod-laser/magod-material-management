import {
  createStore,
  combineReducers,
  aplyMiddleware,
  applyMiddleware,
} from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
// import { customerListReducer } from "./pages/mat-mangmnt/reducers/customerReducer";
// import { custBomReducer } from "./pages/mat-mangmnt/reducers/custBomReducer";
// import {
// materialReceiptReducer,
// materialReceiptHeaderRegisterReducer,
// materialReceiptHeaderRegisterUpdateReducer,
// } from "./pages/mat-mangmnt/reducers/materialReceiptReducer";

const reducer = combineReducers({
  // customerList: customerListReducer,
  // custoBom: custBomReducer,
  // materialReceipt: materialReceiptReducer,
  // materialReceiptHeaderRegisterInfo: materialReceiptHeaderRegisterReducer,
  // materialReceiptHeaderRegisterUpdateInfo:
  // materialReceiptHeaderRegisterUpdateReducer,
});

const initialState = {};
const middleware = [thunk];

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
