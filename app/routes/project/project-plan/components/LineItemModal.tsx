import { useEffect, useState } from 'react';
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
import { useForm, type SubmitHandler, useFieldArray } from 'react-hook-form';
import { TextField } from '~/components/form/TextField';
import { DropdownField } from '~/components/form/DropdownField';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '~/utils/api/axiosInstance';
import { useToaster } from '~/components/Toaster';
import type { AxiosError } from 'axios';
import type { ErrorResponse } from '~/utils/api/axiosInstance';
import type { UserSummery } from '~/utils/interfaces/user';
import MediaUpload from '~/components/MediaUpload';
import axios from 'axios';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import { GoTrash } from 'react-icons/go';
import { QUERY_KEYS } from '~/utils/constants/queryKeys';
import { CategoriesType } from '~/utils/interfaces/category';
import QuantityInput from '~/components/form/QuantityInput';
import ProductionItemForm from './production-items/ProductionItemForm';

enum MediaType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
}

interface LineItemFormData {
  name: string;
  assigned_to: string[];
  notes: string;
  includeProductionItems: boolean;
  productionItems: Array<{
    name: string;
    description: string;
    quantity: number;
    categoryId: string;
  }>;
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

interface LineItemModalProps {
  open: boolean;
  onClose: () => void;
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

export default function LineItemModal({ open, onClose, projectId }: LineItemModalProps) {
  const theme = useTheme();
  const queryClient = useQueryClient();
  const { showToaster } = useToaster();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: { [key: string]: string };
  }>({});

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

