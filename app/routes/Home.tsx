import { Box, Typography, Paper } from '@mui/material';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';

export default function Home() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
          maxWidth: 600,
          textAlign: 'center',
        }}
      >
        <FolderOpenIcon sx={{ fontSize: 60, color: 'primary.main' }} />
        <Typography variant="h4" component="h1" color="text.primary" gutterBottom>
          Select a Project
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Please choose a project from the sidebar to start tracking its progress here.
        </Typography>
      </Paper>
    </Box>
  );
}

export function meta() {
  return [
    { title: 'Project Progress Hub' },
    { name: 'description', content: 'Select a project to track its progress' }
  ];
}
