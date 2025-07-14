import React, { useState } from 'react';
import PostsCalendarFilter from '../../../components/shared/PostsCalendarFilter/PostsCalendarFilter';

const statuses = ["All", "Approved", "Pending", "Rejected", "Sponsored"];
const platforms = [
  "Facebook",
  "Instagram",
  "X",
  "Linkedin",
  "Snapchat",
  "Youtube",
  "Tiktok",
];
const types = [
  "Static",
  "Carousel",
  "GIF",
  "Video",
  "Story",
  "Copy Only Post",
  "Article",
];

export default function ClientHome() {
  const [status, setStatus] = useState<string>(statuses[0]);
  const [platform, setPlatform] = useState<string | null>(null); // No default
  const [type, setType] = useState<string | null>(null); // No default

  return (
    <div className="flex flex-col items-start w-[95%] h-full m-auto">
      <PostsCalendarFilter
        status={status}
        platform={platform}
        type={type}
        onStatusChange={setStatus}
        onPlatformChange={setPlatform}
        onTypeChange={setType}
      />
      {/* The rest of the client home content goes here */}
    </div>
  );
}
