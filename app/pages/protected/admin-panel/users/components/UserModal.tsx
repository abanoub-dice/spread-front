import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  useTheme,
  IconButton,
} from '@mui/material';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { UserRole, UserRoleLabel } from '~/utils/interfaces/role';
import { TextField } from '~/components/form/TextField';
import { FormButton } from '~/components/form/FormButton';
import { DropdownField } from '~/components/form/DropdownField';
import CloseIcon from '@mui/icons-material/Close';

interface UserFormData {
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  password?: string;
  confirmPassword?: string;
}

const createSchema = yup
  .object()
  .shape({
    email: yup.string().email('Invalid email address').required('Email is required'),
    firstName: yup
      .string()
      .min(3, 'First name must be at least 3 characters')
      .required('First name is required'),
    lastName: yup
      .string()
      .min(3, 'Last name must be at least 3 characters')
      .required('Last name is required'),
    role: yup.string().oneOf(Object.values(UserRole), 'Please select a valid role').required('Role is required'),
    password: yup
      .string()
      .min(8, 'Password must be at least 8 characters')
      .required('Password is required'),
    confirmPassword: yup.string().required('Please confirm your password'),
  })
  .test('passwords-match', "Passwords don't match", function (value) {
    if (value.password && value.password !== value.confirmPassword) {
      return false;
    }
    return true;
  });

const updateSchema = yup.object().shape({
  email: yup.string().email('Invalid email address').required('Email is required'),
  firstName: yup
    .string()
    .min(3, 'First name must be at least 3 characters')
    .required('First name is required'),
  lastName: yup
    .string()
    .min(3, 'Last name must be at least 3 characters')
    .required('Last name is required'),
  role: yup.string().oneOf(Object.values(UserRole), 'Please select a valid role').required('Role is required'),
});

interface User {
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

interface UserModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: UserFormData) => void;
  user?: User;
  mode: 'create' | 'update';
}

export default function UserModal({ open, onClose, onSubmit, user, mode }: UserModalProps) {
  const theme = useTheme();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: yupResolver(mode === 'create' ? createSchema : updateSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      role: undefined,
      password: '',
      confirmPassword: '',
    }
  });

  useEffect(() => {
    if (user) {
      reset({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      });
    } else {
      reset({
        email: '',
        firstName: '',
        lastName: '',
        role: undefined,
        password: '',
        confirmPassword: '',
      });
    }
  }, [user, reset, open]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFormSubmit: SubmitHandler<UserFormData> = data => {
    if (mode === 'update') {
      const { password, confirmPassword, ...updateData } = data;
      onSubmit(updateData);
    } else {
      onSubmit(data);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogTitle
          sx={{
            px: 4,
            pt: 4,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography
            variant="formHeader"
            sx={{
              position: 'relative',
              color: theme.palette.primary.main,
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: -8,
                left: 0,
                width: '100%',
                height: '2px',
                backgroundColor: theme.palette.primary.main,
                borderRadius: '1px',
              },
            }}
          >
            {mode === 'update' ? 'Update User' : 'Create User'}
          </Typography>
          <IconButton
            onClick={handleClose}
            sx={{
              color: theme.palette.grey[500],
              '&:hover': {
                color: theme.palette.grey[700],
              },
            }}
          >
            <CloseIcon sx={{ fontSize: '1rem' }} />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ px: 4 }}>
          <Box sx={{ mt: 1, width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Email"
              name="email"
              type="email"
              placeholder="Enter email address"
              error={errors.email?.message}
              register={register}
              isRequired
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <TextField
                  label="First Name"
                  name="firstName"
                  placeholder="Enter first name"
                  error={errors.firstName?.message}
                  register={register}
                  isRequired
                />
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <TextField
                  label="Last Name"
                  name="lastName"
                  placeholder="Enter last name"
                  error={errors.lastName?.message}
                  register={register}
                  isRequired
                />
              </Box>
            </Box>
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <DropdownField
                  label="Role"
                  name="role"
                  options={Object.values(UserRole).map(role => ({ 
                    label: UserRoleLabel[role as keyof typeof UserRoleLabel], 
                    value: role 
                  }))}
                  value={field.value || ''}
                  onChange={(e) => {
                    field.onChange(e.target.value as UserRole);
                  }}
                  error={errors.role?.message}
                  required
                  placeholder="Select role"
                  autoComplete="organization-title"
                />
              )}
            />
            {mode === 'create' && (
              <>
                <TextField
                  label="Password"
                  name="password"
                  type="password"
                  placeholder="Enter password"
                  error={errors.password?.message}
                  register={register}
                  isRequired
                  showPasswordToggle
                  autoComplete="new-password"
                />
                <TextField
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm password"
                  error={errors.confirmPassword?.message}
                  register={register}
                  isRequired
                  showPasswordToggle
                  autoComplete="new-password"
                />
              </>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 4, pb: 4 }}>
          <Button
            onClick={handleClose}
            color="inherit"
            variant="outlined"
            sx={{
              borderColor: 'grey.400',
              textTransform: 'capitalize',
              '&:hover': {
                borderColor: 'grey.600',
                transform: 'translateY(-1px)',
                transition: 'all 0.2s ease-in-out',
              },
            }}
          >
            Cancel
          </Button>
          <FormButton
            label={mode === 'update' ? 'Update' : 'Create'}
            fullWidth={false}
            sx={{
              bgcolor: 'primary.main',
              textTransform: 'capitalize',
              '&:hover': {
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                transition: 'all 0.2s ease-in-out',
              },
            }}
          />
        </DialogActions>
      </form>
    </Dialog>
  );
}
