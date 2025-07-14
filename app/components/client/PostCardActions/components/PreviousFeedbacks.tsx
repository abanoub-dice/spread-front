import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Tabs,
  Tab,
  Chip,
  IconButton,
  Collapse,
  TextField,
  Stack,
} from '@mui/material';
import type { ClientWithActions, ClientAction } from '../../ClientPostCard/ClientPostCard';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import DeleteIcon from '@mui/icons-material/Delete';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useTheme } from '@mui/material/styles';

interface PreviousFeedbacksProps {
  clients_with_actions: ClientWithActions[];
}

function getUserInitials(name: string) {
  // Return only the first two initials, uppercase
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
}

function getActionsByRound(clients: ClientWithActions[], round: number) {
  // Returns [{ client, action }] for all actions in this round
  const actions: { client: ClientWithActions; action: ClientAction }[] = [];
  clients.forEach(client => {
    client.actions?.forEach(action => {
      if (action.round === round) {
        actions.push({ client, action });
      }
    });
  });
  return actions;
}

function getUsersWithNoActions(clients: ClientWithActions[], round: number) {
  return clients.filter(client => !client.actions?.some(action => action.round === round));
}

const roundLabels = [1, 2];

const PreviousFeedbacks: React.FC<PreviousFeedbacksProps> = ({ clients_with_actions }) => {
  const theme = useTheme();
  // Only show tabs for rounds that have actions
  const availableRounds = roundLabels.filter(
    round => getActionsByRound(clients_with_actions, round).length > 0
  );
  const [activeTab, setActiveTab] = useState<number>(availableRounds[0] || 1);
  const [showCommentStates, setShowCommentStates] = useState<Record<string, boolean>>({});
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);

  const handleToggleComment = (actionId: string) => {
    setShowCommentStates(prev => ({ ...prev, [actionId]: !prev[actionId] }));
  };

  // Placeholder for delete and edit logic
  const handleDeleteAction = (action: ClientAction) => {
    // Implement delete logic here
    // e.g., call API, update state, etc.
    // alert('Delete action ' + action.id);
  };

  const handleEditComment = (actionId: number) => {
    setEditingCommentId(actionId);
  };

  const handleSaveComment = (actionId: number) => {
    // Implement save logic here
    setEditingCommentId(null);
  };

  if (availableRounds.length === 0) return null;

  return (
    <Box className="approvals-feedback" sx={{ mt: 4, mb: 3 }}>
      <Typography variant="h3" sx={{ mb: 3 }}>
        Approvals & Feedback
      </Typography>
      <Box>
        {/* Tab Headers */}
        <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)} sx={{ minHeight: 36, mb: 2 }}>
          {availableRounds.map(round => (
            <Tab
              key={round}
              value={round}
              label={`Round ${round}`}
              sx={{
                minHeight: 36,
                textTransform: 'none',
                fontWeight: activeTab === round ? 700 : 400,
              }}
            />
          ))}
        </Tabs>
        <Box className="tab-content" sx={{ mt: 2 }}>
          {availableRounds.map(round => (
            <Box
              key={round}
              hidden={activeTab !== round}
              className="tab-pane"
              sx={{ display: activeTab === round ? 'block' : 'none' }}
            >
              <Box sx={{ border: '1px solid #888888', borderRadius: 2, p: 2 }}>
                {/* Actions for this round */}
                {getActionsByRound(clients_with_actions, round).map(({ client, action }) => (
                  <Box
                    key={action.created_at + action.id}
                    className="action-item"
                    sx={{ mb: 2, p: 0 }}
                  >
                    {/* Header: User, Action, Delete, Chip */}
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography
                          variant="caption"
                          className={`user-chip me-2 ${
                            action.action === 'approval'
                              ? 'user-chip-success'
                              : action.action === 'rejection'
                              ? 'user-chip-danger'
                              : ''
                          }`}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            background:
                              action.action === 'approval'
                                ? '#d1fae5'
                                : action.action === 'rejection'
                                ? '#fee2e2'
                                : '#f3f4f6',
                            color:
                              action.action === 'approval'
                                ? '#14532d'
                                : action.action === 'rejection'
                                ? '#b91c1c'
                                : '#6b7280',
                            marginRight: 8,
                          }}
                        >
                          {getUserInitials(client.name)}
                        </Typography>
                        <Typography className="action-user" sx={{ mb: 0 }} variant="body2">
                          {client.name}
                        </Typography>
                        {client.pivot.decision_maker ? (
                          <HowToRegIcon
                            sx={{ color: theme.palette.primary.main, fontSize: 18, ml: 1 }}
                          />
                        ) : null}
                      </Stack>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        {/* Delete button: only if action.user.id === client.id (simulate for now) */}
                        {/* TODO: Replace 1 with actual current user id if available */}
                        {true && (
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteAction(action)}
                            sx={{ mr: 1 }}
                          >
                            <DeleteIcon sx={{ color: '#dc2626', fontSize: 16 }} />
                          </IconButton>
                        )}
                        <Chip
                          label={
                            <Typography variant="caption">
                              {action.action === 'rejection'
                                ? 'Rejected'
                                : action.action === 'approval'
                                ? 'Approved'
                                : action.action}
                            </Typography>
                          }
                          size="small"
                          sx={{
                            background:
                              action.action === 'rejection'
                                ? '#fee2e2'
                                : action.action === 'approval'
                                ? '#d1fae5'
                                : '#f3f4f6',
                            color:
                              action.action === 'rejection'
                                ? '#b91c1c'
                                : action.action === 'approval'
                                ? '#14532d'
                                : '#6b7280',
                          }}
                        />
                      </Stack>
                    </Stack>
                    {/* Comment for rejection */}
                    {action.comment && action.action === 'rejection' && (
                      <Box sx={{ mt: 2 }}>
                        <Box
                          className="toggle-comment-text"
                          onClick={() => handleToggleComment(action.id.toString())}
                          sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            cursor: 'pointer',
                            color: theme.palette.primary.main,
                            border: `1px solid ${theme.palette.primary.main}`,
                            background: `${theme.palette.primary.main}10`, // 10 for light alpha
                            borderRadius: 1,
                            px: 1.5,
                            py: 0.5,
                            fontSize: '1rem',
                            transition: 'background 0.2s',
                            userSelect: 'none',
                          }}
                        >
                          <Typography variant="body2" sx={{ color: 'inherit', fontSize: '12px', mr: 0.5 }}>
                            {showCommentStates[action.id] ? 'Hide Comment' : 'Show client feedback'}
                          </Typography>
                          {showCommentStates[action.id] ? (
                            <KeyboardArrowUpIcon fontSize="small" sx={{ color: 'inherit' }} />
                          ) : (
                            <KeyboardArrowDownIcon fontSize="small" sx={{ color: 'inherit' }} />
                          )}
                        </Box>
                        <Collapse in={!!showCommentStates[action.id]}>
                          <TextField
                            className="comment-section"
                            multiline
                            minRows={3}
                            fullWidth
                            value={action.comment}
                            InputProps={{
                              readOnly: true,
                              inputProps: {
                                style: {
                                  pointerEvents: 'none',
                                  cursor: 'default',
                                  fontSize: theme.typography.body2.fontSize,
                                  fontWeight: theme.typography.body2.fontWeight,
                                  color: theme.palette.text.primary,
                                },
                              },
                            }}
                            sx={{
                              mt: 1,
                              background: '#fff',
                              borderRadius: 2,
                              '& .MuiOutlinedInput-root': {
                                p: 2,
                                border: '1px solid #e5e7eb',
                                background: '#fff',
                                fontSize: theme.typography.body2.fontSize,
                                fontWeight: theme.typography.body2.fontWeight,
                                color: theme.palette.text.primary,
                                '& fieldset': {
                                  border: '1px solid #e5e7eb',
                                },
                                '&:hover fieldset': {
                                  border: '1px solid #e5e7eb',
                                },
                                '&.Mui-focused fieldset': {
                                  border: '1px solid #e5e7eb',
                                },
                              },
                              '& .MuiInputBase-input.Mui-disabled': {
                                WebkitTextFillColor: theme.palette.text.primary,
                                fontSize: theme.typography.body2.fontSize,
                                fontWeight: theme.typography.body2.fontWeight,
                              },
                            }}
                          />
                          {/* Optionally, add edit/save buttons here if needed */}
                        </Collapse>
                      </Box>
                    )}
                  </Box>
                ))}
                {/* Users with no actions: Pending */}
                {getUsersWithNoActions(clients_with_actions, round).map(user => (
                  <Box key={user.id} className="action-item" sx={{ mb: 2, p: 0 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography
                          variant="caption"
                          className="user-chip user-chip-pending me-2"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            background: '#f3f4f6',
                            color: '#6b7280',
                            marginRight: 8,
                          }}
                        >
                          {getUserInitials(user.name)}
                        </Typography>
                        <Typography className="action-user" sx={{ mb: 0 }} variant="body2">
                          {user.name}
                        </Typography>
                        {user.pivot.decision_maker ? (
                          <HowToRegIcon
                            sx={{ color: theme.palette.primary.main, fontSize: 18, ml: 1 }}
                          />
                        ) : null}
                      </Stack>
                      <Chip
                        label={<Typography variant="caption">Pending</Typography>}
                        size="small"
                        sx={{
                          background: '#f3f4f6',
                          color: '#6b7280',
                        }}
                      />
                    </Stack>
                  </Box>
                ))}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default PreviousFeedbacks;
