import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient } from '@utils-types';

interface ConstructorState {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
  orderRequest: boolean;
  orderModalData: any;
}

const initialState: ConstructorState = {
  bun: null,
  ingredients: [],
  orderRequest: false,
  orderModalData: null
};

const constructorSlice = createSlice({
  name: 'constructor',
  initialState,
  reducers: {
    addBun: (state, action: PayloadAction<TConstructorIngredient>) => ({
      ...state,
      bun: action.payload
    }),
    addIngredient: (state, action: PayloadAction<TConstructorIngredient>) => ({
      ...state,
      ingredients: [...(state.ingredients || []), action.payload]
    }),
    removeBun: (state, action: PayloadAction<TConstructorIngredient>) => ({
      ...state,
      bun: null
    }),
    removeIngredient: (state, action: PayloadAction<string>) => ({
      ...state,
      ingredients: state.ingredients.filter(
        (item) => item.id !== action.payload
      )
    }),
    moveIngredient: (
      state,
      action: PayloadAction<{ dragIndex: number; hoverIndex: number }>
    ) => {
      const ingredients = [...state.ingredients];
      const [draggedItem] = ingredients.splice(action.payload.dragIndex, 1);
      ingredients.splice(action.payload.hoverIndex, 0, draggedItem);
      return {
        ...state,
        ingredients
      };
    },
    clearConstructor: (state) => ({
      ...state,
      bun: null,
      ingredients: []
    }),
    setOrderRequest: (state, action: PayloadAction<boolean>) => ({
      ...state,
      orderRequest: action.payload
    }),
    setOrderModalData: (state, action: PayloadAction<any>) => ({
      ...state,
      orderModalData: action.payload
    })
  }
});

export const {
  addBun,
  addIngredient,
  removeBun,
  removeIngredient,
  moveIngredient,
  clearConstructor,
  setOrderRequest,
  setOrderModalData
} = constructorSlice.actions;

export default constructorSlice.reducer;
