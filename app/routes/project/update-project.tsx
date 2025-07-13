import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../utils/api/axiosInstance';
import { useAppDispatch } from '../../utils/store/hooks/hooks';
import { showLoader, hideLoader } from '../../utils/store/slices/loaderSlice';
import { useEffect } from 'react';
import ProjectForm from './ProjectForm';
import UpdateProjectSkeleton from './UpdateProjectSkeleton';
import { useToaster } from '../../components/Toaster';

export default function UpdateProject() {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { showToaster } = useToaster();

  // Use the cached project data from the parent query
  const {
    data: project,
    isLoading: isLoadingProject,
    isError: isProjectError,
  } = useQuery({
    queryKey: ['project-header', id],
    queryFn: async () => {
      const response = await axiosInstance.get(`/v1/projects/${id}`);
      return response.data;
    },
    refetchOnMount: false, // Don't refetch on mount since we're using cached data
    refetchOnWindowFocus: false,
  });

  // Fetch categories and users
  const {
    data: categories = [],
    isLoading: isLoadingCategories,
    isError: isCategoriesError,
  } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await axiosInstance.get('/v1/categories?limit=0');
      return response.data.categories;
    },
  });

  const {
    data: users = [],
    isLoading: isLoadingUsers,
    isError: isUsersError,
  } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await axiosInstance.get('/v1/users?limit=0');
      return response.data.users;
    },
  });

  const isLoading = isLoadingProject || isLoadingCategories || isLoadingUsers;

  useEffect(() => {
    if (isLoading) {
      dispatch(showLoader());
    } else {
      dispatch(hideLoader());
    }
  }, [isLoading, dispatch]);

  useEffect(() => {
    if (isCategoriesError || isUsersError || isProjectError) {
      showToaster('Failed to fetch required data...', 'error');
      navigate('/', { replace: true });
    }
  }, [isCategoriesError, isUsersError, showToaster, navigate]);

  // Show skeleton while loading or if project is not available
  if (isLoading || !project) {
    return <UpdateProjectSkeleton />;
  }

  return <ProjectForm project={project} categories={categories} users={users} />;
}

export function meta() {
  return [
    { title: 'Update Project' },
    { name: 'description', content: 'Update your project details' },
  ];
}
