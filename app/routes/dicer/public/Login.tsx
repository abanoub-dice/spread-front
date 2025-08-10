import type { FC } from 'react';
import LoginForm from '~/pages/public/login/Login';

export function meta() {
  return [
    { title: 'Dicer Login - Spread' },
    { name: 'description', content: 'Sign in to your Spread dicer account to manage content and campaigns.' },
  ];
}

const Login: FC = () => {
  return <LoginForm userType='dicer'/>;
};

export default Login;
