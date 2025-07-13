import { Box, Typography, Checkbox, Fade, IconButton, Tooltip } from '@mui/material';
import { StatusChip } from '~/components/StatusChip';
import type { ActionItem } from '../types';
import dayjs from '~/utils/date/dayjs';
import utc from 'dayjs/plugin/utc';
import { FiEdit } from 'react-icons/fi';
import { GoTrash } from 'react-icons/go';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '~/utils/api/axiosInstance';
import { useToaster } from '~/components/Toaster';
import { useAppDispatch } from '~/utils/store/hooks/hooks';
import { setDialogue } from '~/utils/store/slices/dialogueSlice';
import type { AxiosError } from 'axios';
import type { ErrorResponse } from '~/utils/api/axiosInstance';

interface ActionItemCardProps {
  item: ActionItem;
  completed?: boolean;
  onCheck: (id: number) => void;
  animation?: boolean;
  onEdit?: (item: ActionItem) => void;
}

export default function ActionItemCard({
  item,
  completed,
  onCheck,
  animation,
  onEdit,
}: ActionItemCardProps) {
  const queryClient = useQueryClient();
  const { showToaster } = useToaster();
  const dispatch = useAppDispatch();
  dayjs.extend(utc);
  const dueDate = dayjs.utc(item.dueDate).local();
  const dueStatus = dueDate.isSame(dayjs(), 'day')
    ? ' (Today)'
    : dueDate.isBefore(dayjs(), 'day')
    ? ' (Past Due)'
    : '';

  const toggleCompletionMutation = useMutation({
    mutationFn: () => {
      return axiosInstance.patch(`/v1/action-items/${item.id}`, {
        completed: !completed,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['action-items'] });
      showToaster(`Action item ${completed ? 'reopened' : 'completed'} successfully`, 'success');
      onCheck(item.id);
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      showToaster(error.response?.data?.message || 'Failed to update action item status', 'error');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => {
      return axiosInstance.delete(`/v1/action-items/${item.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['action-items'] });
      showToaster('Action item deleted successfully', 'success');
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      showToaster(error.response?.data?.message || 'Failed to delete action item', 'error');
    },
  });

  const handleDelete = () => {
    dispatch(
      setDialogue({
        show: true,
        title: 'Delete Action Item',
        text: 'Are you sure you want to delete this action item ?',
        acceptLabel: 'Delete',
        acceptColor: 'error.main',
        closable: true,
        onAccept: () => {
          deleteMutation.mutate();
        },
      } as any)
    );
  };

  return (
    <Fade in={animation} timeout={500}>
      <Box
        display="flex"
        flexDirection="column"
        gap={{ xs: 1, sm: 2 }}
        p={{ xs: 1, sm: 2 }}
        borderRadius={2}
        boxShadow={1}
        bgcolor={completed ? 'grey.100' : 'background.paper'}
        sx={{
          transition: 'box-shadow 0.3s, background 0.3s',
          minHeight: { xs: '80px', sm: '100px' }
        }}
      >
        <Box display="flex" alignItems="flex-start" gap={{ xs: 1, sm: 2 }}>
          <Checkbox 
            checked={!!completed} 
            onChange={() => toggleCompletionMutation.mutate()} 
            sx={{ 
              mt: 0,
              padding: 0,
              '& .MuiSvgIcon-root': {
                fontSize: { xs: '1rem', sm: '1.2rem' }
              },
              marginRight: { xs: 0.5, sm: 1 }
            }} 
          />
          <Typography
            variant="subHeader"
            fontWeight={600}
            sx={{ textDecoration: completed ? 'line-through' : 'none', display: 'block' }}
          >
            {item.description}
          </Typography>
        </Box>
        <Box>
          <Box display="flex" gap={1} alignItems="center" my={1}>
            <StatusChip key={item.assignedUser.id} label={item.assignedUser.name} color="#1976d2" />
          </Box>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            {completed ? (
              <Typography variant="caption">Due: {dueDate.format('MM/DD/YYYY hh:mm A')}</Typography>
            ) : (
              <Typography
                variant="caption"
                color={dueStatus.includes('Past Due') ? 'error' : 'text.secondary'}
              >
                Due: {dueDate.format('MM/DD/YYYY hh:mm A')}
                {dueStatus}
              </Typography>
            )}
            {!completed && (
              <Box display="flex" gap={1}>
                <Tooltip title="Edit Action Item">
                  <IconButton
                    size="small"
                    onClick={() => onEdit?.(item)}
                    sx={{
                      fontSize: '16px',
                      transition: 'color 0.2s',
                      '&:hover': {
                        color: 'primary.main',
                      },
                    }}
                  >
                    <FiEdit />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete Action Item">
                  <IconButton
                    size="small"
                    onClick={handleDelete}
                    sx={{
                      fontSize: '16px',
                      transition: 'color 0.2s',
                      '&:hover': {
                        color: 'error.main',
                      },
                    }}
                  >
                    <GoTrash />
                  </IconButton>
                </Tooltip>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Fade>
  );
}
