import { orderBurgerApi } from './burger-api';
import { TOrder } from './types';

type TOrderResponse = {
  name: string;
  number: number;
};

export const getOrderResponse = async (
  allIngredients: string[]
): Promise<TOrderResponse> => {
  const response = await orderBurgerApi(allIngredients);
  return {
    name: response.name,
    number: response.order.number
  };
};
