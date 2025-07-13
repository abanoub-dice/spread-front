import { Box, Button, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Add as AddIcon } from '@mui/icons-material';
import { useState } from 'react';
import axiosInstance from '~/utils/api/axiosInstance';
import type { UsersResponse } from '~/utils/interfaces/user';
import { UserRole } from '~/utils/interfaces/role';
import type { User } from '~/utils/interfaces/user';
import ActionItemModal from './components/ActionItemModal';
import ActionItemsList from './components/ActionItemsList';
import { useToaster } from '~/components/Toaster';
import ActionItemsSkeleton from './components/ActionItemsSkeleton';
import type { ActionItem } from './types';

export default function ActionItems() {
  const { id } = useParams();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ActionItem | null>(null);
  const { showToaster } = useToaster();

  const {
    data: actionItems,
    isLoading: isLoadingActionItems,
    isError: isErrorActionItems,
  } = useQuery<ActionItem[]>({
    queryKey: ['action-items', id],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get<ActionItem[]>(`/v1/projects/${id}/action-items`);
        return response.data;
      } catch (error) {
        showToaster('Failed to load action items. Please try again.', 'error');
        throw error;
      }
    },
  });

  const handleEdit = (item: ActionItem) => {
    setEditingItem(item);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditingItem(null);
  };

  const openItems = actionItems?.filter(item => !item.completed) ?? [];
  const completedItems = actionItems?.filter(item => item.completed) ?? [];

  if (isLoadingActionItems) {
    return (
      <Box>
        <Box mb={2} display="flex" justifyContent="space-between">
          <Typography variant="h1">Action Items</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setModalOpen(true)}
            sx={{ textTransform: 'capitalize' }}
          >
            Add Action Item
          </Button>
        </Box>
        <ActionItemsSkeleton />
      </Box>
    );
  }

  if (isErrorActionItems) {
    return (
      <Box>
        <Box mb={2} display="flex" justifyContent="space-between">
          <Typography variant="h1">Action Items</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setModalOpen(true)}
            sx={{ textTransform: 'capitalize' }}
          >
            Add Action Item
          </Button>
        </Box>
        <Typography color="error" textAlign="center" py={4}>
          Failed to load data. Please try again.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box mb={2} display="flex" justifyContent="space-between">
        <Typography variant="h1">Action Items</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setModalOpen(true)}
          sx={{ textTransform: 'capitalize' }}
        >
          Add Action Item
        </Button>
      </Box>
      {id && (
        <ActionItemModal
          open={modalOpen}
          onClose={handleModalClose}
          actionItem={editingItem}
          projectId={Number(id)}
        />
      )}
      {!actionItems || actionItems.length === 0 ? (
        <Typography variant="body1" color="text.secondary" textAlign="center" py={4}>
          No action items created yet
        </Typography>
      ) : (
        <Box display="flex" gap={4}>
          <ActionItemsList
            listLabel="Open Items"
            items={openItems}
            completed={false}
            onEdit={handleEdit}
          />
          <ActionItemsList listLabel="Completed Items" items={completedItems} completed={true} />
        </Box>
      )}
    </Box>
  );
}

export function meta() {
  return [{ title: 'Action Items' }, { name: 'description', content: 'Track the action items' }];
}
