import { TIngredientsCategoryProps } from './type';
import { forwardRef, useMemo } from 'react';
import { TIngredient } from '@utils-types';
import { IngredientsCategoryUI } from '../ui/ingredients-category';
import { useSelector } from '../../services/store/store';

export const IngredientsCategory = forwardRef<
  HTMLUListElement,
  TIngredientsCategoryProps
>(({ title, titleRef, ingredients, onIngredientClick, ...rest }, ref) => {
  const constructorBun = useSelector((state) => state.constructor.bun);
  const constructorIngredients = useSelector(
    (state) => state.constructor.ingredients
  );

  const burgerConstructor = useMemo(
    () => ({
      selectedBun: constructorBun,
      selectedIngredients: constructorIngredients
    }),
    [constructorBun, constructorIngredients]
  );

  const ingredientsCounters = useMemo(() => {
    const { selectedBun, selectedIngredients } = burgerConstructor;
    const counters: { [key: string]: number } = {};

    if (selectedIngredients) {
      selectedIngredients.forEach((ingredient: TIngredient) => {
        if (!counters[ingredient._id]) counters[ingredient._id] = 0;
        counters[ingredient._id]++;
      });
    }

    if (selectedBun) counters[selectedBun._id] = 1;
    return counters;
  }, [burgerConstructor]);

  return (
    <IngredientsCategoryUI
      title={title}
      titleRef={titleRef}
      ingredients={ingredients}
      ingredientsCounters={ingredientsCounters}
      ref={ref}
      {...rest}
    />
  );
});
