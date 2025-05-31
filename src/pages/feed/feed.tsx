import { FC } from 'react';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { useSelector, useDispatch } from '../../services/store/store';
import { useEffect } from 'react';
import { fetchAllOrders } from '../../services/slices/all-orders-slice';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const { allOrders, allOrdersLoading } = useSelector(
    (state) => state.allOrders
  );

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  const handleGetFeeds = () => {
    dispatch(fetchAllOrders());
  };

  if (allOrdersLoading) {
    return <Preloader />;
  } else {
    return <FeedUI orders={allOrders} handleGetFeeds={handleGetFeeds} />;
  }
};
