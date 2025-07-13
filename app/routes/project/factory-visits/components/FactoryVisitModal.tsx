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
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { TextField } from '~/components/form/TextField';
import { DatePickerField } from '~/components/form/DatePickerField';
import CloseIcon from '@mui/icons-material/Close';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from '~/utils/date/dayjs';
import { BsFlag } from 'react-icons/bs';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  type CreateFactoryVisitPayload,
  type FactoryVisitFormData,
  type FactoryVisit,
} from '../types';
import { useToaster } from '~/components/Toaster';
import type { AxiosError } from 'axios';
import { axiosInstance, type ErrorResponse } from '~/utils/api/axiosInstance';
import { useState } from 'react';
import MediaUpload from '~/components/MediaUpload';
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

interface FactoryVisitModalProps {
  open: boolean;
  onClose: () => void;
  projectId: number;
  visit?: FactoryVisit;
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

export function FactoryVisitModal({ open, onClose, projectId, visit }: FactoryVisitModalProps) {
  const theme = useTheme();
  const { showToaster } = useToaster();
  const queryClient = useQueryClient();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<FactoryVisitFormData>({
    mode: 'onChange',
    defaultValues: visit
      ? {
          date: dayjs(visit.date),
          factoryName: visit.factoryName,
          overallFeedback: visit.overallFeedback,
          issues: visit.issues,
          critical: visit.critical,
          nextVisitDate: visit.nextVisitDate ? dayjs(visit.nextVisitDate) : null,
        }
      : {
          date: null,
          factoryName: '',
          overallFeedback: '',
          issues: '',
          critical: false,
          nextVisitDate: null,
        },
  });

  const createFactoryVisit = useMutation({
    mutationFn: async (data: CreateFactoryVisitPayload) => {
      const response = await axiosInstance.post(`/v1/factory-visits`, data); //TODO: /projects/${projectId}
      return response.data;
    },
    onSuccess: async response => {
      if (!visit && selectedFiles.length > 0) {
        try {
          showToaster('Starting media upload...', 'info');

          // Get presigned URLs using the new factory visit ID
          const presignedUrlsResponse = await presignedUrlMutation.mutateAsync({
            files: selectedFiles,
            factoryVisitId: response.id,
          });

          // Upload files to S3
          const uploadPromises = selectedFiles.map((file, index) => {
            const presignedUrlData = presignedUrlsResponse.data[index];
            return uploadFileToS3(file, presignedUrlData.presignedUrl);
          });

          const uploadResults = await Promise.all(uploadPromises);

          if (uploadResults.every(result => result)) {
            showToaster('Media files uploaded successfully', 'success');

            // Update factory visit with media information
            const mediaUpdatePayload: MediaUpdatePayload = {
              media: selectedFiles.map((file, index) => ({
                path: presignedUrlsResponse.data[index].path,
                original_name: file.name,
                category: 'GENERAL_FACTORY_VISIT',
                type: getMediaType(file.type),
              })),
            };

            await updateMediaMutation.mutateAsync({
              payload: mediaUpdatePayload,
              factoryVisitId: response.id,
            });
            showToaster('Media successfully attached to factory visit', 'success');
          } else {
            showToaster('Some media files failed to upload', 'error');
          }
        } catch (error) {
          console.error('Error in media upload process:', error);
          showToaster('Failed to process media upload', 'error');
        }
      }

      queryClient.invalidateQueries({ queryKey: ['factory-visits'] });
      showToaster('Factory visit created successfully', 'success');
      handleClose();
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      showToaster(error.response?.data?.message || 'Failed to create factory visit', 'error');
    },
  });

  const presignedUrlMutation = useMutation({
    mutationFn: ({ files, factoryVisitId }: { files: File[]; factoryVisitId: number }) => {
      const requests = files.map(file => ({
        projectId,
        fileName: file.name,
        contentType: file.type,
        category: 'GENERAL_FACTORY_VISIT',
      }));
      return axiosInstance.post<PresignedUrlResponse[]>(
        `/v1/factory-visits/${factoryVisitId}/media/presigned-url`,
        requests
      );
    },
  });

  const updateMediaMutation = useMutation({
    mutationFn: ({
      payload,
      factoryVisitId,
    }: {
      payload: MediaUpdatePayload;
      factoryVisitId: number;
    }) => {
      return axiosInstance.post(`/v1/factory-visits/${factoryVisitId}/media`, payload);
    },
  });

  const updateFactoryVisit = useMutation({
    mutationFn: async (data: CreateFactoryVisitPayload) => {
      const response = await axiosInstance.patch(`/v1/factory-visits/${visit?.id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['factory-visits'] });
      showToaster('Factory visit updated successfully', 'success');
      handleClose();
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      showToaster(error.response?.data?.message || 'Failed to update factory visit', 'error');
    },
  });

  const handleClose = () => {
    reset();
    setSelectedFiles([]);
    onClose();
  };

  const onSubmit = (data: FactoryVisitFormData) => {
    const formatted: CreateFactoryVisitPayload = {
      ...data,
      date: data.date ? dayjs(data.date).utc().toISOString() : null,
      nextVisitDate: data.nextVisitDate ? dayjs(data.nextVisitDate).utc().toISOString() : null,
    };

    if (visit) {
      updateFactoryVisit.mutate(formatted);
    } else {
      createFactoryVisit.mutate({ ...formatted, projectId });
    }
  };

  const handleMediaUploadComplete = (files: File[]) => {
    setSelectedFiles(files);
  };

  const isPending =
    createFactoryVisit.isPending ||
    updateFactoryVisit.isPending ||
    presignedUrlMutation.isPending ||
    updateMediaMutation.isPending;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit(onSubmit)}>
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
              {visit ? 'Edit Factory Visit' : 'Factory Visit Report'}
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
            <Box sx={{ mt: 1, width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
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
                    padding: '12px 16px',
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
              {!visit && (
                <Box>
                  <MediaUpload
                    label="Factory Visit Images"
                    onFilesSelected={handleMediaUploadComplete}
                  />
                </Box>
              )}
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 4, pb: 4 }}>
            <Button
              onClick={handleClose}
              color="inherit"
              variant="outlined"
              disabled={isPending}
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
              disabled={isPending}
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
              {isPending
                ? visit
                  ? 'Updating...'
                  : 'Adding...'
                : visit
                ? 'Update Factory Visit'
                : 'Add Factory Visit'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </LocalizationProvider>
  );
}
