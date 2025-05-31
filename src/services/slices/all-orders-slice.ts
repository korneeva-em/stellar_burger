import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder, TOrdersData } from '@utils-types';
import { getFeedsApi, getOrdersApi } from '../../utils/burger-api';

interface AllOrdersState {
  allOrders: TOrder[];
  total: number;
  totalToday: number;
  allOrdersLoading: boolean;
  allOrdersError: string | null;
}

const initialState: AllOrdersState = {
  allOrders: [],
  total: 0,
  totalToday: 0,
  allOrdersLoading: false,
  allOrdersError: null
};

export const fetchAllOrders = createAsyncThunk(
  'allOrders/fetchAllOrders',
  async () => {
    const response = await getFeedsApi();
    return response;
  }
);

const allOrdersSlice = createSlice({
  name: 'allOrders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllOrders.pending, (state) => {
        state.allOrdersLoading = true;
        state.allOrdersError = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.allOrdersLoading = false;
        state.allOrders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.allOrdersLoading = false;
        state.allOrdersError = action.error.message || 'Failed to fetch orders';
      });
  }
});

export default allOrdersSlice.reducer;
