import { FC, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import {
  getSelectedIngredient,
  setSelectedIngredient
} from '../../services/slices/ingredients-slice';
import {
  RootState,
  useSelector,
  useDispatch
} from '../../services/store/store';

export const IngredientDetails: FC = () => {
  const { id } = useParams();
  const ingredients = useSelector((state) => state.ingredients.items);
  const dispatch = useDispatch();
  const selectedIngredient = useMemo(
    () => ingredients.find((x) => x._id === id),
    [ingredients, id]
  );

  useEffect(() => {
    if (id) {
      dispatch(getSelectedIngredient(id));
    }

    return () => {
      dispatch(setSelectedIngredient(null));
    };
  }, [dispatch, id]);

  if (!selectedIngredient) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={selectedIngredient} />;
};
