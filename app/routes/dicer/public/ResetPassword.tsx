import type { FC } from 'react';
import ResetPasswordForm from '~/pages/public/reset-password/ResetPassword';

export function meta() {
  return [
    { title: 'Reset Password - Spread' },
    { name: 'description', content: 'Set a new password for your Spread dicer account. Create a secure password to protect your account.' },
  ];
}

const ResetPassword: FC = () => {
  return <ResetPasswordForm userType="dicer" />;
};

export default ResetPassword;