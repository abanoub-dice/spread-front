import { Box, Typography, IconButton, Alert } from '@mui/material';
import { GoTrash } from 'react-icons/go';
import { TextField } from '~/components/form/TextField';
import { DropdownField } from '~/components/form/DropdownField';
import QuantityInput from '~/components/form/QuantityInput';
import type { UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form';

interface ProductionItemFormProps {
  index: number;
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  watch: UseFormWatch<any>;
  onRemove: () => void;
  isSubmitting: boolean;
  validationErrors?: { [key: string]: string };
  categories: Array<{ id: string; name: string }>;
  canRemove: boolean;
  onQuantityChange: (value: number) => void;
}

export default function ProductionItemForm({
  index,
  register,
  setValue,
  watch,
  onRemove,
  isSubmitting,
  validationErrors,
  categories,
  canRemove,
  onQuantityChange,
}: ProductionItemFormProps) {
  const item = watch(`items.${index}`);

  return (
    <Box
      key={index}
      sx={{
        p: 2,
        border: '1px solid',
        borderColor: item?.status === 'error' ? 'error.main' : 'grey.200',
        borderRadius: 1,
        position: 'relative',
      }}
    >
      {canRemove && (
        <IconButton
          onClick={onRemove}
          disabled={isSubmitting}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            color: 'error.main',
            '&:hover': {
              backgroundColor: 'error.light',
              color: 'error.contrastText',
            },
          }}
        >
          <GoTrash size={16} />
        </IconButton>
      )}
      {item?.status === 'error' && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {item.errorMessage}
        </Alert>
      )}
      {item?.status === 'success' && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Item created successfully
        </Alert>
      )}
      <Typography variant="subtitle2" sx={{ mb: 2 }}>
        Item {index + 1}
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="Name"
          name={`items.${index}.name`}
          register={register}
          isRequired
          disabled={isSubmitting}
          error={validationErrors?.name}
          placeholder="Enter item name"
        />
        <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
          <Box sx={{ width: { xs: '30%', sm: '20%' } }}>
            <QuantityInput
              value={watch(`items.${index}.quantity`) || 1}
              onChange={onQuantityChange}
              disabled={isSubmitting}
              min={1}
            />
            {validationErrors?.quantity && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1 }}>
                {validationErrors.quantity}
              </Typography>
            )}
          </Box>
          <Box sx={{ width: { xs: '100%', sm: '80%' } }}>
            <DropdownField
              label="Category"
              name={`items.${index}.categoryId`}
              value={watch(`items.${index}.categoryId`)}
              onChange={(e) => setValue(`items.${index}.categoryId`, e.target.value)}
              options={categories.map((category) => ({
                value: category.id,
                label: category.name,
              }))}
              required
              placeholder="Select a category"
              disabled={isSubmitting}
              error={validationErrors?.categoryId}
            />
          </Box>
        </Box>
        <Box sx={{ flex: 1 }}>
          <TextField
            label="Description"
            name={`items.${index}.description`}
            register={register}
            disabled={isSubmitting}
            placeholder="Enter item description"
          />
        </Box>
      </Box>
    </Box>
  );
} 