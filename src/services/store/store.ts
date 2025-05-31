import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { Action } from 'redux';
import ingredientsReducer from '../slices/ingredients-slice';
import constructorReducer from '../slices/constructor-slice';
import userReducer from '../slices/user-slice';
import allOrdersReducer from '../slices/all-orders-slice';
import userOrdersReducer from '../slices/user-orders-slice';
import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

export interface RootState {
  ingredients: ReturnType<typeof ingredientsReducer>;
  constructor: ReturnType<typeof constructorReducer>;
  user: ReturnType<typeof userReducer>;
  allOrders: ReturnType<typeof allOrdersReducer>;
  userOrders: ReturnType<typeof userOrdersReducer>;
  loading: boolean;
  error: string | null;
}

const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  constructor: constructorReducer,
  user: userReducer,
  allOrders: allOrdersReducer,
  userOrders: userOrdersReducer,
  loading: (state = false, _action: Action) => state,
  error: (state = null, _action: Action) => state
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});

export type TAppDispatch = typeof store.dispatch;

export const useDispatch = dispatchHook.withTypes<TAppDispatch>();
export const useSelector = selectorHook.withTypes<RootState>();

export default store;
