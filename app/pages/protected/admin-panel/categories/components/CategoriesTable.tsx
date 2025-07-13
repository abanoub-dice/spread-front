import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Tooltip,
  Box,
} from '@mui/material';
import { FiEdit } from 'react-icons/fi';
import { GoTrash } from 'react-icons/go';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Category } from '~/utils/interfaces/category';
import { useAppDispatch } from '~/utils/store/hooks/hooks';
import { setDialogue } from '~/utils/store/slices/dialogueSlice';
import axiosInstance from '~/utils/api/axiosInstance';
import { useToaster } from '~/components/Toaster';
import { QUERY_KEYS } from '~/utils/constants/queryKeys';

interface CategoriesTableProps {
  categories: Category[];
  onEdit: (category: Category) => void;
}

export default function CategoriesTable({ categories = [], onEdit }: CategoriesTableProps) {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const { showToaster } = useToaster();

  const deleteMutation = useMutation({
    mutationFn: (categoryId: string) => {
      return axiosInstance.delete(`/v1/categories/${categoryId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.CATEGORIES],
        refetchType: 'all',
      });
      showToaster('Category deleted successfully', 'success');
    },
    onError: error => {
      showToaster('Failed to delete category', 'error');
      console.error('Delete error:', error);
    },
  });

  const handleDelete = (category: Category) => {
    if (!category.id) {
      showToaster('Invalid category ID', 'error');
      return;
    }

    dispatch(
      setDialogue({
        show: true,
        title: 'Delete Category',
        text: (
          <Box>
            Are you sure you want to delete category{' '}
            <Typography
              component="span"
              sx={{
                color: 'primary.main',
                fontWeight: 600,
                display: 'inline',
              }}
            >
              {category.name}
            </Typography>
            ?
          </Box>
        ),
        acceptLabel: 'Delete',
        acceptColor: 'error.main',
        closable: true,
        onAccept: () => {
          deleteMutation.mutate(category.id as string);
        },
      } as any)
    );
  };

  return (
    <Paper>
      <TableContainer sx={{ minHeight: '50vh' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography variant="h3">Name</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h3">Description</Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="h3">Actions</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map(category => (
              <TableRow
                key={category.id}
                sx={{
                  '& td': {
                    py: 1,
                  },
                }}
              >
                <TableCell>
                  <div style={{ maxWidth: 200, overflow: 'hidden' }}>
                    <Typography variant="subHeader" noWrap>
                      {category.name}
                    </Typography>
                    {category.name.length > 20 && (
                      <Tooltip title={category.name}>
                        <div
                          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
                        />
                      </Tooltip>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div style={{ maxWidth: 400, overflow: 'hidden' }}>
                    <Typography variant="subHeader" noWrap>
                      {category.description}
                    </Typography>
                    {category.description && category.description.length > 100 && (
                      <Tooltip title={category.description}>
                        <div
                          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
                        />
                      </Tooltip>
                    )}
                  </div>
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    onClick={() => onEdit(category)}
                    size="small"
                    sx={{
                      '&:hover': {
                        color: 'primary.main',
                      },
                      mr: 1,
                    }}
                  >
                    <FiEdit />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(category)}
                    size="small"
                    sx={{
                      '&:hover': {
                        color: 'error.main',
                      },
                    }}
                  >
                    <GoTrash />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
