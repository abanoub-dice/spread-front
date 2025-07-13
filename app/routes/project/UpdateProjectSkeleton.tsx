import { Box, Skeleton } from '@mui/material';

const UpdateProjectSkeleton = () => {
  return (
    <Box maxWidth={600} mx="0">
      <Box mb={2}>
        <Skeleton variant="text" width={200} height={40} />
      </Box>
      <Box mb={2}>
        <Skeleton variant="text" width={120} height={24} />
        <Skeleton variant="rectangular" height={56} />
      </Box>
      <Box mb={2}>
        <Skeleton variant="text" width={120} height={24} />
        <Skeleton variant="rectangular" height={56} />
      </Box>
      <Box mb={2}>
        <Skeleton variant="text" width={120} height={24} />
        <Skeleton variant="rectangular" height={56} />
      </Box>
      <Box mb={2}>
        <Skeleton variant="text" width={120} height={24} />
        <Skeleton variant="rectangular" height={56} />
      </Box>
      <Box mb={2}>
        <Skeleton variant="text" width={120} height={24} />
        <Skeleton variant="rectangular" height={56} />
      </Box>
      <Box display="flex" flexWrap="wrap" gap="6%" rowGap={2} mb={2}>
        <Box width="47%">
          <Skeleton variant="text" width={120} height={24} />
          <Skeleton variant="rectangular" height={56} />
        </Box>
        <Box width="47%">
          <Skeleton variant="text" width={120} height={24} />
          <Skeleton variant="rectangular" height={56} />
        </Box>
        <Box width="47%">
          <Skeleton variant="text" width={120} height={24} />
          <Skeleton variant="rectangular" height={56} />
        </Box>
        <Box width="47%">
          <Skeleton variant="text" width={120} height={24} />
          <Skeleton variant="rectangular" height={56} />
        </Box>
      </Box>
      <Box mb={2}>
        <Skeleton variant="text" width={120} height={24} />
        <Skeleton variant="rectangular" height={120} />
      </Box>
      <Box display="flex" justifyContent="end" gap={2}>
        <Skeleton variant="rectangular" width={120} height={40} />
        <Skeleton variant="rectangular" width={120} height={40} />
      </Box>
    </Box>
  );
};

export default UpdateProjectSkeleton; 