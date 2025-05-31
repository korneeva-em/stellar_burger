import { FC, memo } from 'react';
import { useLocation } from 'react-router-dom';

import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';
import { TConstructorIngredient } from '../../utils/types';
import { useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { addBun, addIngredient } from '../../services/slices/constructor-slice';

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count }) => {
    const location = useLocation();
    const dispatch = useDispatch();

    const handleAdd = () => {
      const constructorItem = {
        ...ingredient,
        id: uuidv4()
      } as TConstructorIngredient;

      if (ingredient.type === 'bun') {
        dispatch(addBun(constructorItem));
      } else {
        dispatch(addIngredient(constructorItem));
      }
    };

    return (
      <BurgerIngredientUI
        ingredient={ingredient}
        count={count}
        locationState={{ background: location }}
        handleAdd={handleAdd}
      />
    );
  }
);
