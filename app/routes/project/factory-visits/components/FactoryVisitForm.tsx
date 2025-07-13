import { Box, Typography, IconButton, Checkbox, FormControlLabel, Button } from '@mui/material';
import { GoTrash } from 'react-icons/go';
import { FiEdit2, FiPlus } from 'react-icons/fi';
import { BsFlag } from 'react-icons/bs';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import axiosInstance from '~/utils/api/axiosInstance';
import { useToaster } from '~/components/Toaster';
import type { AxiosError } from 'axios';
import type { ErrorResponse } from '~/utils/api/axiosInstance';
import { useState } from 'react';
import type {
  FactoryVisit,
  VisitProductionItem,
  CreateFactoryVisitPayload,
  FactoryVisitFormData,
} from '../types';
import { setDialogue } from '~/utils/store/slices/dialogueSlice';
import { useAppDispatch } from '~/utils/store/hooks/hooks';
import { StatusChip } from '~/components/StatusChip';
import dayjs from '~/utils/date/dayjs';
import { FactoryVisitModal } from './FactoryVisitModal';
import MediaPreview from '~/components/MediaPreview';
import DirectMediaUpload from '~/components/DirectMediaUpload';
import { VisitProductionItemCard } from './visit-production-items/VisitProductionItemCard';
import { ProductionItemModal } from './visit-production-items/VisitProductionItemModal';
import { useForm, Controller } from 'react-hook-form';
import { TextField } from '~/components/form/TextField';
import { DatePickerField } from '~/components/form/DatePickerField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import axios from 'axios';

enum MediaType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
}

interface PresignedUrlResponse {
  path: string;
  presignedUrl: string;
  url: string;
}

interface MediaUpdatePayload {
  media: {
    path: string;
    original_name: string;
    category: string;
    type: MediaType;
  }[];
}

interface FactoryVisitFormProps {
  visit: FactoryVisit;
  projectId: number;
}

const getMediaType = (fileType: string): MediaType => {
  if (fileType.startsWith('image/')) {
    return MediaType.IMAGE;
  } else if (fileType.startsWith('video/')) {
    return MediaType.VIDEO;
  }
  return MediaType.IMAGE;
};

const uploadFileToS3 = async (file: File, presignedUrl: string) => {
  try {
    const uploadInstance = axios.create({
      headers: {
        'Content-Type': file.type,
      },
    });

    await uploadInstance.put(presignedUrl, file);
    return true;
  } catch (error) {
    console.error('Error uploading file to S3:', error);
    return false;
  }
};

