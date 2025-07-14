import React, { useState } from 'react';
import PostsCalendarFilter from '../../../components/shared/PostsCalendarFilter/PostsCalendarFilter';
import { Box, Typography } from '@mui/material';
import OpenCalendar from '~/components/shared/OpenCalendar/OpenCalendar';
import PostsList from '~/components/shared/PostsList/PostsList';
import dayjs from '~/utils/date/dayjs';
import type { Dayjs } from 'dayjs';

export type Status = 'All' | 'Approved' | 'Pending' | 'Rejected' | 'Sponsored';
export type Platform =
  | 'Facebook'
  | 'Instagram'
  | 'X'
  | 'Linkedin'
  | 'Snapchat'
  | 'Youtube'
  | 'Tiktok';
export type Type = 'Static' | 'Carousel' | 'GIF' | 'Video' | 'Story' | 'Copy Only Post' | 'Article';

export default function ClientHome() {
  // Static UTC publishing dates
  const publishing_dates: string[] = [
    '2025-04-20 15:43:00',
    '2025-04-25 10:00:00',
    '2025-05-01 08:30:00',
  ];

  // Convert to local dayjs objects (strip time for calendar day matching)
  const allowedDates =
    publishing_dates?.length > 0
      ? publishing_dates.map(date => dayjs.utc(date).local().startOf('day'))
      : [];

  // Find the nearest coming date (today or after)
  const today = dayjs().startOf('day');
  const nearestDate =
    allowedDates.length > 0
      ? allowedDates.find(d => d.isSameOrAfter(today)) || allowedDates[0]
      : null;

  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(nearestDate);
  const [status, setStatus] = useState<Status>('All');
  const [platform, setPlatform] = useState<Platform | null>(null);
  const [type, setType] = useState<Type | null>(null);

  return (
    <div className="flex flex-col items-start w-[95%] h-full m-auto">
      <PostsCalendarFilter
        status={status}
        platform={platform}
        type={type}
        onStatusChange={(status: Status) => setStatus(status)}
        onPlatformChange={setPlatform}
        onTypeChange={setType}
      />

      {/* Show a message if there are no allowed dates */}
      {allowedDates.length === 0 ? (
        <Typography variant="h3" className="w-full text-center text-gray-500 py-8">
          No publishing dates available for this filter set.
        </Typography>
      ) : (
        <>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              gap: 2,
              width: '100%',
              height: '100%',
              mb: 4,
            }}
          >
            <Box
              sx={{
                flex: { xs: '0 0 auto', md: '1 1 28%' },
                width: { xs: '100%', md: '33%' },
                my: { xs: 2, md: 0 },
              }}
            >
              {selectedDate && (
                <OpenCalendar
                  allowedDates={allowedDates}
                  selectedDate={selectedDate}
                  onDateChange={setSelectedDate}
                />
              )}
            </Box>
            <Box
              sx={{
                flex: { xs: '0 0 auto', md: '2 1 70%' },
                width: { xs: '100%', md: '67%' },
                border: '1px solid #e0e0e0',
                backgroundColor: 'white',
                borderRadius: '10px',
              }}
            >
              <PostsList 
                status={status}
                platform={platform}
                type={type}
                selectedDate={selectedDate}
              />
            </Box>
          </Box>
        </>
      )}
      {/* The rest of the client home content goes here */}
    </div>
  );
}
