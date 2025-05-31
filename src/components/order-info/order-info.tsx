import { FC, useMemo, useEffect } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useSelector, useDispatch } from '../../services/store/store';
import { useParams } from 'react-router-dom';
import { fetchAllOrders } from '../../services/slices/all-orders-slice';
import { fetchUserOrders } from '../../services/slices/user-orders-slice';

export const OrderInfo: FC = () => {
  const { allOrders } = useSelector((state) => state.allOrders);
  const { userOrders } = useSelector((state) => state.userOrders);
  const { items: ingredients } = useSelector((state) => state.ingredients);
  const dispatch = useDispatch();
  const { number } = useParams<{ number: string }>();

  useEffect(() => {
    if (allOrders.length === 0) {
      dispatch(fetchAllOrders());
    }
  }, [dispatch, allOrders.length]);

  useEffect(() => {
    if (userOrders.length === 0) {
      dispatch(fetchUserOrders());
    }
  }, [dispatch, userOrders.length]);

  const orderData = useMemo(
    () =>
      [...allOrders, ...userOrders].find(
        (order) => order.number === Number(number)
      ),
    [allOrders, userOrders, number]
  );

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
