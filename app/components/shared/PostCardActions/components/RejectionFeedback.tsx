import React from 'react';
import { Box, Button, Typography, TextField } from '@mui/material';
import RadioGroup from '../../../shared/RadioGroup';
import type { RadioOption } from '../../../shared/RadioGroup';
import SendIcon from '@mui/icons-material/Send';

interface FeedbackProps {
  commentType: string;
  setCommentType: (val: string) => void;
  feedback: string;
  setFeedback: (val: string) => void;
  onCancel: () => void;
  onSend: () => void;
  commentTypeOptions: RadioOption[];
}

const RejectionFeedback: React.FC<FeedbackProps> = ({
  commentType,
  setCommentType,
  feedback,
  setFeedback,
  onCancel,
  onSend,
  commentTypeOptions,
}) => {
  return (
    <Box
      sx={{
        border: '1px solid #eee',
        borderRadius: 2,
        p: 3,
        maxWidth: 400,
        bgcolor: '#fff7f5',
        boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Typography variant="subtitle1" sx={{ mb: 2, color: '#fe520a', fontWeight: 600 }}>
        Comment Type
      </Typography>
      <RadioGroup options={commentTypeOptions} value={commentType} onChange={setCommentType} />
      <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>
        Your Feedback
      </Typography>
      <TextField
        multiline
        minRows={3}
        fullWidth
        placeholder="Add your feedback..."
        value={feedback}
        onChange={e => setFeedback(e.target.value)}
        sx={{ mb: 3, background: '#fff', borderRadius: 1 }}
      />
      <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', mt: 2 }}>
        <Button
          variant="contained"
          sx={{
            background: '#d1fae5',
            color: '#14532d',
            boxShadow: 'none',
            borderRadius: 2,
            px: 3,
            py: 1,
            '&:hover': { background: '#bbf7d0' },
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            textTransform: 'none',
          }}
          disabled={!commentType || !feedback.trim()}
          onClick={onSend}
          startIcon={<SendIcon sx={{ fontSize: 20 }} />}
        >
          <Typography variant="body2">Send feedback</Typography>
        </Button>

        <Button
          variant="contained"
          sx={{
            background: '#fee2e2',
            color: '#b91c1c',
            boxShadow: 'none',
            borderRadius: 2,
            px: 3,
            py: 1,
            '&:hover': { background: '#fecaca' },
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            textTransform: 'none',
          }}
          startIcon={<span style={{ fontSize: 14 }}>✖</span>}
          onClick={onCancel}
        >
          <Typography variant="body2">Cancel</Typography>
        </Button>
      </Box>
    </Box>
  );
};

export default RejectionFeedback;
