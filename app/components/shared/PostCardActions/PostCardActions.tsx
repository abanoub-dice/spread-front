import { Box, Button, Typography } from '@mui/material';
import React, { useState } from 'react';
import type { ClientWithActions } from '../ClientPostCard/ClientPostCard';
import type { RadioOption } from '../../shared/RadioGroup';
import RejectionFeedback from './components/RejectionFeedback';
import PreviousFeedbacks from './components/PreviousFeedbacks';

interface PostCardActionsProps {
  clients_with_actions: ClientWithActions[];
}

const commentTypeOptions: RadioOption[] = [
  { label: 'Design', value: 'design' },
  { label: 'Content', value: 'content' },
  { label: 'Both', value: 'both' },
];

const PostCardActions: React.FC<PostCardActionsProps> = ({ clients_with_actions }) => {
  const [showFeedback, setShowFeedback] = useState(false);
  const [commentType, setCommentType] = useState('');
  const [feedback, setFeedback] = useState('');

  const handleApprove = () => {
    console.log('approved');
  };

  const handleReject = () => {
    setShowFeedback(true);
  };

  const handleCancel = () => {
    setShowFeedback(false);
    setCommentType('');
    setFeedback('');
  };

  const handleSendFeedback = () => {
    // You can handle feedback submission here
    setShowFeedback(false);
    setCommentType('');
    setFeedback('');
  };

  return (
    <Box >
      <PreviousFeedbacks clients_with_actions={clients_with_actions} />
      {!showFeedback ? (
        <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
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
            startIcon={<span style={{ fontSize: 14 }}>✔</span>}
            onClick={handleApprove}
          >
            <Typography variant="body2">Approve</Typography>
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
            onClick={handleReject}
          >
            <Typography variant="body2">Reject</Typography>
          </Button>
        </Box>
      ) : (
        <RejectionFeedback
          commentType={commentType}
          setCommentType={setCommentType}
          feedback={feedback}
          setFeedback={setFeedback}
          onCancel={handleCancel}
          onSend={handleSendFeedback}
          commentTypeOptions={commentTypeOptions}
        />
      )}
    </Box>
  );
};

export default PostCardActions;
