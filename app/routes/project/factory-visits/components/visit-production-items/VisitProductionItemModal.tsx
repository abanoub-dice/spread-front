import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  IconButton,
  Typography,
  Button,
  useTheme,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { DropdownField } from '~/components/form/DropdownField';
import CloseIcon from '@mui/icons-material/Close';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '~/utils/api/axiosInstance';
import { 
  VisitProductionItemStatus,
  type VisitProductionItem, 
  type CreateVisitProductionItemPayload, 
  type ProductionItem,
  type VisitProductionItemFormData,
} from '../../types';
import { useToaster } from '~/components/Toaster';
import type { AxiosError } from 'axios';
import type { ErrorResponse } from '~/utils/api/axiosInstance';
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

interface VisitProductionItemModalProps {
  open: boolean;
  onClose: () => void;
  factoryVisitId: number;
  projectId: number;
}

const STATUS_OPTIONS = [
  { value: VisitProductionItemStatus.NOT_STARTED, label: 'Not Started' },
  { value: VisitProductionItemStatus.IN_PROGRESS, label: 'In Progress' },
  { value: VisitProductionItemStatus.DELAYED, label: 'Delayed' },
  { value: VisitProductionItemStatus.COMPLETED, label: 'Completed' },
  { value: VisitProductionItemStatus.READY_TO_DISPATCH, label: 'Ready to Dispatch' },
];

