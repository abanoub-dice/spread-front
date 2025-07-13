import { Box, Typography, Tabs, Tab, Button, Checkbox } from '@mui/material';
import { GoTrash } from 'react-icons/go';
import { Add as AddIcon } from '@mui/icons-material';
import { DropdownField } from '~/components/form/DropdownField';
import { TextField } from '~/components/form/TextField';
import { useForm } from 'react-hook-form';
import type { LineItem, LineItemPayload } from '../types';
import { LineItemStatus } from '../types';
import type { UserSummery } from '~/utils/interfaces/user';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '~/utils/api/axiosInstance';
import { useToaster } from '~/components/Toaster';
import type { AxiosError } from 'axios';
import type { ErrorResponse } from '~/utils/api/axiosInstance';
import { useState } from 'react';
import { setDialogue } from '~/utils/store/slices/dialogueSlice';
import { useAppDispatch } from '~/utils/store/hooks/hooks';
import MediaPreview from '~/components/MediaPreview';
import axios from 'axios';
import DirectMediaUpload from '~/components/DirectMediaUpload';
import AddProductionItemModal from './production-items/ProductionItemModal';
import { ProductionItemCard } from './production-items/ProductionItemCard';
import { StatusChip } from '~/components/StatusChip';
import { FiPlus } from 'react-icons/fi';

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

interface LineItemFormProps {
  item: LineItem;
  projectId: number;
}

interface LineItemFormValues {
  name: string;
  assigned_to: string[];
  notes: string;
  status: LineItemStatus;
}

