import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  useTheme,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import type { User, UserSummery } from '~/utils/interfaces/user';
import type { Dayjs } from 'dayjs';
import { DropdownField } from '~/components/form/DropdownField';
import { DatePickerField } from '~/components/form/DatePickerField';
import { useForm } from 'react-hook-form';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from '~/utils/date/dayjs';
import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '~/utils/api/axiosInstance';
import { useToaster } from '~/components/Toaster';
import type { AxiosError } from 'axios';
import type { ErrorResponse } from '~/utils/api/axiosInstance';
import type { CreateActionItemPayload, UpdateActionItemPayload } from '../types';

interface ActionItemModalProps {
  open: boolean;
  onClose: () => void;
  actionItem?: any; // Accepts an ActionItem for update mode
  projectId: number;
}

interface ActionItemFormData {
  description: string;
  assigned_to: string;
  dueDate: Dayjs | null;
}

export default function ActionItemModal({
  open,
  onClose,
  actionItem,
  projectId,
}: ActionItemModalProps) {
  const theme = useTheme();
  const isUpdateMode = !!actionItem;
  const { showToaster } = useToaster();
  const queryClient = useQueryClient();

  const {
    data: projectUsers,
    isLoading: isLoadingUsers,
    isError: isErrorUsers,
  } = useQuery<UserSummery[]>({
    queryKey: ['project-users', projectId],
    queryFn: async () => {
      const response = await axiosInstance.get<UserSummery[]>(`/v1/projects/${projectId}/users`);
      return response.data;
    },
  });

  useEffect(() => {
    if (isErrorUsers) {
      showToaster('Could not fetch required data. Please try again.', 'error');
      handleClose();
    }
  }, [isErrorUsers, showToaster]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ActionItemFormData>({
    defaultValues: {
      description: '',
      assigned_to: '',
      dueDate: null,
    },
  });

  const createActionItemMutation = useMutation({
    mutationFn: (data: CreateActionItemPayload) => {
      return axiosInstance.post('/v1/action-items', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['action-items'] });
      showToaster('Action item created successfully', 'success');
      handleClose();
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      showToaster(error.response?.data?.message || 'Failed to create action item', 'error');
    },
  });

  const updateActionItemMutation = useMutation({
    mutationFn: (data: UpdateActionItemPayload) => {
      return axiosInstance.patch(`/v1/action-items/${actionItem.id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['action-items'] });
      showToaster('Action item updated successfully', 'success');
      handleClose();
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      showToaster(error.response?.data?.message || 'Failed to update action item', 'error');
    },
  });

  // Set initial values when modal opens or actionItem changes
  useEffect(() => {
    if (isUpdateMode && actionItem) {
      setValue('description', actionItem.description || '');
      setValue('assigned_to', actionItem.assignedUser?.id?.toString() || '');
      setValue('dueDate', actionItem.dueDate ? dayjs(actionItem.dueDate) : null);
    }
  }, [isUpdateMode, actionItem, setValue]);

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      reset({
        description: '',
        assigned_to: '',
        dueDate: null,
      });
    }
  }, [open, reset]);

  const handleFormSubmit = (data: ActionItemFormData) => {
    if (!data.dueDate || !data.assigned_to) return;

    // Convert date to UTC
    const utcDate = dayjs(data.dueDate).utc().toISOString();

    if (isUpdateMode) {
      const updatePayload: UpdateActionItemPayload = {
        description: data.description,
        dueDate: utcDate,
        assignedUserId: Number(data.assigned_to),
      };
      updateActionItemMutation.mutate(updatePayload);
    } else {
      const createPayload: CreateActionItemPayload = {
        description: data.description,
        dueDate: utcDate,
        completed: false,
        assignedUserId: Number(data.assigned_to),
        projectId,
      };
      createActionItemMutation.mutate(createPayload);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const userOptions = projectUsers?.map(user => ({
    label: user.name,
    value: user.id.toString(),
  })) ?? [];

  const formValues = watch();

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
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
            {isUpdateMode ? 'Update Action Item' : 'Add New Action Item'}
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
            <Box>
              <Typography variant="subHeader" sx={{ ml: 1 }}>
                Description <span style={{ color: 'red' }}>*</span>
              </Typography>
              <textarea
                {...register('description', { required: 'Description is required' })}
                placeholder="What needs to be done..."
                style={{
                  width: '100%',
                  minHeight: 80,
                  borderRadius: 10,
                  border: '1px solid #ccc',
                  padding: '10px 16px',
                  fontSize: '0.875rem',
                  marginTop: 8,
                  resize: 'vertical',
                }}
              />
              {errors.description && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1 }}>
                  {errors.description.message}
                </Typography>
              )}
            </Box>
            <DropdownField
              label="Assigned To"
              name="assigned_to"
              options={userOptions}
              value={formValues.assigned_to}
              onChange={e => setValue('assigned_to', e.target.value)}
              placeholder="Select user"
            />
            <Box sx={{ width: '50%' }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePickerField
                  label="Due Date"
                  name="dueDate"
                  value={formValues.dueDate}
                  onChange={date => setValue('dueDate', date)}
                  required
                  placeholder="Select due date"
                />
              </LocalizationProvider>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 4, pb: 4 }}>
          <Button
            onClick={handleClose}
            color="inherit"
            variant="outlined"
            disabled={createActionItemMutation.isPending || updateActionItemMutation.isPending}
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
            disabled={
              !formValues.dueDate ||
              !formValues.assigned_to ||
              createActionItemMutation.isPending ||
              updateActionItemMutation.isPending
            }
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
            {isUpdateMode ? 'Update Action Item' : 'Add Action Item'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
