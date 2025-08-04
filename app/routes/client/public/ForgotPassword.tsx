import type { FC } from 'react';
import ForgotPasswordForm from '~/pages/public/forgot-password/ForgotPassword';

export function meta() {
  return [
    { title: 'Forgot Password - Spread' },
    { name: 'description', content: 'Reset your Spread client account password. Enter your email to receive password reset instructions.' },
  ];
}

const ForgotPassword: FC = () => {
  return <ForgotPasswordForm />;
};

export default ForgotPassword;