const statusOptions: { label: string; value: LineItemStatus }[] = [
  { label: 'Not Started', value: LineItemStatus.NOT_STARTED },
  { label: 'In Progress', value: LineItemStatus.IN_PROGRESS },
  { label: 'Delayed', value: LineItemStatus.DELAYED },
  { label: 'Completed', value: LineItemStatus.COMPLETED },
  { label: 'Cancelled', value: LineItemStatus.CANCELLED },
  { label: 'Booked', value: LineItemStatus.BOOKED },
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

const getStatusColor = (status: LineItemStatus): string => {
  switch (status) {
    case LineItemStatus.NOT_STARTED:
      return '#37383a'; // Grey
    case LineItemStatus.IN_PROGRESS:
      return '#29B6F6'; // Light Blue
    case LineItemStatus.DELAYED:
      return '#FFA726'; // Orange
    case LineItemStatus.COMPLETED:
      return '#66BB6A'; // Green
    case LineItemStatus.CANCELLED:
      return '#EF5350'; // Red
    case LineItemStatus.BOOKED:
      return '#AB47BC'; // Purple
    default:
      return '#9E9E9E'; // Default Grey
  }
};

export function LineItemForm({ item, projectId }: LineItemFormProps) {
  const queryClient = useQueryClient();
  const { showToaster } = useToaster();
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState(0);
  const [isProductionItemModalOpen, setIsProductionItemModalOpen] = useState(false);

  const { setValue, watch, reset } = useForm<LineItemFormValues>({
    defaultValues: {
      name: item.name,
      assigned_to: item.assigned_to.map(user => user.id.toString()),
      notes: item.notes,
      status: item.status || LineItemStatus.NOT_STARTED,
    },
  });

  const updateLineItemMutation = useMutation({
    mutationFn: (data: Partial<LineItemPayload>) => {
      return axiosInstance.patch(`/v1/line-items/${item.id}`, data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['line-items'] });
      showToaster('Line item updated successfully', 'success');

      // Reset form after successful update
      reset({
        name: variables.name || item.name,
        assigned_to:
          variables.assigned_to?.map(id => id.toString()) ||
          item.assigned_to.map(user => user.id.toString()),
        notes: variables.notes || item.notes,
        status: variables.status || item.status || LineItemStatus.NOT_STARTED,
      });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      showToaster(error.response?.data?.message || 'Failed to update line item', 'error');
      // Reset the form to previous values on error
      reset({
        name: item.name,
        assigned_to: item.assigned_to.map(user => user.id.toString()),
        notes: item.notes,
        status: item.status || LineItemStatus.NOT_STARTED,
      });
    },
  });

  const deleteLineItemMutation = useMutation({
    mutationFn: () => {
      return axiosInstance.delete(`/v1/line-items/${item.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['line-items'] });
      showToaster('Line item deleted successfully', 'success');
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      showToaster(error.response?.data?.message || 'Failed to delete line item', 'error');
    },
  });

  const handleDelete = (e: React.MouseEvent) => {
    dispatch(
      setDialogue({
        show: true,
        title: 'Delete Line Item',
        text: (
          <Box>
            Are you sure you want to delete line item{' '}
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
          deleteLineItemMutation.mutate();
        },
      } as any)
    );
  };

  const presignedUrlMutation = useMutation({
    mutationFn: ({ files, category }: { files: File[]; category: string }) => {
      const requests = files.map(file => ({
        projectId: projectId,
        fileName: file.name,
        contentType: file.type,
        category,
      }));
      return axiosInstance.post<PresignedUrlResponse[]>(
        `/v1/line-items/${item.id}/media/presigned-url`,
        requests
      );
    },
  });

  const updateMediaMutation = useMutation({
    mutationFn: ({ payload, lineItemId }: { payload: MediaUpdatePayload; lineItemId: number }) => {
      return axiosInstance.post(`/v1/line-items/${lineItemId}/media`, payload);
    },
  });

  const deleteMediaMutation = useMutation({
    mutationFn: ({ mediaIds, lineItemId }: { mediaIds: number[]; lineItemId: number }) => {
      return axiosInstance.delete(`/v1/line-items/${lineItemId}/media`, {
        data: { mediaIds },
      });
    },
  });

  const handleMediaUpload = async (files: File[]) => {
    if (files.length === 0) return;

    try {
      showToaster('Starting media upload...', 'info');

      const category = activeTab === 0 ? 'ACTUAL' : 'RENDERED';

      // If category is RENDERED, delete existing rendered images first
      if (category === 'RENDERED' && item.rendered_images.length > 0) {
        showToaster('Deleting existing version of rendered images...', 'info');
        const renderedMediaIds = item.rendered_images.map(media => media.id);
        await deleteMediaMutation.mutateAsync({
          mediaIds: renderedMediaIds,
          lineItemId: item.id,
        });
        showToaster('Old version of rendered images deleted successfully', 'success');
      }

      // Get presigned URLs
      const presignedUrlsResponse = await presignedUrlMutation.mutateAsync({
        files,
        category,
      });

      // Upload files to S3
      const uploadPromises = files.map((file, index) => {
        const presignedUrlData = presignedUrlsResponse.data[index];
        return uploadFileToS3(file, presignedUrlData.presignedUrl);
      });

      const uploadResults = await Promise.all(uploadPromises);

      if (uploadResults.every(result => result)) {
        showToaster('Media files uploaded successfully', 'success');

        // Update line item with media information
        const mediaUpdatePayload: MediaUpdatePayload = {
          media: files.map((file, index) => ({
            path: presignedUrlsResponse.data[index].path,
            original_name: file.name,
            category,
            type: getMediaType(file.type),
          })),
        };

        await updateMediaMutation.mutateAsync({ payload: mediaUpdatePayload, lineItemId: item.id });
        showToaster('Media successfully attached to line item', 'success');
        // Revalidate line items query to show updated media
        queryClient.invalidateQueries({ queryKey: ['line-items'] });
      } else {
        showToaster('Some media files failed to upload', 'error');
      }
    } catch (error) {
      console.error('Error in media upload process:', error);
      showToaster('Failed to process media upload', 'error');
    }
  };

  return (
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
      <Box>
        <Box display="flex" flexDirection="column" gap={2}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h2">{item.name}</Typography>
            <StatusChip
              label={statusOptions.find(opt => opt.value === item.status)?.label || 'Unknown'}
              color={getStatusColor(item.status)}
              sx={{ marginRight: 2 }}
            />
          </Box>

          <Box sx={{ width: { xs: '50%', md: '30%' } }}>
            <DropdownField
              label="Status"
              name="status"
              options={statusOptions}
              value={watch('status')}
              onChange={e => {
                const newStatus = e.target.value as LineItemStatus;
                setValue('status', newStatus, { shouldDirty: true });
                updateLineItemMutation.mutate({ status: newStatus });
              }}
              placeholder="Select status"
            />
          </Box>
          <Box sx={{ width: { xs: '100%', md: '50%' } }}>
            <Typography variant="subHeader" sx={{ ml: 1 }}>
              Assigned To
            </Typography>
            <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {item.assigned_to.map(user => (
                <StatusChip key={user.id} label={user.name} color="#37383a" />
              ))}
            </Box>
          </Box>

          <Box>
            <Typography variant="subHeader" sx={{ ml: 1 }}>
              Notes
            </Typography>
            <Typography variant="body1" sx={{ mt: 1, ml: 1 }}>
              {item.notes || 'No notes added'}
            </Typography>
          </Box>

          <Box sx={{ width: '100%', mt: 2 }}>
            <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
              <Tab sx={{ textTransform: 'capitalize' }} label="Actual Images" />
              <Tab sx={{ textTransform: 'capitalize' }} label="Rendered Images" />
            </Tabs>

            <Box sx={{ mt: 2, width: { xs: '100%' } }}>
              {activeTab === 0 ? (
                <Box>
                  <Box>
                    <MediaPreview
                      media={item.actual_images}
                      emptyMessage="No actual images uploaded yet"
                      entityId={item.id}
                      mutationPath="line-items"
                    />
                  </Box>
                  <Box sx={{ mt: 2 }}>
                    <DirectMediaUpload onUpload={handleMediaUpload} />
                  </Box>
                </Box>
              ) : (
                <Box>
                  <Box>
                    <MediaPreview
                      media={item.rendered_images}
                      emptyMessage="No rendered images uploaded yet"
                      entityId={item.id}
                      mutationPath="line-items"
                    />
                  </Box>
                  <Box sx={{ mt: 2 }}>
                    <DirectMediaUpload onUpload={handleMediaUpload} />
                  </Box>
                </Box>
              )}
            </Box>
          </Box>

          <Box sx={{ width: { xs: '100%' }, mt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
              <Typography variant="subHeader">Production Items</Typography>
              <Button
                variant="outlined"
                sx={{ textTransform: 'none' }}
                startIcon={<FiPlus />}
                onClick={() => setIsProductionItemModalOpen(true)}
              >
                Add Production Items
              </Button>
            </Box>
            <Box sx={{ mt: 2 }}>
              {item.productionItems && item.productionItems.length > 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {item.productionItems.map(prodItem => (
                    <ProductionItemCard key={prodItem.id} item={prodItem} lineItemId={item.id} />
                  ))}
                </Box>
              ) : (
                <Typography variant="body1" color="text.secondary" textAlign="center" py={4}>
                  No production items added yet
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
      </Box>

      <AddProductionItemModal
        open={isProductionItemModalOpen}
        onClose={() => setIsProductionItemModalOpen(false)}
        lineItemId={item.id}
      />
    </Box>
  );
}
