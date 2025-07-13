import { Box, Skeleton, Stack } from '@mui/material';

export default function ActionItemsSkeleton() {
  return (
    <Box display="flex" gap={4}>
      <Box flex={1}>
        <Skeleton variant="text" width={120} height={32} sx={{ mb: 2 }} />
        <Stack spacing={2} p={2} borderRadius={3} boxShadow={1} bgcolor="background.paper">
          {[1, 2, 3].map((item) => (
            <Box
              key={item}
              display="flex"
              alignItems="flex-start"
              gap={2}
              p={2}
              borderRadius={2}
              boxShadow={1}
              bgcolor="background.paper"
            >
              <Skeleton variant="circular" width={24} height={24} sx={{ mt: 0.5 }} />
              <Box flex={1}>
                <Skeleton variant="text" width="60%" height={24} />
                <Skeleton variant="text" width="80%" height={20} sx={{ mb: 2 }} />
                <Skeleton variant="text" width={100} height={24} sx={{ mb: 1 }} />
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Skeleton variant="text" width={80} height={20} />
                  <Box display="flex" gap={1}>
                    <Skeleton variant="circular" width={32} height={32} />
                    <Skeleton variant="circular" width={32} height={32} />
                  </Box>
                </Box>
              </Box>
            </Box>
          ))}
        </Stack>
      </Box>
      <Box flex={1}>
        <Skeleton variant="text" width={150} height={32} sx={{ mb: 2 }} />
        <Stack spacing={2} p={2} borderRadius={3} boxShadow={1} bgcolor="background.paper">
          {[1, 2].map((item) => (
            <Box
              key={item}
              display="flex"
              alignItems="flex-start"
              gap={2}
              p={2}
              borderRadius={2}
              boxShadow={1}
              bgcolor="grey.100"
            >
              <Skeleton variant="circular" width={24} height={24} sx={{ mt: 0.5 }} />
              <Box flex={1}>
                <Skeleton variant="text" width="60%" height={24} />
                <Skeleton variant="text" width="80%" height={20} sx={{ mb: 2 }} />
                <Skeleton variant="text" width={100} height={24} sx={{ mb: 1 }} />
                <Skeleton variant="text" width={80} height={20} />
              </Box>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
} 