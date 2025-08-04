import React from 'react';
import type { Status, Platform, Type } from '~/pages/protected/calendar-page/CalendarPage';
import type { Dayjs } from 'dayjs';
import { Box, Typography, Button, Grid } from '@mui/material';
import ClientPostCard, {
  type Post,
  type ClientWithActions,
} from '../ClientPostCard/ClientPostCard';

interface PostsListProps {
  status: Status;
  platform: Platform | null;
  type: Type | null;
  selectedDate: Dayjs | null;
}

const PostsList: React.FC<PostsListProps> = ({ status, platform, type, selectedDate }) => {
  const posts: Post[] = [
    {
      id: 2,
      title: 'test',
      slug: 'test',
      EnCaption: 'testing',
      ArCaption: null,
      hashtags: ['#hash'],
      type: ['Carousel'],
      platforms: ['Facebook'],
      approved_by_client: false,
      sponsored: 0,
      first_edits_requested: true,
      first_edits_done: true,
      second_edits_requested: true,
      second_edits_done: false,
      publishing_at: '2025-04-20 15:43:00',
      is_arabic_first: 0,
      rate: 2,
      tiktok_title_caption: null,
      tiktok_caption: null,
      created_at: '2025-04-20T13:43:37.000000Z',
      updated_at: '2025-05-18T12:44:34.000000Z',
      account_id: 1,
      has_unread_messages: false,
      status: 'Rejected',
      clients_with_actions: [
        {
          id: 2,
          name: 'Sarah Johnson',
          email: 'amir.haroun@dicema.com',
          phone: '+15415190190',
          account_id: 1,
          deleted_at: null,
          created_at: '2025-04-14T14:12:34.000000Z',
          updated_at: '2025-04-24T13:11:29.000000Z',
          actions: [
            {
              id: 8,
              action: 'rejection',
              comment: 'rejected',
              round: 1,
              created_at: '2025-04-24T13:03:24.000000Z',
            },
            {
              id: 9,
              action: 'rejection',
              comment: 'qwdqwd',
              round: 1,
              created_at: '2025-04-24T13:06:58.000000Z',
            },
            {
              id: 48,
              action: 'rejection',
              comment: 'qweqwew',
              round: 2,
              created_at: '2025-05-18T12:44:34.000000Z',
            },
          ],
          pivot: {
            post_id: 2,
            client_id: 2,
            created_at: '2025-04-24T13:55:50.000000Z',
            updated_at: '2025-04-24T15:03:16.000000Z',
            role: 'editor',
            decision_maker: 1,
          },
        },
        {
          id: 1,
          name: 'john smith name edited',
          email: 'john.smith@example.com',
          phone: '+123456789',
          account_id: 1,
          deleted_at: null,
          created_at: '2025-04-14T14:12:33.000000Z',
          updated_at: '2025-04-17T13:14:59.000000Z',
          pivot: {
            post_id: 2,
            client_id: 1,
            created_at: '2025-04-24T15:03:16.000000Z',
            updated_at: '2025-04-24T15:03:16.000000Z',
            role: 'editor',
            decision_maker: 0,
          },
        },
      ] as ClientWithActions[],
      media: [],
    },
    // Post 2
    {
      id: 3,
      title: 'launch campaign',
      slug: 'launch-campaign',
      EnCaption: 'Launching our new product!',
      ArCaption: 'إطلاق منتجنا الجديد!',
      hashtags: ['#launch', '#newproduct'],
      type: ['Single'],
      platforms: ['Instagram', 'Twitter'],
      approved_by_client: true,
      sponsored: 1,
      first_edits_requested: false,
      first_edits_done: false,
      second_edits_requested: false,
      second_edits_done: false,
      publishing_at: '2025-04-22 10:00:00',
      is_arabic_first: 1,
      rate: 5,
      tiktok_title_caption: 'Check this out!',
      tiktok_caption: 'Launching now!',
      created_at: '2025-04-21T09:00:00.000000Z',
      updated_at: '2025-04-21T09:00:00.000000Z',
      account_id: 2,
      has_unread_messages: true,
      status: 'Approved',
      clients_with_actions: [],
      media: [],
    },
    // Post 3
    {
      id: 4,
      title: 'event announcement',
      slug: 'event-announcement',
      EnCaption: 'Join our annual event!',
      ArCaption: null,
      hashtags: ['#event', '#annual'],
      type: ['Video'],
      platforms: ['YouTube'],
      approved_by_client: false,
      sponsored: 0,
      first_edits_requested: true,
      first_edits_done: false,
      second_edits_requested: false,
      second_edits_done: false,
      publishing_at: '2025-04-25 18:00:00',
      is_arabic_first: 0,
      rate: 3,
      tiktok_title_caption: null,
      tiktok_caption: null,
      created_at: '2025-04-23T12:00:00.000000Z',
      updated_at: '2025-04-23T12:00:00.000000Z',
      account_id: 3,
      has_unread_messages: false,
      status: 'Pending',
      clients_with_actions: [],
      media: [],
    },
    // Post 4
    {
      id: 5,
      title: 'feedback request',
      slug: 'feedback-request',
      EnCaption: 'We value your feedback!',
      ArCaption: null,
      hashtags: ['#feedback'],
      type: ['Story'],
      platforms: ['Facebook', 'Instagram'],
      approved_by_client: false,
      sponsored: 0,
      first_edits_requested: false,
      first_edits_done: false,
      second_edits_requested: false,
      second_edits_done: false,
      publishing_at: '2025-04-28 09:00:00',
      is_arabic_first: 0,
      rate: 4,
      tiktok_title_caption: null,
      tiktok_caption: null,
      created_at: '2025-04-27T08:00:00.000000Z',
      updated_at: '2025-04-27T08:00:00.000000Z',
      account_id: 4,
      has_unread_messages: true,
      status: 'Pending',
      clients_with_actions: [],
      media: [],
    },
    // Post 5
    {
      id: 7,
      title: 'dasda',
      slug: 'dasda',
      EnCaption: null,
      ArCaption: null,
      hashtags: null,
      type: ['Story'],
      platforms: ['Instagram'],
      approved_by_client: true,
      sponsored: 0,
      first_edits_requested: false,
      first_edits_done: false,
      second_edits_requested: false,
      second_edits_done: false,
      publishing_at: '2025-07-12 15:00:00',
      is_arabic_first: 0,
      rate: 0,
      tiktok_title_caption: null,
      tiktok_caption: null,
      created_at: '2025-07-02T12:00:22.000000Z',
      updated_at: '2025-07-06T09:51:01.000000Z',
      account_id: 1,
      has_unread_messages: false,
      status: 'Approved',
      clients_with_actions: [
        {
          id: 1,
          name: 'john smith name edited',
          email: 'john.smith@example.com',
          phone: '+123456789',
          account_id: 1,
          deleted_at: null,
          created_at: '2025-04-14T14:12:33.000000Z',
          updated_at: '2025-04-17T13:14:59.000000Z',
          actions: [
            {
              id: 49,
              action: 'approval',
              comment: null,
              round: 1,
              created_at: '2025-07-02T13:28:22.000000Z',
            },
          ],
          pivot: {
            post_id: 7,
            client_id: 1,
            created_at: '2025-07-02T12:00:22.000000Z',
            updated_at: '2025-07-06T09:51:01.000000Z',
            role: 'editor',
            decision_maker: 1,
          },
        },
      ] as ClientWithActions[],
      media: [
        {
          id: 29,
          post_id: 7,
          original_name: '1751531461533_1_5mb.mp4',
          type: 'video',
          url: 'https://digital-calendar-media.dicema.com/Posts/Media/7/Ie4xDe77fCAHSAMrcQCy7rm8QBOE5UzIKs4xvnuy.mp4',
          video_poster_image_url: null,
          original_quality_video_poster_url: null,
          order: null,
          original_quality: false,
          related_original_media_id: null,
          created_at: '2025-07-03T08:31:09.000000Z',
          updated_at: '2025-07-03T08:31:09.000000Z',
        },
      ],
    },
  ];

  return (
    <Box m={4}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="bodyLarge" sx={{ fontWeight: 700, color: 'text.primary' }}>
          {selectedDate ? selectedDate.format('dddd, MMMM D, YYYY') : 'No Date Selected'}
        </Typography>
        <Button
          variant="contained"
          sx={{
            borderRadius: '999px',
            background: '#FF7A48',
            color: '#fff',
            fontWeight: 500,
            fontSize: { xs: '0.95rem', md: '1.05rem' },
            px: 3,
            py: 1.2,
            boxShadow: 'none',
            textTransform: 'none',
            '&:hover': {
              background: '#ff8a65',
              boxShadow: '0 2px 8px 0 rgba(255,122,72,0.10)',
            },
          }}
          disableElevation
        >
          {posts.length} Post{posts.length > 1 ? 's' : ''}
        </Button>
      </Box>
      <Grid container spacing={2} mt={4}>
        {posts.map(post => (
          <Grid key={post.id} size={{ xs: 12, sm: 6, md: 6 }}>
            <ClientPostCard post={post} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default PostsList;
