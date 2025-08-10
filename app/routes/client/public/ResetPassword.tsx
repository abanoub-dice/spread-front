import type { FC } from 'react';
import ResetPasswordForm from '~/pages/public/reset-password/ResetPassword';

export function meta() {
  return [
    { title: 'Reset Password - Spread' },
    {
      name: 'description',
      content:
        'Set a new password for your Spread client account. Create a secure password to protect your account.',
    },
  ];
}

const ResetPassword: FC = () => {
  return <ResetPasswordForm userType="client" />;
};

export default ResetPassword;
