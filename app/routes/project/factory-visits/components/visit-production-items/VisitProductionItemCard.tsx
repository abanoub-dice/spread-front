import { Box, Typography, Button } from '@mui/material';
import { GoTrash } from 'react-icons/go';
import type { VisitProductionItem } from '../../types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '~/utils/api/axiosInstance';
import { useToaster } from '~/components/Toaster';
import { setDialogue } from '~/utils/store/slices/dialogueSlice';
import { useAppDispatch } from '~/utils/store/hooks/hooks';
import type { AxiosError } from 'axios';
import type { ErrorResponse } from '~/utils/api/axiosInstance';
import { useForm } from 'react-hook-form';
import { DropdownField } from '~/components/form/DropdownField';
import { TextField } from '~/components/form/TextField';
import { VisitProductionItemStatus } from '../../types';
import MediaPreview from '~/components/MediaPreview';
import DirectMediaUpload from '~/components/DirectMediaUpload';
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

interface VisitProductionItemCardProps {
  item: VisitProductionItem;
  projectId: number;
}

const STATUS_OPTIONS = [
  { value: VisitProductionItemStatus.NOT_STARTED, label: 'Not Started' },
  { value: VisitProductionItemStatus.IN_PROGRESS, label: 'In Progress' },
  { value: VisitProductionItemStatus.DELAYED, label: 'Delayed' },
  { value: VisitProductionItemStatus.COMPLETED, label: 'Completed' },
  { value: VisitProductionItemStatus.READY_TO_DISPATCH, label: 'Ready to Dispatch' },
];

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

export function VisitProductionItemCard({ item, projectId }: VisitProductionItemCardProps) {
  const queryClient = useQueryClient();
  const { showToaster } = useToaster();
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { isDirty },
  } = useForm({
    defaultValues: {
      name: item.productionItem.name,
      status: item.status,
      productionUpdate: item.productionUpdate,
    },
  });

  const formValues = watch();

  const updateVisitProductionItem = useMutation({
    mutationFn: async (data: {
      name: string;
      status: VisitProductionItemStatus;
      productionUpdate: string;
    }) => {
      const response = await axiosInstance.patch(`/v1/factory-visit-production-items/${item.id}`, {
        ...data,
        factoryVisitId: item.factoryVisitId,
      });
      return response.data;
    },
    onSuccess: data => {
      queryClient.invalidateQueries({
        queryKey: ['factory-visit-production-items', item.factoryVisitId],
      });
      reset({
        name: item.productionItem.name,
        status: data.status,
        productionUpdate: data.productionUpdate,
      });
      showToaster('Production item updated successfully', 'success');
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      showToaster(error.response?.data?.message || 'Failed to update production item', 'error');
    },
  });

  const deleteProductionItemMutation = useMutation({
    mutationFn: async () => {
      await axiosInstance.delete(`/v1/factory-visit-production-items/${item.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['factory-visit-production-items'] });
      showToaster('Production item deleted successfully', 'success');
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      showToaster(error.response?.data?.message || 'Failed to delete production item', 'error');
    },
  });

  const presignedUrlMutation = useMutation({
    mutationFn: ({
      files,
      category = 'FACTORY_VISIT_PRODUCTION_ITEM',
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
        `/v1/factory-visit-production-items/${item.id}/media/presigned-url`,
        requests
      );
    },
  });

  const updateMediaMutation = useMutation({
    mutationFn: ({ payload }: { payload: MediaUpdatePayload }) => {
      return axiosInstance.post(`/v1/factory-visit-production-items/${item.id}/media`, payload);
    },
  });

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
            category: 'FACTORY_VISIT_PRODUCTION_ITEM',
            type: getMediaType(file.type),
          })),
        };

        await updateMediaMutation.mutateAsync({ payload: mediaUpdatePayload });
        showToaster('Media successfully attached to production item', 'success');
        queryClient.invalidateQueries({ queryKey: ['factory-visit-production-items'] });
      } else {
        showToaster('Some media files failed to upload', 'error');
      }
    } catch (error) {
      console.error('Error in media upload process:', error);
      showToaster('Failed to process media upload', 'error');
    }
  };

  const handleDelete = () => {
    dispatch(
      setDialogue({
        show: true,
        title: 'Delete Production Item',
        text: 'Are you sure you want to delete this production item?',
        acceptLabel: 'Delete',
        acceptColor: 'error.main',
        closable: true,
        onAccept: () => {
          deleteProductionItemMutation.mutate();
        },
      } as any)
    );
  };

  const onSubmit = (data: {
    name: string;
    status: VisitProductionItemStatus;
    productionUpdate: string;
  }) => {
    updateVisitProductionItem.mutate(data);
  };

  return (
    <Box
      sx={{
        p: 2,
        pt: 4,
        border: '1px solid #e0e0e0',
        borderRadius: 1,
        mb: 2,
        position: 'relative',
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
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

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box
            sx={{
              width: { xs: '100%', sm: '50%' },
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
            }}
          >
            <Typography
              variant="h2"
              sx={{
                fontWeight: 700,
              }}
            >
              {item.productionItem.name}
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              flexDirection: { xs: 'column', sm: 'row' },
            }}
          >
            <Box sx={{ width: { xs: '100%', sm: '50%' } }}>
              <DropdownField
                label="Status"
                name="status"
                options={STATUS_OPTIONS}
                value={formValues.status}
                onChange={e => {
                  register('status').onChange(e);
                }}
                placeholder="Select status"
              />
            </Box>
          </Box>
          <Box>
            <Typography variant="subHeader" sx={{ ml: 1 }}>
              Production Update
            </Typography>
            <textarea
              {...register('productionUpdate')}
              placeholder="Enter production update"
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

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
              <Box sx={{ width: { xs: '100%', sm: '50%' } }}>
                <Typography variant="subHeader" sx={{ ml: 1 }}>
                  Category
                </Typography>
                <Typography variant="body1" sx={{ ml: 1 }}>
                  {item.productionItem.category.name}
                </Typography>
              </Box>
              <Box sx={{ width: { xs: '100%', sm: '50%' } }}>
                <Typography variant="subHeader" sx={{ ml: 1 }}>
                  Quantity
                </Typography>
                <Typography variant="body1" sx={{ ml: 1 }}>
                  {item.productionItem.quantity}
                </Typography>
              </Box>
            </Box>

            <Box>
              <Typography variant="subHeader" sx={{ ml: 1 }}>
                Description
              </Typography>
              <Typography variant="body1" sx={{ ml: 1 }}>
                {item.productionItem.description}
              </Typography>
            </Box>
          </Box>

          {isDirty && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button
                type="submit"
                variant="contained"
                disabled={updateVisitProductionItem.isPending}
                sx={{
                  textTransform: 'capitalize',
                  '&:hover': {
                    transform: 'translateY(-1px)',
                    transition: 'all 0.2s ease-in-out',
                  },
                }}
              >
                {updateVisitProductionItem.isPending ? 'Updating...' : 'Update'}
              </Button>
            </Box>
          )}

          <Box sx={{ width: '100%', mt: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="subHeader" sx={{ ml: 1 }}>
                Production Item Media
              </Typography>
            </Box>
            <Box>
              <MediaPreview
                media={item.media || []}
                emptyMessage="No media uploaded yet"
                entityId={item.id}
                mutationPath="factory-visit-production-items"
              />
              <Box sx={{ mt: 2 }}>
                <DirectMediaUpload onUpload={handleMediaUpload} />
              </Box>
            </Box>
          </Box>
        </Box>
      </form>
    </Box>
  );
}
