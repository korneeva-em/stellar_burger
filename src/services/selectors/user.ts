import { RootState } from '../store/store';

export const selectUserName = (state: RootState) => state.user.user?.name;
