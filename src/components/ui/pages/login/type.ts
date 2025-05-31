import { Dispatch, SetStateAction } from 'react';
import { PageUIProps } from '../common-type';
import { FormEvent } from 'react';

export type LoginUIProps = {
  errorText: string | undefined;
  email: string;
  password: string;
  setEmail: Dispatch<SetStateAction<string>>;
  setPassword: Dispatch<SetStateAction<string>>;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
};
