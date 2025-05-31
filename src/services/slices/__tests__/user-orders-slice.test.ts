import { getOrdersApi } from '../../../utils/burger-api';
import { fetchUserOrders } from '../user-orders-slice';
import reducer from '../user-orders-slice';
import store from '../../store/store';
import { TOrder } from '../../../utils/types';
import { jest } from '@jest/globals';
import * as burgerApi from '../../../utils/burger-api';

const mockOrders = [
  {
    _id: '123',
    number: 1234,
    name: 'Test Order',
    status: 'done',
    ingredients: ['ingredient1', 'ingredient2'],
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  }
] as TOrder[];

describe('UserOrdersSlice', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('TestUserOrdersSliceInitialState', () => {
    const initialState = reducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(initialState.userOrders).toEqual([]);
    expect(initialState.total).toBe(0);
    expect(initialState.totalToday).toBe(0);
  });
  
  it('TestUserOrdersFetchFailure', async () => {
    const errorMessage = 'Failed to fetch user orders';
    const getOrdersMockFail = jest
      .spyOn(burgerApi, 'getOrdersApi')
      .mockImplementation(() => Promise.reject(new Error(errorMessage)));

    await store.dispatch(fetchUserOrders());

    expect(store.getState().userOrders.userOrdersLoading).toBe(false);
    expect(store.getState().userOrders.userOrdersError).not.toBeNull();
    expect(store.getState().userOrders.userOrders).toEqual([]);
    expect(getOrdersMockFail).toHaveBeenCalled();
  });

  it('TestUserOrdersFetchPendingState', async () => {
    const getOrdersMock = jest
      .spyOn(burgerApi, 'getOrdersApi')
      .mockImplementation(() => Promise.resolve(mockOrders));

    store.dispatch(fetchUserOrders());

    expect(store.getState().userOrders.userOrdersLoading).toBe(true);
    expect(store.getState().userOrders.userOrdersError).toBe(null);
    expect(getOrdersMock).toHaveBeenCalled();
  });

  it('TestUserOrdersFetchSuccess', async () => {
    const getOrdersMock = jest
      .spyOn(burgerApi, 'getOrdersApi')
      .mockImplementation(() => Promise.resolve(mockOrders));

    await store.dispatch(fetchUserOrders());

    expect(store.getState().userOrders.userOrdersLoading).toBe(false);
    expect(store.getState().userOrders.userOrdersError).toBe(null);
    expect(store.getState().userOrders.userOrders).toEqual(mockOrders);
    expect(getOrdersMock).toHaveBeenCalled();
  });
});
