import { Box, Typography, IconButton, TextareaAutosize } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { TextField } from '../../components/form/TextField';
import { FormButton } from '../../components/form/FormButton';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from '~/utils/date/dayjs';
import type { Dayjs } from 'dayjs';
import type { Category } from '../../utils/interfaces/category';
import type { User } from '../../utils/interfaces/user';
import { DropdownField } from '../../components/form/DropdownField';
import { DatePickerField } from '../../components/form/DatePickerField';
import { useAppDispatch } from '../../utils/store/hooks/hooks';
import { useToaster } from '../../components/Toaster';
import type { AxiosError } from 'axios';
import type { ErrorResponse } from '../../utils/api/axiosInstance';
import { useState, useEffect } from 'react';
import { setDialogue } from '../../utils/store/slices/dialogueSlice';
import { QUERY_KEYS } from '~/utils/constants/queryKeys';
import CategoryModal from '~/routes/admin-panel/categories/components/CategoryModal';
import { CategoriesType } from '~/utils/interfaces/category';
import AddIcon from '@mui/icons-material/Add';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../utils/api/axiosInstance';
import { useNavigate } from 'react-router-dom';

type FormValues = {
  name: string;
  client: string;
  projectType: string;
  categories: string[];
  users: string[];
  eventStartDate?: Dayjs | null;
  eventEndDate?: Dayjs | null;
  productionStartDate?: Dayjs | null;
  productionEndDate?: Dayjs | null;
  description?: string;
};

type ProjectFormProps = {
  project: any; // Replace with proper type
  categories: Category[];
  users: User[];
};

const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return null;
  const date = dayjs.utc(dateString);
  return date.isValid() ? date.local() : null;
};