export function ProductionItemModal({
  open,
  onClose,
  factoryVisitId,
  projectId,
}: VisitProductionItemModalProps) {
  const theme = useTheme();
  const { showToaster } = useToaster();
  const queryClient = useQueryClient();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<VisitProductionItemFormData>({
    defaultValues: {
      status: VisitProductionItemStatus.NOT_STARTED,
      productionUpdate: '',
      productionItemId: 0,
    },
  });

  // Add query for available production items
  const { data: availableProductionItems, isLoading: isLoadingProductionItems } = useQuery({
    queryKey: ['project-production-items', projectId],
    queryFn: async () => {
      const response = await axiosInstance.get<ProductionItem[]>(`/v1/projects/${projectId}/production-items`);  
      return response.data;
    },
    enabled: open && !!projectId,
  });

  // Mutation for getting presigned URLs
  const presignedUrlMutation = useMutation({
    mutationFn: ({ 
      files, 
      factoryVisitProductionItemId,
      productionItemId,
      factoryVisitId 
    }: { 
      files: File[]; 
      factoryVisitProductionItemId: number;
      productionItemId: number;
      factoryVisitId: number;
    }) => {
      const requests = files.map(file => ({
        factoryVisitId,
        productionItemId,
        projectId,
        fileName: file.name,
        contentType: file.type,
        category: 'FACTORY_VISIT_PRODUCTION_ITEM',
      }));
      return axiosInstance.post<PresignedUrlResponse[]>(
        `/v1/factory-visit-production-items/${factoryVisitProductionItemId}/media/presigned-url`,
        requests
      );
    },
  });

  // Mutation for updating production item with media
  const updateMediaMutation = useMutation({
    mutationFn: ({ payload, factoryVisitProductionItemId }: { payload: MediaUpdatePayload; factoryVisitProductionItemId: number }) => {
      return axiosInstance.post(`/v1/factory-visit-production-items/${factoryVisitProductionItemId}/media`, payload);
    },
  });

  const createVisitProductionItem = useMutation({
    mutationFn: async (data: CreateVisitProductionItemPayload) => {
      const response = await axiosInstance.post('/v1/factory-visit-production-items', data);
      return response.data;
    },
    onSuccess: async (response) => {
      queryClient.invalidateQueries({ queryKey: ['factory-visit-production-items', factoryVisitId] });
      showToaster('Production item added successfully', 'success');

      if (selectedFiles.length > 0) {
        try {
          showToaster('Starting media upload...', 'info');

          // Get presigned URLs using the new production item ID
          const presignedUrlsResponse = await presignedUrlMutation.mutateAsync({
            files: selectedFiles,
            factoryVisitProductionItemId: response.id,
            productionItemId: response.productionItem.id,
            factoryVisitId: response.factoryVisitId
          });

          // Upload files to S3
          const uploadPromises = selectedFiles.map((file, index) => {
            const presignedUrlData = presignedUrlsResponse.data[index];
            return uploadFileToS3(file, presignedUrlData.presignedUrl);
          });

          const uploadResults = await Promise.all(uploadPromises);

          if (uploadResults.every(result => result)) {
            showToaster('Media files uploaded successfully', 'success');

            // Update production item with media information
            const mediaUpdatePayload: MediaUpdatePayload = {
              media: selectedFiles.map((file, index) => ({
                path: presignedUrlsResponse.data[index].path,
                original_name: file.name,
                category: 'RENDERED',
                type: getMediaType(file.type),
              })),
            };

            await updateMediaMutation.mutateAsync({ 
              payload: mediaUpdatePayload, 
              factoryVisitProductionItemId: response.id 
            });
            showToaster('Media successfully attached to production item', 'success');
            // Revalidate production items query to show updated media
            queryClient.invalidateQueries({ queryKey: ['factory-visit-production-items', factoryVisitId] });
          } else {
            showToaster('Some media files failed to upload', 'error');
          }
        } catch (error) {
          console.error('Error in media upload process:', error);
          showToaster('Failed to process media upload', 'error');
        }
      }

      handleClose();
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      showToaster(error.response?.data?.message || 'Failed to add production item', 'error');
    },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = (data: VisitProductionItemFormData) => {
    const payload: CreateVisitProductionItemPayload = {
      ...data,
      factoryVisitId,
    };
    createVisitProductionItem.mutate(payload);
  };

  const handleMediaUploadComplete = (files: File[]) => {
    setSelectedFiles(files);
  };

  const isPending = createVisitProductionItem.isPending;

  return (
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
            Add Factory Visit Production Item
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
              <Controller
                name="productionItemId"
                control={control}
                rules={{ required: 'Production item is required' }}
                render={({ field }) => (
                  <Box sx={{ width: { xs: '100%', sm: '50%' } }}>
                    <DropdownField
                      {...field}
                      label="Production Item"
                      options={availableProductionItems?.map(item => ({
                        value: String(item.id),
                        label: item.name,
                      })) || []}
                      value={String(field.value)}
                      error={errors.productionItemId?.message}
                      required
                      placeholder="Select a production item"
                    />
                  </Box>
                )}
              />

              <Controller
                name="status"
                control={control}
                rules={{ required: 'Status is required' }}
                render={({ field }) => (
                  <Box sx={{ width: { xs: '100%', sm: '50%' } }}>
                    <DropdownField
                      {...field}
                      label="Status"
                      options={STATUS_OPTIONS}
                      value={field.value}
                      error={errors.status?.message}
                      required
                      placeholder="Select a status"
                    />
                  </Box>
                )}
              />
            </Box>

            <Box>
              <Typography variant="subHeader" sx={{ ml: 1 }}>
                Production Update
                <Box component="span" sx={{ color: 'error.main', ml: 0.5 }}>*</Box>
              </Typography>
              <Controller
                name="productionUpdate"
                control={control}
                rules={{ required: 'Production update is required' }}
                render={({ field }) => (
                  <textarea
                    {...field}
                    placeholder="Enter the production update"
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
                )}
              />
              {errors.productionUpdate && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1 }}>
                  {errors.productionUpdate.message}
                </Typography>
              )}
            </Box>

            <Box>
              <MediaUpload label="Production Images" onFilesSelected={handleMediaUploadComplete} />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 4, pb: 4 }}>
          <Button
            onClick={handleClose}
            color="inherit"
            variant="outlined"
            disabled={
              isPending || 
              presignedUrlMutation.isPending || 
              updateMediaMutation.isPending
            }
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
              isPending || 
              presignedUrlMutation.isPending || 
              updateMediaMutation.isPending
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
            {isPending ? 'Adding...' : 'Add Production Item'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
} 