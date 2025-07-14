import React from 'react';
import { Box, Typography, Chip, Stack } from '@mui/material';
import StatusBadge from '../../shared/StatusBadge';

export interface ClientPostCardProps {
  post: Post;
}

export interface Post {
  id: number;
  title: string;
  slug: string;
  EnCaption: string | null;
  ArCaption: string | null;
  hashtags: string[];
  type: string[];
  platforms: string[];
  approved_by_client: boolean;
  sponsored: number;
  first_edits_requested: boolean;
  first_edits_done: boolean;
  second_edits_requested: boolean;
  second_edits_done: boolean;
  publishing_at: string;
  is_arabic_first: number;
  rate: number;
  tiktok_title_caption: string | null;
  tiktok_caption: string | null;
  created_at: string;
  updated_at: string;
  account_id: number;
  has_unread_messages: boolean;
  status: 'All' | 'Approved' | 'Pending' | 'Rejected' | 'Sponsored';
  clients_with_actions: any[];
  media: { url: string }[];
}

const formatTime12h = (dateString: string) => {
  const date = new Date(dateString);
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  const mins = minutes < 10 ? '0' + minutes : minutes;
  return `${hours}:${mins} ${ampm}`;
};

const ClientPostCard: React.FC<ClientPostCardProps> = ({ post }) => {
  return (
    <Box
      sx={{
        border: '1px solid #eee',
        borderRadius: 2,
        p: 2,
        minWidth: 400,
        width: '100%',
        boxShadow: '0 2px 8px 0 rgba(0,0,0,0.04)',
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
        background: '#fff',
      }}
    >
      {/* Media */}
      {post.media && post.media.length > 0 && (
        <Box sx={{ mb: 1, borderRadius: 1, overflow: 'hidden', maxHeight: 180 }}>
          <img
            src={post.media[0].url}
            alt={post.title}
            style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
          />
        </Box>
      )}
      {/* Platforms & Type & Time */}
      <Stack
        direction="row"
        spacing={1}
        alignItems="flex-start"
        justifyContent="space-between"
        sx={{ mb: 0.5 }}
      >
        <Stack direction="column" spacing={1} sx={{ mb: 0.5, flex: 1 }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5, }}>
            {post.platforms.map(platform => (
              <Chip
                key={platform}
                label={platform}
                size="small"
                sx={{
                  fontWeight: 700,
                  borderRadius: '8px',
                  border: '1px solid #222',
                  background: '#fff',
                  color: '#222',
                  px: 1.2,
                }}
              />
            ))}
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5, }}>
            {' '}
            {post.type.map(type => (
              <Chip
                key={type}
                label={type}
                size="small"
                sx={{
                  fontWeight: 700,
                  borderRadius: '8px',
                  background: '#e3eafc',
                  color: '#2563eb',
                  px: 1.2,
                }}
              />
            ))}{' '}
          </Stack>
        </Stack>
        <Typography
          variant="caption"
          sx={{
            color: 'text.secondary',
            ml: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
          }}
        >
          <span role="img" aria-label="clock">
            🕒
          </span>{' '}
          {formatTime12h(post.publishing_at)}
        </Typography>
      </Stack>
      {/* Captions */}
      {post.EnCaption && (
        <Typography variant="body2" sx={{ color: 'text.primary', direction: 'ltr', mb: 0.5 }}>
          {post.EnCaption}
        </Typography>
      )}
      {post.ArCaption && (
        <Typography variant="body2" sx={{ color: 'text.primary', direction: 'rtl', mb: 0.5 }}>
          {post.ArCaption}
        </Typography>
      )}
      {/* Hashtags */}
      <Box sx={{ mb: 0.5 }}>
        {post.hashtags.map(tag => (
          <Typography
            key={tag}
            variant="body2"
            component="span"
            sx={{ color: '#0a0aff', fontWeight: 600, mr: 1, cursor: 'pointer' }}
          >
            {tag}
          </Typography>
        ))}
      </Box>
      {/* Status */}
      <Box sx={{ mt: 1 }}>
        <StatusBadge status={post.status} />
      </Box>
    </Box>
  );
};

export default ClientPostCard;