export function FactoryVisitForm({ visit, projectId }: FactoryVisitFormProps) {
  const queryClient = useQueryClient();
  const { showToaster } = useToaster();
  const dispatch = useAppDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProductionItemModalOpen, setIsProductionItemModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    formState: { isDirty, errors },
  } = useForm<FactoryVisitFormData>({
    defaultValues: {
      date: visit.date ? dayjs(visit.date).local() : null,
      factoryName: visit.factoryName,
      overallFeedback: visit.overallFeedback,
      issues: visit.issues,
      critical: visit.critical,
      nextVisitDate: visit.nextVisitDate ? dayjs(visit.nextVisitDate).local() : null,
    },
  });

  const { data: productionItems, isLoading: isLoadingProductionItems } = useQuery({
    queryKey: ['factory-visit-production-items', visit.id],
    queryFn: async () => {
      const response = await axiosInstance.get<VisitProductionItem[]>(
        `/v1/factory-visit-production-items/by-factory-visit/${visit.id}`
      );
      return response.data;
    },
  });

  const deleteFactoryVisitMutation = useMutation({
    mutationFn: async () => {
      await axiosInstance.delete(`/v1/factory-visits/${visit.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['factory-visits'] });
      showToaster('Factory visit deleted successfully', 'success');
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      showToaster(error.response?.data?.message || 'Failed to delete factory visit', 'error');
    },
  });

  const updateFactoryVisitMutation = useMutation({
    mutationFn: async (data: CreateFactoryVisitPayload) => {
      const response = await axiosInstance.patch(`/v1/factory-visits/${visit.id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['factory-visits'] });
      showToaster('Factory visit updated successfully', 'success');
      reset(watch());
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      showToaster(error.response?.data?.message || 'Failed to update factory visit', 'error');
    },
  });

  const presignedUrlMutation = useMutation({
    mutationFn: ({
      files,
      category = 'GENERAL_FACTORY_VISIT',
    }: {
      files: File[];
      category?: string;
    }) => {
      const requests = files.map(file => ({
        projectId,
        fileName: file.name,
        contentType: file.type,
        category,
      }));
      return axiosInstance.post<PresignedUrlResponse[]>(
        `/v1/factory-visits/${visit.id}/media/presigned-url`,
        requests
      );
    },
  });

  const updateMediaMutation = useMutation({
    mutationFn: ({ payload }: { payload: MediaUpdatePayload }) => {
      return axiosInstance.post(`/v1/factory-visits/${visit.id}/media`, payload);
    },
  });

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(
      setDialogue({
        show: true,
        title: 'Delete Factory Visit',
        text: 'Are you sure you want to delete this factory visit?',
        acceptLabel: 'Delete',
        acceptColor: 'error.main',
        closable: true,
        onAccept: () => {
          deleteFactoryVisitMutation.mutate();
        },
      } as any)
    );
  };

  const handleMediaUpload = async (files: File[]) => {
    if (files.length === 0) return;

    try {
      showToaster('Starting media upload...', 'info');

      const presignedUrlsResponse = await presignedUrlMutation.mutateAsync({
        files,
      });

      const uploadPromises = files.map((file, index) => {
        const presignedUrlData = presignedUrlsResponse.data[index];
        return uploadFileToS3(file, presignedUrlData.presignedUrl);
      });

      const uploadResults = await Promise.all(uploadPromises);

      if (uploadResults.every(result => result)) {
        showToaster('Media files uploaded successfully', 'success');

        const mediaUpdatePayload: MediaUpdatePayload = {
          media: files.map((file, index) => ({
            path: presignedUrlsResponse.data[index].path,
            original_name: file.name,
            category: 'GENERAL_FACTORY_VISIT',
            type: getMediaType(file.type),
          })),
        };

        await updateMediaMutation.mutateAsync({ payload: mediaUpdatePayload });
        showToaster('Media successfully attached to factory visit', 'success');
        queryClient.invalidateQueries({ queryKey: ['factory-visits'] });
      } else {
        showToaster('Some media files failed to upload', 'error');
      }
    } catch (error) {
      console.error('Error in media upload process:', error);
      showToaster('Failed to process media upload', 'error');
    }
  };

  const onSubmit = (data: FactoryVisitFormData) => {
    const formatted: CreateFactoryVisitPayload = {
      ...data,
      date: data.date ? dayjs(data.date).toDate().toISOString() : null,
      nextVisitDate: data.nextVisitDate ? dayjs(data.nextVisitDate).toDate().toISOString() : null,
    };
    updateFactoryVisitMutation.mutate(formatted);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        sx={{
          overflow: 'hidden',
          mb: 2,
          border: '1px solid #e0e0e0',
          borderRadius: 2,
          position: 'relative',
          p: 2,
          pt: 4,
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
            zIndex: 1,
          }}
        >
          <GoTrash size={16} />
        </Box>

        <Box component="div">
          <Box display="flex" flexDirection="column" gap={2}>
            <Box display="flex" gap={2} flexDirection={{ xs: 'column', sm: 'row' }}>
              <Box sx={{ width: { xs: '100%', sm: '50%' } }}>
                <Controller
                  name="date"
                  control={control}
                  rules={{ required: 'Date of Visit is required' }}
                  render={({ field }) => (
                    <DatePickerField
                      label="Date of Visit"
                      name="date"
                      value={field.value}
                      onChange={field.onChange}
                      error={errors.date?.message}
                      required
                      placeholder="Pick a date"
                    />
                  )}
                />
              </Box>
              <Box sx={{ width: { xs: '100%', sm: '50%' } }}>
                <TextField
                  label="Factory Name / Supplier"
                  name="factoryName"
                  placeholder="Enter factory name or supplier"
                  error={errors.factoryName?.message}
                  register={register}
                  isRequired
                />
              </Box>
            </Box>

            <Box>
              <Typography variant="subHeader" sx={{ ml: 1 }}>
                Overall Feedback
              </Typography>
              <textarea
                {...register('overallFeedback')}
                placeholder="Enter general feedback about the visit"
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
            </Box>

            <Box>
              <Typography variant="subHeader" sx={{ ml: 1 }}>
                Red Flags / Urgent Issues
              </Typography>
              <textarea
                {...register('issues')}
                placeholder="Note any issues that need attention"
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
            </Box>

            <FormControlLabel
              control={
                <Controller
                  name="critical"
                  control={control}
                  render={({ field }) => (
                    <Checkbox {...field} checked={field.value} size="small" sx={{ padding: 0 }} />
                  )}
                />
              }
              label={
                <Typography
                  variant="subHeader"
                  sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 2 }}
                >
                  <BsFlag size={16} color="red" />
                  Flag this visit as critical
                </Typography>
              }
              sx={{ ml: 0, my: 1 }}
            />

            <Box sx={{ width: { xs: '100%', sm: '50%' } }}>
              <Controller
                name="nextVisitDate"
                control={control}
                render={({ field }) => (
                  <DatePickerField
                    label="Next Visit Date (Recommended)"
                    name="nextVisitDate"
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.nextVisitDate?.message}
                    placeholder="Pick a date"
                  />
                )}
              />
            </Box>

            {isDirty && (
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button
                  variant="contained"
                  onClick={handleSubmit(onSubmit)}
                  disabled={updateFactoryVisitMutation.isPending}
                  sx={{ textTransform: 'capitalize' }}
                >
                  {updateFactoryVisitMutation.isPending ? 'Updating...' : 'Update'}
                </Button>
              </Box>
            )}

            <Box sx={{ width: '100%', mt: 2 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="subHeader" sx={{ ml: 1 }}>
                  Factory Visit Media
                </Typography>
              </Box>
              <Box>
                <MediaPreview
                  media={visit.media || []}
                  emptyMessage="No media uploaded yet"
                  entityId={visit.id}
                  mutationPath="factory-visits"
                />
                <Box sx={{ mt: 2 }}>
                  <DirectMediaUpload onUpload={handleMediaUpload} />
                </Box>
              </Box>
            </Box>

            <Box sx={{ p: 2, borderTop: '1px solid #e0e0e0' }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="subHeader">Related Production Items</Typography>
                <Button
                  variant="outlined"
                  sx={{ textTransform: 'none' }}
                  startIcon={<FiPlus />}
                  onClick={() => {
                    setIsProductionItemModalOpen(true);
                  }}
                >
                  Add Production Item
                </Button>
              </Box>

              {isLoadingProductionItems ? (
                <Typography color="text.secondary" variant="caption">
                  Loading production items...
                </Typography>
              ) : productionItems?.length === 0 ? (
                <Typography color="text.secondary" variant="caption">
                  No production items added yet
                </Typography>
              ) : (
                <Box display="flex" flexDirection="column" gap={2}>
                  {productionItems?.map(item => (
                    <VisitProductionItemCard
                      key={item.id}
                      item={item}
                      projectId={projectId}
                    />
                  ))}
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Box>

      <ProductionItemModal
        open={isProductionItemModalOpen}
        onClose={() => setIsProductionItemModalOpen(false)}
        factoryVisitId={visit.id}
        projectId={projectId}
      />
    </LocalizationProvider>
  );
}
