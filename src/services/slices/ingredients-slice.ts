import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getIngredientsApi } from '../../utils/burger-api';
import { TIngredient } from '../../utils/types';
import { RootState } from '../store/store';

type TIngredientsState = {
  items: TIngredient[];
  loading: boolean;
  error: string | null;
  selectedIngredient: TIngredient | null;
};

const initialState: TIngredientsState = {
  items: [],
  loading: false,
  error: null,
  selectedIngredient: null
};

export const fetchIngredients = createAsyncThunk<
  TIngredient[],
  void,
  { rejectValue: string }
>('ingredients/fetchIngredients', async (_, { rejectWithValue }) => {
  try {
    const response = await getIngredientsApi();
    return response;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : 'Failed to fetch ingredients'
    );
  }
});

export const getSelectedIngredient = createAsyncThunk<
  TIngredient,
  string,
  { state: RootState; rejectValue: string }
>(
  'ingredients/getSelectedIngredient',
  async (id, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const ingredient = state.ingredients.items.find(
        (item: TIngredient) => item._id === id
      );
      if (!ingredient) {
        throw new Error('Ingredient not found');
      }

      return ingredient;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to get ingredient'
      );
    }
  }
);

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {
    setSelectedIngredient: (state, action) => {
      state.selectedIngredient = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch ingredients';
      })
      .addCase(getSelectedIngredient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSelectedIngredient.fulfilled, (state, action) => {
        state.selectedIngredient = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getSelectedIngredient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to get ingredient';
      });
  }
});

export const { setSelectedIngredient } = ingredientsSlice.actions;
export default ingredientsSlice.reducer;
