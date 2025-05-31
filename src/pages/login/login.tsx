import { LoginUI } from '@ui-pages';
import { FC, SyntheticEvent, FormEvent, useState } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { login } from '../../utils/auth';
import { useDispatch } from '../../services/store/store';
import { setAuthenticated, fetchUser } from '../../services/slices/user-slice';
import { useEffect } from 'react';
import { useSelector } from '../../services/store/store';
import { Preloader } from '@ui';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorText, setErrorText] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const isLoading = useSelector((state) => state.loading);

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorText('');

    const { success, error } = await login({ email, password });
    if (success) {
      dispatch(setAuthenticated(true));
      await dispatch(fetchUser()).unwrap();

      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    } else {
      dispatch(setAuthenticated(false));
      setErrorText(error || 'Error logging in');
    }
  };

  if (isLoading) {
    return <Preloader />;
  }

  if (isAuthenticated) {
    return <Navigate to='/profile' replace />;
  } else {
    return (
      <LoginUI
        errorText={errorText}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        handleSubmit={handleSubmit}
      />
    );
  }
};
