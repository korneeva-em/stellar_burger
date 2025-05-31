import {
  getUserApi,
  logoutApi,
  updateUserApi
} from '../../../utils/burger-api';
import {
  fetchUser,
  updateUser,
  logoutUser,
  setAuthenticated
} from '../user-slice';
import reducer from '../user-slice';
import store from '../../store/store';
import { TUser } from '../../../utils/types';
import { jest } from '@jest/globals';
import * as burgerApi from '../../../utils/burger-api';

const mockUser = {
  email: 'ekorn@test.com',
  name: 'Ekaterina'
} as TUser;

describe('UserSlice', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('TestUserSliceInitialState', () => {
    const initialState = reducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(initialState.user).toBeNull();
    expect(initialState.loading).toBe(false);
    expect(initialState.error).toBeNull();
    expect(initialState.isAuthenticated).toBe(false);
  });

  it('TestUserFetchFailure', async () => {
    const errorMessage = 'Failed to fetch user';
    const getUserMockFail = jest
      .spyOn(burgerApi, 'getUserApi')
      .mockImplementation(() => Promise.reject(new Error(errorMessage)));

    await store.dispatch(fetchUser());

    expect(store.getState().user.loading).toBe(false);
    expect(store.getState().user.error).not.toBeNull();
    expect(store.getState().user.user).toBeNull();
    expect(store.getState().user.isAuthenticated).toBe(false);
    expect(getUserMockFail).toHaveBeenCalled();
  });

  it('TestUserFetchPendingState', async () => {
    const getUserMock = jest
      .spyOn(burgerApi, 'getUserApi')
      .mockImplementation(() =>
        Promise.resolve({ user: mockUser, success: true })
      );

    store.dispatch(fetchUser());

    expect(store.getState().user.loading).toBe(true);
    expect(store.getState().user.error).toBe(null);
    expect(getUserMock).toHaveBeenCalled();
  });

  it('TestUserFetchSuccess', async () => {
    const getUserMock = jest
      .spyOn(burgerApi, 'getUserApi')
      .mockImplementation(() =>
        Promise.resolve({ user: mockUser, success: true })
      );

    await store.dispatch(fetchUser());

    expect(store.getState().user.loading).toBe(false);
    expect(store.getState().user.error).toBe(null);
    expect(store.getState().user.user).toEqual(mockUser);
    expect(store.getState().user.isAuthenticated).toBe(true);
    expect(getUserMock).toHaveBeenCalled();
  });

  it('TestUserUpdateSuccess', async () => {
    const updatedUser = { ...mockUser, name: 'Updated Name' };
    const updateUserMock = jest
      .spyOn(burgerApi, 'updateUserApi')
      .mockImplementation(() =>
        Promise.resolve({ user: updatedUser, success: true })
      );

    await store.dispatch(updateUser({ name: 'Updated Name' }));

    expect(store.getState().user.loading).toBe(false);
    expect(store.getState().user.error).toBe(null);
    expect(store.getState().user.user).toEqual(updatedUser);
    expect(updateUserMock).toHaveBeenCalled();
  });

  it('TestUserUpdateFailure', async () => {
    const errorMessage = 'Failed to update user';
    const updateUserMockFail = jest
      .spyOn(burgerApi, 'updateUserApi')
      .mockImplementation(() => Promise.reject(new Error(errorMessage)));

    await store.dispatch(updateUser({ name: 'Updated Name' }));

    expect(store.getState().user.loading).toBe(false);
    expect(store.getState().user.error).not.toBeNull();
    expect(updateUserMockFail).toHaveBeenCalled();
  });

  it('TestUserLogoutSuccess', async () => {
    const getUserMock = jest
      .spyOn(burgerApi, 'getUserApi')
      .mockImplementation(() =>
        Promise.resolve({ user: mockUser, success: true })
      );
    await store.dispatch(fetchUser());

    const logoutMock = jest
      .spyOn(burgerApi, 'logoutApi')
      .mockImplementation(() => Promise.resolve({ success: true }));

    await store.dispatch(logoutUser());

    expect(logoutMock).toHaveBeenCalled();
    expect(store.getState().user.user).toBeNull();
    expect(store.getState().user.isAuthenticated).toBe(false);
    expect(store.getState().user.loading).toBe(false);
    expect(store.getState().user.error).toBeNull();
  });

  it('TestUserLogoutFailure', async () => {
    const errorMessage = 'Failed to logout';
    const logoutMockFail = jest
      .spyOn(burgerApi, 'logoutApi')
      .mockImplementation(() => Promise.reject(new Error(errorMessage)));

    await store.dispatch(logoutUser());

    expect(logoutMockFail).toHaveBeenCalled();
    expect(store.getState().user.loading).toBe(false);
    expect(store.getState().user.error).not.toBeNull();
  });

  it('TestUserLogoutPendingState', async () => {
    const logoutMock = jest
      .spyOn(burgerApi, 'logoutApi')
      .mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );

    store.dispatch(logoutUser());

    expect(store.getState().user.loading).toBe(true);
    expect(store.getState().user.error).toBe(null);
    expect(logoutMock).toHaveBeenCalled();
  });

  it('TestSetAuthenticatedAction', () => {
    store.dispatch(setAuthenticated(true));
    expect(store.getState().user.isAuthenticated).toBe(true);

    store.dispatch(setAuthenticated(false));
    expect(store.getState().user.isAuthenticated).toBe(false);
  });
});
