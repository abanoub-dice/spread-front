import React from 'react';
import { Box, Typography, Chip, Stack } from '@mui/material';
import StatusBadge from '../../shared/StatusBadge';
import PostCardActions from '../PostCardActions/PostCardActions';

export interface ClientAction {
  id: number;
  action: string;
  comment: string | null;
  round: number;
  created_at: string;
}

export interface ClientPivot {
  post_id: number;
  client_id: number;
  created_at: string;
  updated_at: string;
  role: string;
  decision_maker: number;
}

export interface ClientWithActions {
  id: number;
  name: string;
  email: string;
  phone: string;
  account_id: number;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  actions?: ClientAction[];
  pivot: ClientPivot;
}

export interface Post {
  id: number;
  title: string;
  slug: string;
  EnCaption: string | null;
  ArCaption: string | null;
  hashtags: string[] | null;
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
  clients_with_actions: ClientWithActions[];
  media: PostMedia[];
}

export interface PostMedia {
  id: number;
  post_id: number;
  original_name: string;
  type: string;
  url: string;
  video_poster_image_url: string | null;
  original_quality_video_poster_url: string | null;
  order: number | null;
  original_quality: boolean;
  related_original_media_id: number | null;
  created_at: string;
  updated_at: string;
}

export interface ClientPostCardProps {
  post: Post;
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
        border: '1px solid #888888',
        borderRadius: 2,
        p: 2,
        minWidth: 400,
        width: '100%',
        boxShadow: '0 0px 8px 4px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
        background: '#fff',
      }}
    >
      {/* Media */}
      {post.media && post.media.length > 0 && (
        <Box sx={{ mb: 1, borderRadius: 1, overflow: 'hidden' }}>
          {post.media[0].type === 'image' ? (
            <img
              src={post.media[0].url}
              alt={post.title}
              style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
            />
          ) : post.media[0].type === 'video' ? (
            <video
              controls
              style={{ width: '100%', height: 180, objectFit: 'cover', background: '#000' }}
              poster={post.media[0].video_poster_image_url || undefined}
            >
              <source src={post.media[0].url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : null}
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
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
            {post.platforms.map((platform: string) => (
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
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
            {' '}
            {post.type.map((type: string) => (
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
        {post.hashtags?.map((tag: string) => (
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
      {/* Actions */}
      <Box mt={2}>
        <PostCardActions clients_with_actions={post.clients_with_actions} />
      </Box>
    </Box>
  );
};

export default ClientPostCard;
