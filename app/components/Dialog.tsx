import {
  Dialog as MuiDialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  styled,
} from '@mui/material';
import { useDialogueStore } from '../utils/store/zustandHooks';

// Styled components
const StyledDialog = styled(MuiDialog)({
  '& .MuiDialog-paper': {
    minWidth: '300px',
    maxWidth: '400px',
    borderRadius: 16,
    padding: 8,
  },
});

const StyledTitle = styled(Typography)(({ theme }) => ({
  position: 'relative',
  display: 'inline-block',
  '&:after': {
    content: '""',
    position: 'absolute',
    bottom: -8,
    left: 0,
    right: 0,
    backgroundColor: theme.palette.primary.main,
    width: '120%',
    height: '2px',
    borderRadius: '1px',
  },
}));

const StyledCancelButton = styled(Button)(({ theme }) => ({
  borderColor: theme.palette.grey[400],
  textTransform: 'capitalize',
  '&:hover': {
    borderColor: theme.palette.grey[600],
    backgroundColor: theme.palette.grey[100],
    transform: 'translateY(-1px)',
    transition: 'all 0.2s ease-in-out',
  },
}));

const StyledConfirmButton = styled(Button)(({ theme }) => ({
  textTransform: 'capitalize',
  '&:hover': {
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    transition: 'all 0.2s ease-in-out',
  },
}));

interface DialogueState {
  show: boolean;
  title?: string;
  text?: string;
  closable?: boolean;
  acceptLabel?: string;
  acceptColor?: string;
  onAccept?: () => void;
}

const Dialog: React.FC = () => {
  const dialogue = useDialogueStore((state) => state.data);
  const resetDialogue = useDialogueStore((state) => state.resetDialogue);

  const handleClose = () => {
    resetDialogue();
  };

  const handleAccept = () => {
    dialogue.onAccept?.();
    handleClose();
  };

  if (!dialogue.show) return null;

  return (
    <StyledDialog
      open={dialogue.show}
      onClose={dialogue.closable ? handleClose : undefined}
      maxWidth="xs"
      fullWidth
    >
      {dialogue.title && (
        <DialogTitle sx={{ px: 3, color: 'primary.main' }}>
          <Box>
            <StyledTitle variant="h1">
              {dialogue.title}
            </StyledTitle>
          </Box>
        </DialogTitle>
      )}

      {dialogue.text && (
        <DialogContent sx={{ px: 3 }}>
          <Typography variant="paragraph1">{dialogue.text}</Typography>
        </DialogContent>
      )}

      <DialogActions sx={{ px: 3, py: 2 }}>
        <StyledCancelButton
          onClick={handleClose}
          color="inherit"
          variant="outlined"
        >
          Cancel
        </StyledCancelButton>
        <StyledConfirmButton
          onClick={handleAccept}
          sx={{ bgcolor: dialogue.acceptColor || 'primary.main' }}
          variant="contained"
        >
          {dialogue.acceptLabel || 'Confirm'}
        </StyledConfirmButton>
      </DialogActions>
    </StyledDialog>
  );
};

export default Dialog;
