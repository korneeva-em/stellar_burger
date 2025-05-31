import { getFeedsApi } from '../../../utils/burger-api';
import { fetchAllOrders } from '../all-orders-slice';
import reducer from '../all-orders-slice';
import store from '../../store/store';
import { TOrder } from '../../../utils/types';
import { jest } from '@jest/globals';
import * as burgerApi from '../../../utils/burger-api';

const mockOrders = {
  success: true,
  orders: [
    {
      _id: '123',
      number: 1234,
      name: 'Test Order',
      status: 'done',
      ingredients: ['ingredient1', 'ingredient2'],
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    }
  ] as TOrder[],
  total: 100,
  totalToday: 10
};

describe('AllOrdersSlice', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('TestInitialStateOfAllOrdersSlice', () => {
    const initialState = reducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(initialState.allOrders).toEqual([]);
    expect(initialState.total).toBe(0);
    expect(initialState.totalToday).toBe(0);
    expect(initialState.allOrdersLoading).toBe(false);
    expect(initialState.allOrdersError).toBeNull();
  });

  it('TestFailedFetchOfAllOrders', async () => {
    const errorMessage = 'Failed to fetch orders';
    const getFeedsMockFail = jest
      .spyOn(burgerApi, 'getFeedsApi')
      .mockImplementation(() => Promise.reject(new Error(errorMessage)));

    await store.dispatch(fetchAllOrders());

    expect(store.getState().allOrders.allOrdersLoading).toBe(false);
    expect(store.getState().allOrders.allOrdersError).not.toBeNull();
    expect(store.getState().allOrders.allOrders).toEqual([]);
    expect(getFeedsMockFail).toHaveBeenCalled();
  });

  it('TestPendingStateDuringOrdersFetch', async () => {
    const getFeedsMock = jest
      .spyOn(burgerApi, 'getFeedsApi')
      .mockImplementation(() => Promise.resolve(mockOrders));

    store.dispatch(fetchAllOrders());

    expect(store.getState().allOrders.allOrdersLoading).toBe(true);
    expect(store.getState().allOrders.allOrdersError).toBe(null);
    expect(getFeedsMock).toHaveBeenCalled();
  });

  it('TestSuccessfulFetchOfAllOrders', async () => {
    const getFeedsMock = jest
      .spyOn(burgerApi, 'getFeedsApi')
      .mockImplementation(() => Promise.resolve(mockOrders));

    await store.dispatch(fetchAllOrders());

    expect(store.getState().allOrders.allOrdersLoading).toBe(false);
    expect(store.getState().allOrders.allOrdersError).toBe(null);
    expect(store.getState().allOrders.allOrders).toEqual(mockOrders.orders);
    expect(store.getState().allOrders.total).toBe(mockOrders.total);
    expect(store.getState().allOrders.totalToday).toBe(mockOrders.totalToday);
    expect(getFeedsMock).toHaveBeenCalled();
  });
});
