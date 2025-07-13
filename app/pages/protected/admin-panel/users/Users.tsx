import { useState } from 'react';
import { Box, Typography, Button, Stack } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import UsersTable from './components/UsersTable';
import UsersTableSkeleton from './components/UsersTableSkeleton';
import UserModal from './components/UserModal';
import AdminChangePasswordModal from './components/AdminChangePasswordModal';
import Pagination from '~/components/Pagination';
import type { User, UsersResponse, UserFormData } from '../../../utils/interfaces/user';
import axiosInstance from '~/utils/api/axiosInstance';
import { useToaster } from '~/components/Toaster';
import { useAppSelector } from '~/utils/store/hooks/hooks';
import { setDialogue } from '~/utils/store/slices/dialogueSlice';

export default function Users() {
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | undefined>();
  const [modalMode, setModalMode] = useState<'create' | 'update'>('create');
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { showToaster } = useToaster();
  const currentUser = useAppSelector(state => state.user.data.user);

  const { data, isLoading } = useQuery({
    queryKey: ['users', page],
    queryFn: async () => {
      const response = await axiosInstance.get<UsersResponse>(`/v1/admin/users?page=${page}`);
      return response.data;
    },
  });

  const users = data?.users || [];
  const totalPages = data?.totalPages || 1;

  const createMutation = useMutation({
    mutationFn: (data: UserFormData) => {
      const { confirmPassword, ...userData } = data;
      return axiosInstance.post('/v1/admin/users', userData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['users'],
        refetchType: 'all',
      });
      showToaster('User created successfully', 'success');
      setModalOpen(false);
    },
    onError: error => {
      showToaster('Failed to create user', 'error');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: UserFormData) => {
      if (!selectedUser) throw new Error('No user selected');
      const { confirmPassword, password, ...userData } = data;
      return axiosInstance.put(`/v1/admin/users/${selectedUser.id}`, userData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['users'],
        refetchType: 'all',
      });
      showToaster('User updated successfully', 'success');
      setModalOpen(false);
      setSelectedUser(undefined);
    },
    onError: error => {
      showToaster('Failed to update user', 'error');
      console.error('Error updating user:', error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (userId: string) => {
      return axiosInstance.delete(`/v1/admin/users/${userId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['users'],
        refetchType: 'all',
      });
      showToaster('User deleted successfully', 'success');
    },
    onError: error => {
      showToaster('Failed to delete user', 'error');
    },
  });

  const handleCreateClick = () => {
    setModalMode('create');
    setSelectedUser(undefined);
    setModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setModalMode('update');
    setSelectedUser(user);
    setModalOpen(true);
  };

  const handleDeleteUser = (user: User) => {
    if (currentUser && user.id === currentUser.id) {
      showToaster('You cannot delete your own account', 'error');
      return;
    }

    dispatch(
      setDialogue({
        show: true,
        title: 'Delete User',
        text: (
          <Box>
            Are you sure you want to delete user{' '}
            <Typography
              component="span"
              sx={{
                color: 'primary.main',
                fontWeight: 600,
                display: 'inline',
              }}
            >
              {user.firstName} {user.lastName}
            </Typography>
            ?
          </Box>
        ),
        acceptLabel: 'Delete',
        acceptColor: 'error.main',
        closable: true,
        onAccept: () => {
          deleteMutation.mutate(user.id.toString());
        },
      } as any)
    );
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedUser(undefined);
  };

  const handleModalSubmit = (data: UserFormData) => {
    if (modalMode === 'update') {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const handleChangePassword = (user: User) => {
    setSelectedUser(user);
    setPasswordModalOpen(true);
  };

  const handlePasswordModalClose = () => {
    setPasswordModalOpen(false);
    setSelectedUser(undefined);
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h1" component="h1" color="text.primary">
          Users
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateClick}
          sx={{ textTransform: 'capitalize' }}
        >
          Add User
        </Button>
      </Stack>

      {isLoading ? (
        <UsersTableSkeleton />
      ) : (
        <>
          <UsersTable 
            users={users} 
            onEdit={handleEditUser} 
            onDelete={handleDeleteUser} 
            onChangePassword={handleChangePassword}
            currentUserId={currentUser?.id}
          />
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}

      <UserModal
        open={modalOpen}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
        user={selectedUser}
        mode={modalMode}
      />

      <AdminChangePasswordModal
        open={passwordModalOpen}
        onClose={handlePasswordModalClose}
        userId={selectedUser?.id.toString() || ''}
      />
    </Box>
  );
}

export function meta() {
  return [
    { title: 'Admin Panel - Users' },
    {
      name: 'description',
      content: 'Manage (create/ update / delete) users for the projects',
    },
  ];
}
