import { useEffect } from 'react';
import { useDispatch } from '../services/store/store';
import { getSelectedIngredient } from '../services/slices/ingredients-slice';

export const useSelectedIngredient = (id: string | undefined) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (id) {
      dispatch(getSelectedIngredient(id));
    }
  }, [dispatch, id]);
};
