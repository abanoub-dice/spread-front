import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Skeleton,
  Box,
} from '@mui/material';

export default function CategoriesTableSkeleton() {
  return (
    <Paper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[...Array(5)].map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton animation="wave" width="60%" />
                </TableCell>
                <TableCell>
                  <Skeleton animation="wave" width="80%" />
                </TableCell>
                <TableCell align="right">
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                    <Skeleton animation="wave" variant="circular" width={32} height={32} />
                    <Skeleton animation="wave" variant="circular" width={32} height={32} />
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'center', gap: 1 }}>
        <Skeleton animation="wave" width={32} height={32} />
        <Skeleton animation="wave" width={32} height={32} />
        <Skeleton animation="wave" width={32} height={32} />
        <Skeleton animation="wave" width={32} height={32} />
        <Skeleton animation="wave" width={32} height={32} />
      </Box>
    </Paper>
  );
} 