import React from 'react';
import {
  Dialog as MuiDialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Button,
  Typography,
  Box,
  InputAdornment
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { TextField } from '@/components/form/TextField';
import { DropdownField } from '@/components/form/DropdownField';
import { UserRole } from '@/utils/interfaces/user';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';
import CloseIcon from '@mui/icons-material/Close';
import type { SubmitHandler } from 'react-hook-form';

interface Account {
  id: number;
  name: string;
  logo: string;
  pmp_link: string | null;
  description: string;
  monthly_posts_limit: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

interface AddMemberModalProps {
  open: boolean;
  onClose: () => void;
  accounts: Account[];
}

type FormValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole | '';
  assignedAccounts: string[];
};

const schema: yup.ObjectSchema<FormValues> = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm Password is required'),
  role: yup.mixed<UserRole>().oneOf(Object.values(UserRole)).required('Role is required'),
  assignedAccounts: yup.array().of(yup.string().defined()).min(1, 'Select at least one account').defined().default([]),
});

const roleOptions = Object.values(UserRole).map(role => ({ label: role, value: role }));

const AddMemberModal: React.FC<AddMemberModalProps> = ({ open, onClose, accounts }) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: '',
      assignedAccounts: [],
    },
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    // TODO: handle submit
    onClose();
    reset();
  };

  React.useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  return (
    <MuiDialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pr: 2,
          py: 1.2,
          borderBottom: '1px solid',
          borderColor: 'divider',
          boxShadow: '0 4px 12px -6px rgba(0,0,0,0.10)',
          minHeight: 0,
        }}
      >
        <Typography variant="h2">Add New Member</Typography>
        <IconButton onClick={onClose} size="large">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box pt={1}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box mb={2}>
              <TextField
                label="Name"
                name="name"
                register={register}
                error={errors.name?.message}
                isRequired
              />
            </Box>
            <Box mb={2}>
              <TextField
                label="Email"
                name="email"
                type="email"
                register={register}
                error={errors.email?.message}
                isRequired
              />
            </Box>
            <Box mb={2}>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <TextField
                    label="Password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    register={register}
                    error={errors.password?.message}
                    isRequired
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword((v) => !v)}
                          edge="end"
                          tabIndex={-1}
                          sx={{ color: 'primary.main', p: 0.5 }}
                        >
                          {showPassword ? <MdVisibilityOff size={22} /> : <MdVisibility size={22} />}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                )}
              />
            </Box>
            <Box mb={2}>
              <Controller
                name="confirmPassword"
                control={control}
                render={({ field }) => (
                  <TextField
                    label="Confirm Password"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    register={register}
                    error={errors.confirmPassword?.message}
                    isRequired
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowConfirmPassword((v) => !v)}
                          edge="end"
                          tabIndex={-1}
                          sx={{ color: 'primary.main', p: 0.5 }}
                        >
                          {showConfirmPassword ? <MdVisibilityOff size={22} /> : <MdVisibility size={22} />}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                )}
              />
            </Box>
            <Box mb={2}>
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <DropdownField
                    label="Role"
                    name="role"
                    options={roleOptions}
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.role?.message}
                    required
                    placeholder="Select role"
                  />
                )}
              />
            </Box>
            <Box mb={3}>
              <Controller
                name="assignedAccounts"
                control={control}
                render={({ field }) => (
                  <DropdownField
                    label="Assigned Accounts (comma-separated)"
                    name="assignedAccounts"
                    options={accounts.map(acc => ({ label: acc.name, value: acc.id.toString() }))}
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.assignedAccounts?.message}
                    required
                    multiple
                    placeholder="Search and select accounts..."
                  />
                )}
              />
            </Box>
            <Box display="flex" justifyContent="flex-end">
              <Button type="submit" variant="contained">
                <Typography variant="body1" textTransform="none" p={1}>
                  Add Member
                </Typography>
              </Button>
            </Box>
          </form>
        </Box>
      </DialogContent>
    </MuiDialog>
  );
};

export default AddMemberModal;
