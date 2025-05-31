import { RootState } from '../store/store';

export const selectConstructorState = (state: RootState) => ({
  bun: state.constructor.bun,
  ingredients: state.constructor.ingredients,
  orderRequest: state.constructor.orderRequest,
  orderModalData: state.constructor.orderModalData
});
