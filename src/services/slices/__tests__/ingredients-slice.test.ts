import { getIngredientsApi } from '../../../utils/burger-api';
import { fetchIngredients } from '../ingredients-slice';
import reducer from '../ingredients-slice';
import store from '../../store/store';
import { TIngredient } from '../../../utils/types';
import { useDispatch, useSelector } from '../../store/store';
import { jest } from '@jest/globals';
import * as burgerApi from '../../../utils/burger-api';

const mockIngredients = [
  {
    _id: '643d69a5c3f7b9001cfa0941',
    name: 'Биокотлета из марсианской Магнолии',
    type: 'main',
    proteins: 420,
    fat: 142,
    carbohydrates: 242,
    calories: 4242,
    price: 424,
    image: 'https://code.s3.yandex.net/react/code/meat-01.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
  },
  {
    _id: '643d69a5c3f7b9001cfa093c',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'https://code.s3.yandex.net/react/code/bun-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
  },
  {
    _id: '643d69a5c3f7b9001cfa0945',
    name: 'Соус с шипами Антарианского плоскоходца',
    type: 'sauce',
    proteins: 101,
    fat: 99,
    carbohydrates: 100,
    calories: 100,
    price: 88,
    image: 'https://code.s3.yandex.net/react/code/sauce-01.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/sauce-01-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/sauce-01-large.png'
  }
];

describe('IngredientsSlice', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('TestIngredientsSliceInitialState', () => {
    const initialState = reducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(initialState.items).toEqual([]);
    expect(initialState.loading).toBe(false);
    expect(initialState.error).toBeNull();
    expect(initialState.selectedIngredient).toBeNull();
  });

  it('TestIngredientsFetchFailure', async () => {
    const errorMessage = 'Failed to fetch ingredients';
    const getIngredientsMockFail = jest
      .spyOn(burgerApi, 'getIngredientsApi')
      .mockImplementation(() => Promise.reject(new Error(errorMessage)));

    await store.dispatch(fetchIngredients());

    expect(store.getState().ingredients.loading).toBe(false);
    expect(store.getState().ingredients.error).not.toBeNull();
    expect(store.getState().ingredients.items).toEqual([]);
    expect(getIngredientsMockFail).toHaveBeenCalled();
  });

  it('TestIngredientsFetchPendingState', async () => {
    const getIngredientsMock = jest
      .spyOn(burgerApi, 'getIngredientsApi')
      .mockImplementation(() =>
        Promise.resolve(mockIngredients as TIngredient[])
      );

    store.dispatch(fetchIngredients());
    expect(store.getState().ingredients.loading).toBe(true);
    expect(store.getState().ingredients.error).toBe(null);

    expect(getIngredientsMock).toHaveBeenCalled();
  });

  it('TestIngredientsFetchSuccess', async () => {
    const getIngredientsMock = jest
      .spyOn(burgerApi, 'getIngredientsApi')
      .mockImplementation(() =>
        Promise.resolve(mockIngredients as TIngredient[])
      );

    await store.dispatch(fetchIngredients());

    expect(store.getState().ingredients.loading).toBe(false);
    expect(store.getState().ingredients.error).toBe(null);
    expect(getIngredientsMock).toHaveBeenCalled();
    expect(store.getState().ingredients.items).toEqual(mockIngredients);
  });
});
