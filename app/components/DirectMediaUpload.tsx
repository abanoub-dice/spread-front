import { useRef, useMemo } from 'react';
import { Box, Typography, Button } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

interface DirectMediaUploadProps {
  onUpload: (files: File[]) => Promise<void>;
  label?: string;
  maxFiles?: number;
  acceptedFileTypes?: string[];
}

export default function DirectMediaUpload({
  onUpload,
  label,
  maxFiles = 10,
  acceptedFileTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'video/mp4',
    'video/quicktime',
    'video/x-msvideo',
    'video/webm',
  ],
}: DirectMediaUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const acceptString = useMemo(
    () => acceptedFileTypes.join(','),
    [acceptedFileTypes]
  );

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFiles = event.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      const files = Array.from(selectedFiles).slice(0, maxFiles);
      await onUpload(files);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Box sx={{ width: '100%' }}>
      {label && <Typography variant="subHeader">{label}</Typography>}
      <Box sx={{ mt: 2 }}>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptString}
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        <Button
          variant="outlined"
          component="span"
          startIcon={<CloudUploadIcon />}
          onClick={handleButtonClick}
          aria-label="Upload Media"
          sx={{
            textTransform: 'capitalize',
            '&:hover': {
              transform: 'translateY(-1px)',
              transition: 'all 0.2s ease-in-out',
            },
          }}
        >
          Upload Media
        </Button>
      </Box>
    </Box>
  );
}
