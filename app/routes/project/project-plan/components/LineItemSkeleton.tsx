import { Box, Skeleton, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';

export function LineItemSkeleton() {
  return (
    <Accordion disabled>
      <AccordionSummary>
        <Skeleton variant="text" width={120} height={32} />
      </AccordionSummary>
      <AccordionDetails>
        <Box display="flex" flexDirection="column" gap={2}>
          <Skeleton variant="rectangular" height={40} width="60%" />
          <Skeleton variant="rectangular" height={40} width="80%" />
          <Skeleton variant="rectangular" height={60} width="100%" />
        </Box>
      </AccordionDetails>
    </Accordion>
  );
} 