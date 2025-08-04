import type { FC } from 'react';
import LoginForm from '~/pages/public/login/Login';

export function meta() {
  return [
    { title: 'client Login - Spread' },
    { name: 'description', content: 'Sign in to your Spread client account to manage your content and campaigns.' },
  ];
}

const Login: FC = () => {
  return <LoginForm />;
};

export default Login;
