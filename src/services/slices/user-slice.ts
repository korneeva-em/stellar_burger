import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { UserState } from '../../utils/types';
import {
  getUserApi,
  updateUserApi,
  logoutApi,
  TRegisterData
} from '../../utils/burger-api';
import { deleteCookie } from '../../utils/cookie';
import { useNavigate } from 'react-router-dom';

const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false
};

export const fetchUser = createAsyncThunk('user/fetchUser', async () => {
  const response = await getUserApi();
  return response.user;
});

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (userData: Partial<TRegisterData>) => {
    const response = await updateUserApi(userData);
    return response.user;
  }
);

export const logoutUser = createAsyncThunk('user/logoutUser', async () => {
  const response = await logoutApi();
  if (response.success) {
    deleteCookie('refreshToken');
    deleteCookie('accessToken');
  }
  return response.success;
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.isAuthenticated = true;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch user';
        state.isAuthenticated = false;
      })
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update user';
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to logout';
      })
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      });
  }
});

export const { setAuthenticated } = userSlice.actions;
export default userSlice.reducer;
