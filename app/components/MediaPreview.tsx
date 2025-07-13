import { Box, IconButton, Modal } from '@mui/material';
import type { Media } from '~/routes/project/project-plan/types';
import { GoTrash } from 'react-icons/go';
import { IoMdClose } from 'react-icons/io';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '~/utils/api/axiosInstance';
import { useToaster } from '~/components/Toaster';
import { FaPlay, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useState } from 'react';

interface MediaPreviewProps {
  media: Media[];
  emptyMessage?: string;
  entityId: number;
  mutationPath: string;
}

interface MediaItemProps {
  item: Media;
  index: number;
  onDelete: (id: number) => void;
  onOpenGallery: (index: number) => void;
}

interface MediaGalleryModalProps {
  open: boolean;
  media: Media[];
  selectedIndex: number | null;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
}

const MediaItem = ({ item, index, onDelete, onOpenGallery }: MediaItemProps) => (
  <Box
    sx={{
      width: 120,
      height: 120,
      borderRadius: 1,
      overflow: 'hidden',
      border: '1px solid #ccc',
      position: 'relative',
      cursor: 'pointer',
      '&:hover': {
        '& .media-overlay': {
          opacity: 1,
        },
      },
    }}
    onClick={() => onOpenGallery(index)}
  >
    {item.type === 'VIDEO' ? (
      <>
        <video
          src={item.url}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <Box
          className="media-overlay"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0, 0, 0, 0.3)',
            opacity: 0,
            transition: 'opacity 0.2s ease',
          }}
        >
          <FaPlay size={24} color="white" />
        </Box>
      </>
    ) : (
      <img
        src={item.url}
        alt={item.original_name}
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
      />
    )}
    <Box
      sx={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        gap: 0.5,
        p: 0.5,
        background: 'rgba(0, 0, 0, 0.5)',
      }}
    >
      <IconButton
        size="small"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(item.id);
        }}
        sx={{
          color: 'white',
          p: 0.5,
          transition: 'all 0.2s ease',
          '&:hover': {
            color: 'error.main',
            transform: 'scale(1.1)',
          }
        }}
      >
        <GoTrash size={16} />
      </IconButton>
    </Box>
  </Box>
);

const MediaGalleryModal = ({ open, media, selectedIndex, onClose, onPrevious, onNext }: MediaGalleryModalProps) => {
  if (selectedIndex === null) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      disableEscapeKeyDown={false}
      disableAutoFocus
      disableEnforceFocus
      disablePortal
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'rgba(0, 0, 0, 0.8)',
      }}
    >
      <Box sx={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh', px: { xs: 6, sm: 8 } }}>
        <IconButton
          onClick={onClose}
          sx={{
            position: 'fixed',
            top: 16,
            right: 16,
            color: 'white',
            bgcolor: 'rgba(0, 0, 0, 0.5)',
            '&:hover': {
              bgcolor: 'rgba(0, 0, 0, 0.7)',
            },
          }}
        >
          <IoMdClose size={24} />
        </IconButton>

        <Box
          sx={{
            bgcolor: 'white',
            p: 2,
            borderRadius: 1,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
          }}
        >
          {media[selectedIndex].type === 'VIDEO' ? (
            <video
              src={media[selectedIndex].url}
              controls
              style={{ maxWidth: '100%', maxHeight: '80vh' }}
            />
          ) : (
            <img
              src={media[selectedIndex].url}
              alt={media[selectedIndex].original_name}
              style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain' }}
            />
          )}
        </Box>
        
        <IconButton
          onClick={onPrevious}
          disabled={selectedIndex === 0}
          sx={{
            position: 'fixed',
            left: { xs: 8, sm: 16 },
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'white',
            bgcolor: 'rgba(0, 0, 0, 0.5)',
            width: { xs: 32, sm: 40 },
            height: { xs: 32, sm: 40 },
            '&:hover': {
              bgcolor: 'rgba(0, 0, 0, 0.7)',
            },
            '&.Mui-disabled': {
              color: 'rgba(255, 255, 255, 0.3)',
              bgcolor: 'rgba(0, 0, 0, 0.3)',
            }
          }}
        >
          <FaChevronLeft size={20} style={{ width: 'auto', height: '100%' }} />
        </IconButton>
        
        <IconButton
          onClick={onNext}
          disabled={selectedIndex === media.length - 1}
          sx={{
            position: 'fixed',
            right: { xs: 8, sm: 16 },
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'white',
            bgcolor: 'rgba(0, 0, 0, 0.5)',
            width: { xs: 32, sm: 40 },
            height: { xs: 32, sm: 40 },
            '&:hover': {
              bgcolor: 'rgba(0, 0, 0, 0.7)',
            },
            '&.Mui-disabled': {
              color: 'rgba(255, 255, 255, 0.3)',
              bgcolor: 'rgba(0, 0, 0, 0.3)',
            }
          }}
        >
          <FaChevronRight size={20} style={{ width: 'auto', height: '100%' }} />
        </IconButton>
      </Box>
    </Modal>
  );
};

export default function MediaPreview({ media, emptyMessage = 'No media uploaded yet', entityId, mutationPath }: MediaPreviewProps) {
  const queryClient = useQueryClient();
  const { showToaster } = useToaster();
  const [selectedMediaIndex, setSelectedMediaIndex] = useState<number | null>(null);

  const deleteMediaMutation = useMutation({
    mutationFn: (mediaId: number) => {
      return axiosInstance.delete(`/v1/${mutationPath}/${entityId}/media`, {
        data: { mediaIds: [mediaId] }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [mutationPath] });
      showToaster('Media deleted successfully', 'success');
    },
    onError: () => {
      showToaster('Failed to delete media', 'error');
    }
  });

  const handleDelete = (mediaId: number) => {
    deleteMediaMutation.mutate(mediaId);
  };

  const handleOpenGallery = (index: number) => {
    setSelectedMediaIndex(index);
  };

  const handleCloseGallery = () => {
    setSelectedMediaIndex(null);
  };

  const handlePrevious = () => {
    if (selectedMediaIndex !== null) {
      setSelectedMediaIndex((selectedMediaIndex - 1 + media.length) % media.length);
    }
  };

  const handleNext = () => {
    if (selectedMediaIndex !== null) {
      setSelectedMediaIndex((selectedMediaIndex + 1) % media.length);
    }
  };

  if (!media?.length) {
    return (
      <Box
        sx={{
          height: 80,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px dashed #ccc',
          borderRadius: 1,
          color: 'text.secondary',
        }}
      >
        {emptyMessage}
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {media.map((item, index) => (
          <MediaItem
            key={item.id}
            item={item}
            index={index}
            onDelete={handleDelete}
            onOpenGallery={handleOpenGallery}
          />
        ))}
      </Box>

      <MediaGalleryModal
        open={selectedMediaIndex !== null}
        media={media}
        selectedIndex={selectedMediaIndex}
        onClose={handleCloseGallery}
        onPrevious={handlePrevious}
        onNext={handleNext}
      />
    </>
  );
} 