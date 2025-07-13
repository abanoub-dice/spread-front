import { Box, Typography, Button } from '@mui/material';
import { GoTrash } from 'react-icons/go';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '~/utils/api/axiosInstance';
import { useToaster } from '~/components/Toaster';
import type { AxiosError } from 'axios';
import type { ErrorResponse } from '~/utils/api/axiosInstance';
import { setDialogue } from '~/utils/store/slices/dialogueSlice';
import { useAppDispatch } from '~/utils/store/hooks/hooks';
import type { ProductionItem } from '../../types';
import { useState } from 'react';
import ProductionItemModal from './ProductionItemModal';
import { useForm } from 'react-hook-form';
import { TextField } from '~/components/form/TextField';
import { DropdownField } from '~/components/form/DropdownField';
import QuantityInput from '~/components/form/QuantityInput';
import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '~/utils/constants/queryKeys';
import { CategoriesType } from '~/utils/interfaces/category';

interface ProductionItemCardProps {
  item: ProductionItem;
  lineItemId: number;
}

interface FormData {
  name: string;
  description: string;
  quantity: number;
  categoryId: string;
}

export function ProductionItemCard({ item, lineItemId }: ProductionItemCardProps) {
  const queryClient = useQueryClient();
  const { showToaster } = useToaster();
  const dispatch = useAppDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { isDirty },
  } = useForm<FormData>({
    defaultValues: {
      name: item.name,
      description: item.description,
      quantity: item.quantity,
      categoryId: item.category.id,
    },
  });

  const { data: categories } = useQuery({
    queryKey: [QUERY_KEYS.CATEGORIES, CategoriesType.PRODUCTION_ITEM],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `/v1/categories?limit=0&type=${CategoriesType.PRODUCTION_ITEM}`
      );
      return response.data.categories;
    },
  });

  const deleteProductionItemMutation = useMutation({
    mutationFn: async () => {
      await axiosInstance.delete(`/v1/production-items/${item.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['line-items'] });
      showToaster('Production item deleted successfully', 'success');
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      showToaster(error.response?.data?.message || 'Failed to delete production item', 'error');
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await axiosInstance.patch(`/v1/production-items/${item.id}`, data);
      return response.data;
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['line-items'] });
      showToaster('Production item updated successfully', 'success');
      reset({
        name: data.name,
        description: data.description,
        quantity: data.quantity,
        categoryId: data.category.id,
      });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      showToaster(error.response?.data?.message || 'Failed to update production item', 'error');
    },
  });

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(
      setDialogue({
        show: true,
        title: 'Delete Production Item',
        text: (
          <Box>
            Are you sure you want to delete production item{' '}
            <Typography
              component="span"
              sx={{
                color: 'primary.main',
                fontWeight: 600,
                display: 'inline',
              }}
            >
              {item.name}
            </Typography>
            ?
          </Box>
        ),
        acceptLabel: 'Delete',
        acceptColor: 'error.main',
        closable: true,
        onAccept: () => {
          deleteProductionItemMutation.mutate();
        },
      } as any)
    );
  };

  const onSubmit = (data: FormData) => {
    updateMutation.mutate(data);
  };

  const handleQuantityChange = (value: number) => {
    setValue('quantity', value, { shouldDirty: true });
  };

  return (
    <>
      <Box
        sx={{
          p: 2,
          pt: 4,
          border: '1px solid #e0e0e0',
          borderRadius: 1,
          position: 'relative',
        }}
      >
        <Box
          component="span"
          onClick={handleDelete}
          sx={{
            cursor: 'pointer',
            color: 'error.main',
            '&:hover': {
              color: 'error.dark',
            },
            display: 'flex',
            alignItems: 'center',
            position: 'absolute',
            top: 16,
            right: 16,
          }}
        >
          <GoTrash size={16} />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'start', gap: 4, flex: 1, mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <TextField name="name" register={register} label="Name" />
          </Box>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="subHeader" sx={{ ml: 1}}>
            Description
          </Typography>
          <textarea
            {...register('description')}
            placeholder="Enter description"
            style={{
              width: '100%',
              minHeight: 80,
              borderRadius: 10,
              border: '1px solid #ccc',
              padding: '10px 16px',
              fontSize: '0.875rem',
              resize: 'vertical',
              marginTop: '8px',
            }}
          />
        </Box>

        <Box
          sx={{
            display: 'flex',
            gap: 4,
            alignItems: 'flex-start',
            flexDirection: { xs: 'column', sm: 'row' },
            mb: 2,
          }}
        >
          <Box sx={{ ml: 1 }}>
            <QuantityInput value={watch('quantity')} onChange={handleQuantityChange} />
          </Box>
          <Box sx={{ ml: 1, minWidth: 200 }}>
            <DropdownField
              label="Category"
              name="categoryId"
              value={watch('categoryId')}
              onChange={e => setValue('categoryId', e.target.value, { shouldDirty: true })}
              options={
                categories?.map((category: any) => ({
                  value: category.id,
                  label: category.name,
                })) || []
              }
              required
              placeholder="Select a category"
            />
          </Box>
        </Box>

        {isDirty && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button
              variant="contained"
              onClick={handleSubmit(onSubmit)}
              disabled={updateMutation.isPending}
              sx={{
                textTransform: 'capitalize',
              }}
            >
              {updateMutation.isPending ? 'Updating...' : 'Update'}
            </Button>
          </Box>
        )}
      </Box>

      <ProductionItemModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        lineItemId={lineItemId}
      />
    </>
  );
}
