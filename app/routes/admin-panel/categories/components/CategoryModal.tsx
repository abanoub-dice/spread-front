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
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import type { CategoryModalProps } from '~/utils/interfaces/category';
import axiosInstance from '~/utils/api/axiosInstance';
import { TextField } from '~/components/form/TextField';
import { FormButton } from '~/components/form/FormButton';
import { useToaster } from '~/components/Toaster';
import type { AxiosError } from 'axios';
import type { ErrorResponse } from '~/utils/api/axiosInstance';
import { QUERY_KEYS } from '~/utils/constants/queryKeys';
import CloseIcon from '@mui/icons-material/Close';

const schema = yup
  .object({
    name: yup.string().required('Name is required'),
    description: yup.string().required('Description is required'),
  })
  .required();

type CategoryFormData = yup.InferType<typeof schema>;

export default function CategoryModal({
  open,
  onClose,
  category,
  mode,
  categoriesType,
}: CategoryModalProps) {
  const theme = useTheme();
  const queryClient = useQueryClient();
  const { showToaster } = useToaster();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  useEffect(() => {
    if (category && mode === 'update') {
      reset(category);
    } else {
      reset({
        name: '',
        description: '',
      });
    }
  }, [category, mode, reset]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const mutation = useMutation({
    mutationFn: (data: CategoryFormData) => {
      if (mode === 'create') {
        return axiosInstance.post('/v1/categories', { ...data, isActive: true, type: categoriesType });
      }
      return axiosInstance.put(`/v1/categories/${category?.id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.CATEGORIES],
        refetchType: 'all',
      });
      showToaster(`Category successfully ${mode === 'create' ? 'created' : 'updated'}`, 'success');
      reset({
        name: '',
        description: '',
      });
      onClose();
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      showToaster(
        error.response?.data?.message ||
          `Failed to ${mode === 'create' ? 'create' : 'update'} category`,
        'error'
      );
    },
  });

  const onSubmit = (data: CategoryFormData) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit(onSubmit)}>
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
            {mode === 'create' ? 'Create Category' : 'Update Category'}
          </Typography>
          <IconButton
            onClick={handleClose}
            sx={{
              color: theme.palette.grey[500],
              '&:hover': {
                color: theme.palette.grey[700],
                transform: 'scale(1.1)',
                transition: 'all 0.2s ease-in-out',
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ px: 4 }}>
          <Box sx={{ mt: 1, width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Name"
              name="name"
              placeholder="Enter category name"
              error={errors.name?.message}
              register={register}
              isRequired
            />
            <TextField
              label="Description"
              name="description"
              placeholder="Enter category description"
              error={errors.description?.message}
              register={register}
              isRequired
            />
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
            label={mode === 'create' ? 'Create' : 'Update'}
            isLoading={mutation.isPending}
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
