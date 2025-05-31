import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder, TOrdersData } from '@utils-types';
import { getFeedsApi, getOrdersApi } from '../../utils/burger-api';

interface UserOrdersState {
  userOrders: TOrder[];
  total: number;
  totalToday: number;
  userOrdersLoading: boolean;
  userOrdersError: string | null;
}

const initialState: UserOrdersState = {
  userOrders: [],
  total: 0,
  totalToday: 0,
  userOrdersLoading: false,
  userOrdersError: null
};

export const fetchUserOrders = createAsyncThunk(
  'userOrders/fetchUserOrders',
  async () => {
    const response = await getOrdersApi();
    return response;
  }
);

const userOrdersSlice = createSlice({
  name: 'userOrders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserOrders.pending, (state) => {
        state.userOrdersLoading = true;
        state.userOrdersError = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.userOrders = action.payload;
        state.userOrdersLoading = false;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.userOrdersLoading = false;
        state.userOrdersError =
          action.error.message || 'Failed to fetch user orders';
      });
  }
});

export default userOrdersSlice.reducer;
