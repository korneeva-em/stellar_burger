import { RootState } from '../store/store';

export const selectIngredients = (state: RootState) => ({
  ingredients: state.ingredients.items,
  loading: state.loading,
  error: state.error
});
