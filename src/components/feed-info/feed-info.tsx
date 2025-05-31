import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store/store';
import { RootState } from '../../services/store/store';
import { Preloader } from '@ui';
import { TOrder } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';
import { fetchAllOrders } from '../../services/slices/all-orders-slice';

const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo: FC = () => {
  const dispatch = useDispatch();
  const { allOrders, allOrdersLoading, total, totalToday } = useSelector(
    (state: RootState) => state.allOrders
  );

  useEffect(() => {
    if (allOrders.length === 0) {
      dispatch(fetchAllOrders());
    }
  }, [dispatch, allOrders.length]);

  const readyOrders = getOrders(allOrders, 'done');
  const pendingOrders = getOrders(allOrders, 'pending');

  if (allOrdersLoading) {
    return <Preloader />;
  } else {
    return (
      <FeedInfoUI
        readyOrders={readyOrders}
        pendingOrders={pendingOrders}
        feed={{ total, totalToday }}
      />
    );
  }
};
