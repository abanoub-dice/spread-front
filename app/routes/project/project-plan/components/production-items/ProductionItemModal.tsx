import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import { useTheme } from '@mui/material/styles';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm, useFieldArray } from 'react-hook-form';
import axiosInstance from '~/utils/api/axiosInstance';
import { QUERY_KEYS } from '~/utils/constants/queryKeys';
import { CategoriesType } from '~/utils/interfaces/category';
import { useToaster } from '~/components/Toaster';
import type { AxiosError } from 'axios';
import type { ErrorResponse } from '~/utils/api/axiosInstance';
import { useEffect, useState } from 'react';
import ProductionItemForm from './ProductionItemForm';

interface ProductionItemModalProps {
  open: boolean;
  onClose: () => void;
  lineItemId: number;
}

interface FormData {
  items: Array<{
    name: string;
    description: string;
    quantity: number;
    categoryId: string;
    status?: 'pending' | 'success' | 'error';
    errorMessage?: string;
  }>;
}

export default function ProductionItemModal({
  open,
  onClose,
  lineItemId,
}: ProductionItemModalProps) {
  const theme = useTheme();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: { [key: string]: string };
  }>({});

  const {
    control,
    register,
    handleSubmit: handleFormSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      items: [
        {
          name: '',
          description: '',
          quantity: 1,
          categoryId: '',
        },
      ],
    },
    mode: 'onChange',
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const { showToaster } = useToaster();

  const { data: categories, error } = useQuery({
    queryKey: [QUERY_KEYS.CATEGORIES, CategoriesType.PRODUCTION_ITEM],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `/v1/categories?limit=0&type=${CategoriesType.PRODUCTION_ITEM}`
      );
      return response.data.categories;
    },
  });

  useEffect(() => {
    if (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      showToaster(axiosError.response?.data?.message || 'Failed to fetch categories', 'error');
      onClose();
    }
  }, [error, showToaster, onClose]);

  const createMutation = useMutation({
    mutationFn: async (data: Array<{
      name: string;
      description: string;
      quantity: number;
      categoryId: string;
    }>) => {
      const response = await axiosInstance.post(`/v1/production-items`, 
        data.map(item => ({
          ...item,
          lineItemId,
        }))
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      showToaster(
        `Successfully created ${variables.length} production item${variables.length > 1 ? 's' : ''}`,
        'success'
      );
      queryClient.invalidateQueries({ queryKey: ['line-items'] });
      handleClose();
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      showToaster(
        error.response?.data?.message || 'Failed to create production items',
        'error'
      );
    },
    onSettled: () => {
      setIsSubmitting(false);
    }
  });

  const handleQuantityChange = (value: number, index: number) => {
    setValue(`items.${index}.quantity`, value);
  };

  const handleClose = () => {
    reset();
    setValidationErrors({});
    onClose();
  };

  const addNewItem = () => {
    append({
      name: '',
      description: '',
      quantity: 1,
      categoryId: '',
    });
  };

  const validateItems = (data: FormData) => {
    const errors: { [key: string]: { [key: string]: string } } = {};
    let hasErrors = false;

    data.items.forEach((item, index) => {
      const itemErrors: { [key: string]: string } = {};

      if (!item.name?.trim()) {
        itemErrors.name = 'Name is required';
        hasErrors = true;
      }

      if (!item.categoryId) {
        itemErrors.categoryId = 'Category is required';
        hasErrors = true;
      }

      if (!item.quantity || item.quantity < 1) {
        itemErrors.quantity = 'Quantity must be at least 1';
        hasErrors = true;
      }

      if (Object.keys(itemErrors).length > 0) {
        errors[index] = itemErrors;
      }
    });

    setValidationErrors(errors);
    return !hasErrors;
  };

  const onSubmit = async (data: FormData) => {
    if (!validateItems(data)) {
      return;
    }

    setIsSubmitting(true);
    createMutation.mutate(data.items);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleFormSubmit(onSubmit)}>
        <DialogTitle
          sx={{
            px: 4,
            pt: 4,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
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
            Add Production Items
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
        <DialogContent>
          <Box sx={{ mt: 1, width: '100%', display: 'flex', flexDirection: 'column', gap: 3 }}>
            {fields.map((field, index) => (
              <ProductionItemForm
                key={field.id}
                index={index}
                register={register}
                setValue={setValue}
                watch={watch}
                onRemove={() => remove(index)}
                isSubmitting={isSubmitting}
                validationErrors={validationErrors[index]}
                categories={categories || []}
                canRemove={fields.length > 1}
                onQuantityChange={value => handleQuantityChange(value, index)}
              />
            ))}
            <Button
              startIcon={<AddIcon />}
              onClick={addNewItem}
              variant="outlined"
              disabled={isSubmitting}
              sx={{
                alignSelf: 'flex-start',
                textTransform: 'capitalize',
              }}
            >
              Add Another Item
            </Button>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 4, pb: 4 }}>
          <Button
            onClick={handleClose}
            color="inherit"
            variant="outlined"
            disabled={isSubmitting}
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
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting || fields.length === 0}
            sx={{
              bgcolor: 'primary.main',
              textTransform: 'capitalize',
              '&:hover': {
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                transition: 'all 0.2s ease-in-out',
              },
            }}
          >
            {isSubmitting ? 'Adding Items...' : 'Add Items'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
