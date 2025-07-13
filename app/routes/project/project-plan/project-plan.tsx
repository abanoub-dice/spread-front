import { Box, Button, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { LineItemForm } from './components/LineItemForm';
import { LineItemSkeleton } from './components/LineItemSkeleton';
import type { LineItem } from './types';
import axiosInstance from '~/utils/api/axiosInstance';
import { Add as AddIcon } from '@mui/icons-material';
import { useState } from 'react';
import LineItemModal from './components/LineItemModal';
import type { UserSummery } from '~/utils/interfaces/user';
import { UserRole } from '~/utils/interfaces/role';

export default function ProjectPlan() {
  const { id } = useParams();
  const [modalOpen, setModalOpen] = useState(false);

  const {
    data: lineItems,
    isLoading: isLoadingLineItems,
    isError: isErrorLineItems,
  } = useQuery<LineItem[]>({
    queryKey: ['line-items', id],
    queryFn: async () => {
      const response = await axiosInstance.get<LineItem[]>(`/v1/projects/${id}/line-items`);
      return response.data;
    },
  });

  return (
    <Box>
      <Box mb={2} display="flex" justifyContent="space-between">
        <Typography variant="h1">Line Items</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setModalOpen(true)}
          sx={{ textTransform: 'capitalize' }}
        >
          Add Line Item
        </Button>
      </Box>
      <LineItemModal open={modalOpen} onClose={() => setModalOpen(false)} projectId={Number(id)} />
      {isLoadingLineItems && (
        <Box display="flex" flexDirection="column" gap={2}>
          <LineItemSkeleton />
          <LineItemSkeleton />
          <LineItemSkeleton />
        </Box>
      )}
      {isErrorLineItems && !lineItems && (
        <Typography color="error">Failed to load line items.</Typography>
      )}
      {lineItems && lineItems.length === 0 && (
        <Typography variant="body1" color="text.secondary" textAlign="center" py={4}>
          No items created yet
        </Typography>
      )}
      {!!lineItems?.length &&
        lineItems.map(item => (
          <Box key={item.id} mb={2}>
            <LineItemForm item={item} projectId={Number(id)} />
          </Box>
        ))}
    </Box>
  );
}

export function meta() {
  return [{ title: 'Project Plan' }, { name: 'description', content: 'Track the project plan' }];
}
