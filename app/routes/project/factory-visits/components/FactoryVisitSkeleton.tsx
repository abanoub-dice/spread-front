import { Box, Skeleton } from '@mui/material';

export function FactoryVisitSkeleton() {
  return (
    <Box
      sx={{
        overflow: 'hidden',
        mb: 2,
        border: '1px solid #e0e0e0',
        borderRadius: 2,
        p: 2,
      }}
    >
      <Box display="flex" flexDirection="column" gap={2}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Skeleton variant="text" width={200} height={32} />
          <Box display="flex" alignItems="center" justifyContent="flex-end" gap={1}>
            <Skeleton variant="circular" width={24} height={24} />
            <Skeleton variant="circular" width={24} height={24} />
          </Box>
        </Box>
        <Box>
          <Box>
            <Skeleton variant="text" width={100} height={24} sx={{ mb: 1 }} />
            <Skeleton variant="text" width={200} height={24} sx={{ mb: 1 }} />
          </Box>
          <Box>
            <Skeleton variant="text" width={100} height={24} sx={{ mb: 1 }} />
            <Skeleton variant="text" width={200} height={24} sx={{ mb: 1 }} />
          </Box>
          <Box>
            <Skeleton variant="text" width={100} height={24} sx={{ mb: 1 }} />
            <Skeleton variant="text" width={200} height={24} sx={{ mb: 1 }} />
          </Box>
          <Box>
            <Skeleton variant="text" width={100} height={24} sx={{ mb: 1 }} />
            <Skeleton variant="rectangular" height={120} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
