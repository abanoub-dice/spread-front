import { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { CategoriesType, categoriesTypesArray, type Category } from '~/utils/interfaces/category';
import CategoryModal from './components/CategoryModal';
import CategoriesTable from './components/CategoriesTable';
import CategoriesTableSkeleton from './components/CategoriesTableSkeleton';
import Pagination from '~/components/shared/Pagination';
import axiosInstance from '~/utils/api/axiosInstance';
import { QUERY_KEYS } from '~/utils/constants/queryKeys';
import { useParams, useNavigate } from 'react-router';

export default function Categories() {
  const { type: categoriesType } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (categoriesType && !categoriesTypesArray.includes(categoriesType as CategoriesType)) {
      navigate('/admin-panel/categories/project', { replace: true });
    }
  }, [categoriesType, navigate]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | undefined>();
  const [modalMode, setModalMode] = useState<'create' | 'update'>('create');
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.CATEGORIES, currentPage, categoriesType],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `/v1/categories?page=${currentPage}&type=${categoriesType}`
      );
      return response.data;
    },
  });

  const categories = data?.categories || [];
  const totalPages = data?.totalPages || 1;

  const handleCreateClick = () => {
    setModalMode('create');
    setSelectedCategory(undefined);
    setIsModalOpen(true);
  };

  const handleEditClick = (category: Category) => {
    setModalMode('update');
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedCategory(undefined);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h1" component="h1" color="text.primary">
          {categoriesType === CategoriesType.PROJECT ? 'Projects' : 'Production Items'} Categories
        </Typography>
        <Button
          variant="contained"
          sx={{ textTransform: 'capitalize' }}
          startIcon={<AddIcon />}
          onClick={handleCreateClick}
        >
          Add {categoriesType === 'items' ? 'Item' : 'Project'} Category
        </Button>
      </Box>

      {isLoading ? (
        <CategoriesTableSkeleton />
      ) : categories.length === 0 ? (
        <Box
          sx={{
            textAlign: 'center',
            height: '50vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Typography variant="h2" component="h2" color="text.primary" gutterBottom>
            No Categories Yet!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Start creating new categories to organize your projects better.
          </Typography>
        </Box>
      ) : (
        <>
          <CategoriesTable categories={categories} onEdit={handleEditClick} />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}

      <CategoryModal
        open={isModalOpen}
        onClose={handleModalClose}
        category={selectedCategory}
        mode={modalMode}
        categoriesType={categoriesType as CategoriesType}
      />
    </Box>
  );
}

export function meta() {
  return [
    { title: 'Admin Panel - Categories' },
    {
      name: 'description',
      content: 'Manage (create/ update / delete) categories for the projects',
    },
  ];
}