export default function ProjectForm({ project, categories, users }: ProjectFormProps) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { showToaster } = useToaster();
  const queryClient = useQueryClient();
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<FormValues>({
    defaultValues: {
      name: project.name,
      client: project.client,
      projectType: project.projectType,
      description: project.description || '',
      eventStartDate: formatDate(project.eventStartDate),
      eventEndDate: formatDate(project.eventEndDate),
      productionStartDate: formatDate(project.productionStartDate),
      productionEndDate: formatDate(project.productionEndDate),
      categories: project.categories.map((cat: Category) => cat.id?.toString() || ''),
      users: project.users.map((user: User) => user.id.toString()),
    },
    mode: 'onChange',
  });

  // Register fields with validation
  register('name', { required: 'Project name is required' });
  register('client', { required: 'Client name is required' });
  register('projectType', { required: 'Project type is required' });
  register('productionStartDate', { required: 'Production start date is required' });
  register('productionEndDate', { required: 'Production end date is required' });
  register('eventStartDate', { required: 'Event start date is required' });
  register('eventEndDate', { required: 'Event end date is required' });

  // Watch date changes for validation
  const eventStartDate = watch('eventStartDate');
  const eventEndDate = watch('eventEndDate');
  const productionStartDate = watch('productionStartDate');
  const productionEndDate = watch('productionEndDate');

  // Validate dates when they change
  useEffect(() => {
    if (productionEndDate && productionStartDate && productionEndDate.isBefore(productionStartDate)) {
      setError('productionEndDate', {
        type: 'manual',
        message: 'Production end date must be after production start date'
      });
    } else {
      clearErrors('productionEndDate');
    }
  }, [productionStartDate, productionEndDate, setError, clearErrors]);

  useEffect(() => {
    if (eventEndDate && eventStartDate && eventEndDate.isBefore(eventStartDate)) {
      setError('eventEndDate', {
        type: 'manual',
        message: 'Event end date must be after event start date'
      });
    } else {
      clearErrors('eventEndDate');
    }
  }, [eventStartDate, eventEndDate, setError, clearErrors]);

  useEffect(() => {
    if (eventStartDate && productionEndDate && eventStartDate.isBefore(productionEndDate)) {
      setError('eventStartDate', {
        type: 'manual',
        message: 'Event start date must be after production end date'
      });
    } else {
      clearErrors('eventStartDate');
    }
  }, [eventStartDate, productionEndDate, setError, clearErrors]);

  const updateProjectMutation = useMutation({
    mutationFn: (data: FormValues) => {
      const formattedData = {
        name: data.name,
        client: data.client,
        projectType: data.projectType,
        description: data.description || '',
        eventStartDate: data.eventStartDate ? data.eventStartDate.utc().toISOString() : null,
        eventEndDate: data.eventEndDate ? data.eventEndDate.utc().toISOString() : null,
        productionStartDate: data.productionStartDate
          ? data.productionStartDate.utc().toISOString()
          : null,
        productionEndDate: data.productionEndDate
          ? data.productionEndDate.utc().toISOString()
          : null,
        categoryIds: data.categories.map(id => parseInt(id, 10)),
        userIds: data.users.map(id => parseInt(id, 10)),
      };
      return axiosInstance.patch(`/v1/projects/${project.id}`, formattedData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.PROJECTS],
      });
      queryClient.invalidateQueries({
        queryKey: ['project-header'],
      });
      showToaster('Project updated successfully', 'success');
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      showToaster(error.response?.data?.message || 'Failed to update project', 'error');
    },
  });

  const deleteProjectMutation = useMutation({
    mutationFn: () => axiosInstance.delete(`/v1/projects/${project.id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.PROJECTS],
        refetchType: 'all',
      });
      showToaster('Project deleted successfully', 'success');
      navigate('/', { replace: true });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      showToaster(error.response?.data?.message || 'Failed to delete project', 'error');
    },
  });

  const handleDelete = () => {
    dispatch(
      setDialogue({
        show: true,
        title: 'Delete Project',
        text: (
          <>
            Are you sure you want to delete{' '}
            <Typography
              variant="subHeader"
              component="span"
              sx={{ color: 'primary.main', fontWeight: 'bold' }}
            >
              {project.name}
            </Typography>
            ? <br />
            This action cannot be undone.
          </>
        ),
        acceptLabel: 'Delete',
        acceptColor: 'error.main',
        closable: true,
        onAccept: () => {
          deleteProjectMutation.mutate();
        },
      } as any)
    );
  };

  const CATEGORY_OPTIONS = categories.map(cat => ({
    label: cat.name,
    value: cat.id?.toString() || '',
  }));

  const USER_OPTIONS = users.map(user => ({
    label: `${user.firstName} ${user.lastName}`,
    value: user.id.toString(),
  }));

  const onSubmit = (data: FormValues) => {
    // Additional validation before submission
    if (data.productionEndDate && data.productionStartDate && data.productionEndDate.isBefore(data.productionStartDate)) {
      setError('productionEndDate', {
        type: 'manual',
        message: 'Production end date must be after production start date'
      });
      return;
    }

    if (data.eventEndDate && data.eventStartDate && data.eventEndDate.isBefore(data.eventStartDate)) {
      setError('eventEndDate', {
        type: 'manual',
        message: 'Event end date must be after event start date'
      });
      return;
    }

    if (data.eventStartDate && data.productionEndDate && data.eventStartDate.isBefore(data.productionEndDate)) {
      setError('eventStartDate', {
        type: 'manual',
        message: 'Event start date must be after production end date'
      });
      return;
    }

    updateProjectMutation.mutate(data);
  };

  const handleCategoryModalClose = () => {
    setIsCategoryModalOpen(false);
  };

  return (
    <Box maxWidth={600} mx="0">
      <Box mb={2}>
        <Typography variant="h1">Update Project</Typography>
      </Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box mb={2}>
          <TextField
            label="Project Name"
            name="name"
            placeholder="Enter project name"
            error={errors.name?.message}
            register={register}
            isRequired
          />
        </Box>
        <Box mb={2}>
          <TextField
            label="Client"
            name="client"
            placeholder="Enter client name"
            error={errors.client?.message}
            register={register}
            isRequired
          />
        </Box>
        <Box mb={2}>
          <TextField
            label="Project Type"
            name="projectType"
            placeholder="Enter project type (e.g., Conference, Launch, Exhibition)"
            error={errors.projectType?.message}
            register={register}
            isRequired
          />
        </Box>
        <Box mb={2}>
          <Box display="flex" alignItems="flex-end" gap={1}>
            <Box flex={1}>
              <Controller
                name="categories"
                control={control}
                render={({ field }) => (
                  <DropdownField
                    label="Categories"
                    name="categories"
                    options={CATEGORY_OPTIONS}
                    value={field.value ?? null}
                    onChange={field.onChange}
                    error={errors.categories?.message}
                    multiple
                    placeholder="Select categories"
                  />
                )}
              />
            </Box>
            <IconButton
              onClick={() => setIsCategoryModalOpen(true)}
              size="small"
              sx={{
                mb: 0.5,
                bgcolor: 'primary.main',
                color: 'white',
                width: 32,
                height: 32,
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
              }}
            >
              <AddIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Box>
        </Box>
        <Box mb={2}>
          <Controller
            name="users"
            control={control}
            render={({ field }) => (
              <DropdownField
                label="Assign Users"
                name="users"
                options={USER_OPTIONS}
                value={field.value ?? null}
                onChange={field.onChange}
                error={errors.users?.message}
                multiple
                placeholder="Select users"
              />
            )}
          />
        </Box>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box display="flex" flexWrap="wrap" gap="6%" rowGap={2} mb={2}>
            <Box width="47%">
              <Controller
                name="productionStartDate"
                control={control}
                render={({ field }) => (
                  <DatePickerField
                    label="Production Start Date"
                    name="productionStartDate"
                    value={field.value ?? null}
                    onChange={field.onChange}
                    error={errors.productionStartDate?.message}
                    placeholder="Select production start date"
                    minDate={dayjs()}
                    required
                  />
                )}
              />
            </Box>
            <Box width="47%">
              <Controller
                name="productionEndDate"
                control={control}
                render={({ field }) => (
                  <DatePickerField
                    label="Production End Date"
                    name="productionEndDate"
                    value={field.value ?? null}
                    onChange={field.onChange}
                    error={errors.productionEndDate?.message}
                    placeholder={!productionStartDate ? "Select production start date first" : "Select production end date"}
                    minDate={productionStartDate ? productionStartDate : undefined}
                    disabled={!productionStartDate}
                    required
                  />
                )}
              />
            </Box>
            <Box width="47%">
              <Controller
                name="eventStartDate"
                control={control}
                render={({ field }) => (
                  <DatePickerField
                    label="Event Start Date"
                    name="eventStartDate"
                    value={field.value ?? null}
                    onChange={field.onChange}
                    error={errors.eventStartDate?.message}
                    placeholder={!productionEndDate ? "Select production dates first" : "Select event start date"}
                    minDate={productionEndDate ? productionEndDate : undefined}
                    disabled={!productionEndDate}
                    required
                  />
                )}
              />
            </Box>
            <Box width="47%">
              <Controller
                name="eventEndDate"
                control={control}
                render={({ field }) => (
                  <DatePickerField
                    label="Event End Date"
                    name="eventEndDate"
                    value={field.value ?? null}
                    onChange={field.onChange}
                    error={errors.eventEndDate?.message}
                    placeholder={!eventStartDate ? "Select event start date first" : "Select event end date"}
                    minDate={eventStartDate ? eventStartDate : undefined}
                    disabled={!eventStartDate}
                    required
                  />
                )}
              />
            </Box>
          </Box>
        </LocalizationProvider>
        <Box mb={2}>
          <Typography variant="subHeader" sx={{ ml: 1 }}>
            Description
          </Typography>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <Box
                component={TextareaAutosize}
                {...field}
                placeholder="Enter project description..."
                minRows={4}
                maxRows={8}
                sx={{
                  width: '100%',
                  mt: 1,
                  p: '10px 16px',
                  fontSize: '0.875rem',
                  fontFamily: 'inherit',
                  borderRadius: '10px',
                  border: errors.description
                    ? '1px solid #d32f2f'
                    : '1px solid rgba(0, 0, 0, 0.23)',
                  resize: 'vertical',
                  '&::placeholder': {
                    fontSize: '0.75rem',
                    color: 'text.secondary',
                  },
                }}
              />
            )}
          />
          {errors.description && (
            <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1 }}>
              {errors.description.message}
            </Typography>
          )}
        </Box>
        <Box display="flex" justifyContent="end">
          <FormButton
            label="Delete Project"
            isLoading={deleteProjectMutation.isPending}
            onClick={handleDelete}
            color="error"
            type="button"
            fullWidth={false}
            variant="text"
            sx={{
              px: 3,
              py: 1,
              textTransform: 'none',
              '&:hover': {
                textDecoration: 'underline',
                backgroundColor: 'transparent',
              },
            }}
          />
          <FormButton
            label="Update Project"
            isLoading={updateProjectMutation.isPending}
            type="submit"
            fullWidth={false}
            sx={{
              px: 3,
              py: 1,
              opacity: updateProjectMutation.isPending ? 0.7 : 1,
              pointerEvents: updateProjectMutation.isPending ? 'none' : 'auto',
            }}
          />
        </Box>
      </form>

      <CategoryModal
        open={isCategoryModalOpen}
        onClose={handleCategoryModalClose}
        mode="create"
        categoriesType={CategoriesType.PROJECT}
      />
    </Box>
  );
}