  const { data: categories } = useQuery({
    queryKey: [QUERY_KEYS.CATEGORIES, CategoriesType.PRODUCTION_ITEM],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `/v1/categories?limit=0&type=${CategoriesType.PRODUCTION_ITEM}`
      );
      return response.data.categories;
    },
  });

  useEffect(() => {
    if (isErrorUsers) {
      showToaster('Could not fetch required data. Please try again.', 'error');
      handleClose();
    }
  }, [isErrorUsers, showToaster]);

  // Line Item Form
  const {
    register: registerLineItem,
    handleSubmit: handleLineItemSubmit,
    reset: resetLineItem,
    setValue: setLineItemValue,
    watch: watchLineItem,
    formState: { errors: lineItemErrors },
  } = useForm<LineItemFormData>({
    mode: 'onChange',
    defaultValues: {
      assigned_to: [],
      includeProductionItems: false,
    },
  });

  // Production Items Form
  const {
    control: productionItemsControl,
    register: registerProductionItem,
    handleSubmit: handleProductionItemsSubmit,
    setValue: setProductionItemValue,
    watch: watchProductionItem,
    reset: resetProductionItems,
    formState: { errors: productionItemErrors },
    getValues: getProductionItemValues,
  } = useForm<{
    items: Array<{
      name: string;
      description: string;
      quantity: number;
      categoryId: string;
    }>;
  }>({
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
  });

  const { fields, append, remove } = useFieldArray({
    control: productionItemsControl,
    name: 'items',
  });

  const formValues = watchLineItem();

  useEffect(() => {
    if (!open) {
      resetLineItem();
      resetProductionItems();
    }
  }, [open, resetLineItem, resetProductionItems]);

  const handleClose = () => {
    resetLineItem();
    resetProductionItems();
    setValidationErrors({});
    setSelectedFiles([]);
    onClose();
  };

  // Mutation for getting presigned URLs
  const presignedUrlMutation = useMutation({
    mutationFn: ({ files, lineItemId }: { files: File[]; lineItemId: number }) => {
      const requests = files.map(file => ({
        projectId,
        fileName: file.name,
        contentType: file.type,
        category: 'RENDERED',
        lineItemId,
      }));
      return axiosInstance.post<PresignedUrlResponse[]>(
        `/v1/line-items/${lineItemId}/media/presigned-url`,
        requests
      );
    },
  });

  // Mutation for updating line item with media
  const updateMediaMutation = useMutation({
    mutationFn: ({ payload, lineItemId }: { payload: MediaUpdatePayload; lineItemId: number }) => {
      return axiosInstance.post(`/v1/line-items/${lineItemId}/media`, payload);
    },
  });

  // Main line item creation mutation
  const createLineItemMutation = useMutation({
    mutationFn: async (data: LineItemFormData) => {
      const response = await axiosInstance.post(`/v1/projects/${projectId}/line-items`, {
        ...data,
        assigned_to: data.assigned_to.map(id => Number(id)),
        projectId,
      });
      return response.data;
    },
    onSuccess: async (response, data) => {
      showToaster('Line item created successfully', 'success');

      // Create production items if checkbox is checked and items exist
      if (data.includeProductionItems && getProductionItemValues().items.length > 0) {
        const productionItemsData = getProductionItemValues();
        const productionItems = productionItemsData.items.map(item => ({
          ...item,
          lineItemId: response.id,
        }));

        await createProductionItemsMutation.mutateAsync({
          items: productionItems,
          lineItemId: response.id,
        });
      }

      if (selectedFiles.length > 0) {
        try {
          showToaster('Starting media upload...', 'info');

          // Get presigned URLs using the new line item ID
          const presignedUrlsResponse = await presignedUrlMutation.mutateAsync({
            files: selectedFiles,
            lineItemId: response.id,
          });

          // Upload files to S3
          const uploadPromises = selectedFiles.map((file, index) => {
            const presignedUrlData = presignedUrlsResponse.data[index];
            return uploadFileToS3(file, presignedUrlData.presignedUrl);
          });

          const uploadResults = await Promise.all(uploadPromises);

          if (uploadResults.every(result => result)) {
            showToaster('Media files uploaded successfully', 'success');

            // Update line item with media information
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
              lineItemId: response.id,
            });
            showToaster('Media successfully attached to line item', 'success');
          } else {
            showToaster('Some media files failed to upload', 'error');
          }
        } catch (error) {
          console.error('Error in media upload process:', error);
          showToaster('Failed to process media upload', 'error');
        }
      }

      // Reset both forms after successful submission
      resetLineItem();
      resetProductionItems();
      setValidationErrors({});
      queryClient.invalidateQueries({ queryKey: ['line-items'] });
      handleClose();
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      showToaster(error.response?.data?.message || 'Failed to create line item', 'error');
    },
  });

  // Production items creation mutation
  const createProductionItemsMutation = useMutation({
    mutationFn: async ({
      items,
      lineItemId,
    }: {
      items: LineItemFormData['productionItems'];
      lineItemId: number;
    }) => {
      const response = await axiosInstance.post(
        `/v1/production-items`,
        items.map(item => ({
          ...item,
          lineItemId,
        }))
      );
      return response.data;
    },
  });

  const validateItems = (data: {
    items: Array<{
      name: string;
      description: string;
      quantity: number;
      categoryId: string;
    }>;
  }) => {
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

  const handleFormSubmit: SubmitHandler<LineItemFormData> = async data => {
    try {
      // Validate production items if they are included
      if (data.includeProductionItems) {
        const productionItemsData = getProductionItemValues();
        const isValid = validateItems(productionItemsData);
        if (!isValid) {
          showToaster('Please fill in all required fields for production items', 'error');
          return;
        }
      }

      // Create line item first
      await createLineItemMutation.mutateAsync(data);
    } catch (error) {
      console.error('Error in form submission:', error);
      showToaster('Failed to create line item and associated items', 'error');
    }
  };

  const handleMediaUploadComplete = (files: File[]) => {
    setSelectedFiles(files);
  };

  const addNewProductionItem = () => {
    append({
      name: '',
      description: '',
      quantity: 1,
      categoryId: '',
    });
  };

  const handleQuantityChange = (value: number, index: number) => {
    setProductionItemValue(`items.${index}.quantity`, value);
  };

  const userOptions =
    projectUsers?.map(user => ({
      label: user.name,
      value: user.id.toString(),
    })) ?? [];

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleLineItemSubmit(handleFormSubmit)}>
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
            Add New Line Item
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
          {isLoadingUsers ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: 200,
              }}
            >
              <Typography>Loading users...</Typography>
            </Box>
          ) : (
            <Box sx={{ mt: 1, width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Name"
                name="name"
                placeholder="Enter line item name"
                error={lineItemErrors.name?.message}
                register={registerLineItem}
                isRequired
              />
              <DropdownField
                label="Assigned To"
                name="assigned_to"
                options={userOptions}
                value={formValues.assigned_to}
                onChange={e => setLineItemValue('assigned_to', e.target.value as string[])}
                error={lineItemErrors.assigned_to?.message}
                multiple
                placeholder="Select users"
                required
              />
              <Box>
                <Typography variant="subHeader" sx={{ ml: 1 }}>
                  Notes
                </Typography>
                <textarea
                  {...registerLineItem('notes')}
                  placeholder="Add notes here..."
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
                {lineItemErrors.notes && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1 }}>
                    {lineItemErrors.notes.message}
                  </Typography>
                )}
              </Box>
              <Box>
                <MediaUpload label="Rendered Images" onFilesSelected={handleMediaUploadComplete} />
              </Box>

              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    checked={formValues.includeProductionItems}
                    onChange={e => setLineItemValue('includeProductionItems', e.target.checked)}
                  />
                }
                label={<Typography variant="subHeader">Add Production Items</Typography>}
              />

              {formValues.includeProductionItems && (
                <Box>
                  <Box mb={1}>
                    <Typography variant="subHeader">Production Items</Typography>
                  </Box>
                  {fields.map((field, index) => (
                    <Box key={field.id} sx={{ my: 2 }}>
                      <ProductionItemForm
                        index={index}
                        register={registerProductionItem}
                        setValue={setProductionItemValue}
                        watch={watchProductionItem}
                        onRemove={() => remove(index)}
                        isSubmitting={createLineItemMutation.isPending}
                        validationErrors={validationErrors[index]}
                        categories={categories || []}
                        canRemove={fields.length > 1}
                        onQuantityChange={value => handleQuantityChange(value, index)}
                      />
                    </Box>
                  ))}
                  <Button
                    startIcon={<AddIcon />}
                    onClick={addNewProductionItem}
                    variant="outlined"
                    sx={{
                      alignSelf: 'flex-start',
                      textTransform: 'capitalize',
                      mt: 1,
                    }}
                  >
                    Add Another Item
                  </Button>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 4, pb: 4 }}>
          <Button
            onClick={handleClose}
            color="inherit"
            variant="outlined"
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
              !formValues.name ||
              formValues.assigned_to.length === 0 ||
              createLineItemMutation.isPending ||
              presignedUrlMutation.isPending ||
              updateMediaMutation.isPending ||
              createProductionItemsMutation.isPending
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
            Add Line Item
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
