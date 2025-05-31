import { loginUserApi, TLoginData } from './burger-api';
import { setCookie } from './cookie';

export const login = async (credentials: TLoginData) => {
  try {
    const data = await loginUserApi(credentials);
    localStorage.setItem('refreshToken', data.refreshToken);
    setCookie('accessToken', data.accessToken);
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Invalid email or password' };
  }
};
