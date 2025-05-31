import '../../index.css';
import styles from './app.module.css';
import { AppHeader } from '@components';
import { useDispatch, useSelector } from '../../services/store/store';
import { setSelectedIngredient } from '../../services/slices/ingredients-slice';
import { fetchUser } from '../../services/slices/user-slice';
import { fetchIngredients } from '../../services/slices/ingredients-slice';
import { Preloader } from '@ui';

import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

import {
  ProtectedRoute,
  Modal,
  OrderInfo,
  IngredientDetails
} from '@components';

import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages';

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const background = location.state?.background;
  const dispatch = useDispatch();

  const isModalRoute =
    location.pathname.includes('/ingredients/') ||
    location.pathname.includes('/feed/') ||
    location.pathname.includes('/profile/orders/');

  const ingredients = useSelector((state) => state.ingredients.items);
  useEffect(() => {
    if (ingredients.length === 0) {
      dispatch(fetchIngredients());
    }
  }, [dispatch, ingredients.length]);

  // меняем background на путь до родительского маршрута
  useEffect(() => {
    const handleModalRoute = async () => {
      if (isModalRoute) {
        const pathSegments = location.pathname.split('/');
        const number = pathSegments.pop();
        const backgroundPath = pathSegments.join('/');

        if (location.pathname.includes('ingredients')) {
          navigate(location.pathname, {
            state: { background: '/' },
            replace: true
          });
        } else {
          navigate(location.pathname, {
            state: { background: backgroundPath || '/' },
            replace: true
          });
        }
      }
    };

    handleModalRoute();
  }, [location.pathname, background, isModalRoute, navigate]);

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  const handleFeedModalClose = () => {
    navigate('/feed');
  };

  const handleingredientModalClose = () => {
    dispatch(setSelectedIngredient(null));
    navigate('/');
  };

  const handleProfileOrderModalClose = () => {
    navigate('/profile/orders');
  };

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={background || (isModalRoute ? '/' : location)}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/reset-password' element={<ResetPassword />} />

        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {(background || isModalRoute) && (
        <Routes>
          <Route
            path='/ingredients/:id'
            element={
              <Modal
                title='Детали ингредиента'
                onClose={handleingredientModalClose}
              >
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/feed/:number'
            element={
              <Modal
                title={`#${location.pathname.split('/').pop()}`}
                onClose={handleFeedModalClose}
              >
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRoute>
                <Modal title='Заказ' onClose={handleProfileOrderModalClose}>
                  <OrderInfo />
                </Modal>
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
