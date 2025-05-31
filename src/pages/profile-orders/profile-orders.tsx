import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store/store';
import { fetchUserOrders } from '../../services/slices/user-orders-slice';
import { RootState } from '../../services/store/store';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const { userOrders, userOrdersLoading } = useSelector(
    (state: RootState) => state.userOrders
  );

  useEffect(() => {
    if (userOrders.length === 0) {
      dispatch(fetchUserOrders());
    }
  }, [dispatch, userOrders]);

  if (userOrdersLoading) {
    return <Preloader />;
  } else {
    return <ProfileOrdersUI orders={userOrders} />;
  }
};
