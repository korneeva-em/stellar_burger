import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useSelector, useDispatch } from '../../services/store/store';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import {
  setOrderRequest,
  setOrderModalData,
  clearConstructor
} from '../../services/slices/constructor-slice';
import { getOrderResponse } from '../../utils/get-order-response';
import { useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  const bun = useSelector((state) => state.constructor.bun);
  const ingredients = useSelector((state) => state.constructor.ingredients);
  const orderRequest = useSelector((state) => state.constructor.orderRequest);
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const orderModalData = useSelector(
    (state) => state.constructor.orderModalData
  );
  const navigate = useNavigate();

  const constructorItems = useMemo(
    () => ({
      bun: bun || null,
      ingredients: ingredients || []
    }),
    [bun, ingredients]
  );

  const dispatch = useDispatch();

  const onOrderClick = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!constructorItems.bun || orderRequest) return;

    const allIngredients = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((item) => item._id),
      constructorItems.bun._id // добавляем булку дважды (верх и низ)
    ];

    try {
      dispatch(setOrderRequest(true));
      const orderResponse = await getOrderResponse(allIngredients);
      dispatch(setOrderModalData(orderResponse));
      dispatch(clearConstructor());
    } catch (error) {
      console.error('Failed to place order:', error);
    } finally {
      dispatch(setOrderRequest(false));
    }
  };

  const closeOrderModal = () => {
    dispatch(setOrderModalData(null));
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <BurgerConstructorUI
        price={price}
        orderRequest={orderRequest}
        constructorItems={constructorItems}
        orderModalData={orderModalData}
        onOrderClick={onOrderClick}
        closeOrderModal={closeOrderModal}
      />
    </DndProvider>
  );
};
