import { getIngredientsApi } from '../../../utils/burger-api';
import {
  addBun,
  addIngredient,
  removeBun,
  removeIngredient,
  moveIngredient,
  clearConstructor,
  setOrderRequest,
  setOrderModalData
} from '../constructor-slice';
import reducer from '../constructor-slice';
import store from '../../store/store';
import { TIngredient } from '../../../utils/types';
import { useDispatch, useSelector } from '../../store/store';
import { jest } from '@jest/globals';

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

describe('BurgerConstructorReducer', () => {
  it('TestInitialStateOfBurgerConstructor', () => {
    const initialState = reducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(initialState.bun).toBeNull();
    expect(initialState.ingredients).toEqual([]);
    expect(initialState.orderRequest).toBe(false);
    expect(initialState.orderModalData).toBeNull();
  });
  
  it('TestAddingIngredientToConstructor', () => {
    const initialState = {
      bun: null,
      ingredients: [],
      orderRequest: false,
      orderModalData: null
    };
    const ingredient = { ...mockIngredients[0], id: '123' };

    const newState = reducer(initialState, addIngredient(ingredient));
    expect(newState.ingredients).toHaveLength(1);
    expect(newState.ingredients[0]).toEqual(ingredient);
  });

  it('TestRemovingIngredientFromConstructor', () => {
    const ingredient = { ...mockIngredients[0], id: '123' };
    const stateWithIngredient = {
      bun: null,
      ingredients: [ingredient],
      orderRequest: false,
      orderModalData: null
    };

    const newState = reducer(stateWithIngredient, removeIngredient('123'));
    expect(newState.ingredients).toHaveLength(0);
  });

  it('TestMovingIngredientInConstructor', () => {
    const ingredient1 = { ...mockIngredients[0], id: '123' };
    const ingredient2 = { ...mockIngredients[2], id: '456' };
    const stateWithIngredients = {
      bun: null,
      ingredients: [ingredient1, ingredient2],
      orderRequest: false,
      orderModalData: null
    };

    const newState = reducer(
      stateWithIngredients,
      moveIngredient({ dragIndex: 1, hoverIndex: 0 })
    );
    expect(newState.ingredients[0]).toEqual(ingredient2);
    expect(newState.ingredients[1]).toEqual(ingredient1);
  });
});
