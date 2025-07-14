import React from 'react';
import StatusBadge from '../StatusBadge';
import { DropdownField } from '../../form/DropdownField';

interface PostsCalendarFilterProps {
  status: string;
  platform: string | null;
  type: string | null;
  onStatusChange: (status: string) => void;
  onPlatformChange: (platform: string | null) => void;
  onTypeChange: (type: string | null) => void;
}

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

const PostsCalendarFilter: React.FC<PostsCalendarFilterProps> = ({
  status,
  platform,
  type,
  onStatusChange,
  onPlatformChange,
  onTypeChange,
}) => {
  return (
    <div className="flex items-center justify-between w-full py-4 my-4">
      {/* Status Badges */}
      <div className="flex items-center gap-2">
        {statuses.map((s) => (
          <StatusBadge
            key={s}
            status={s as any}
            selected={status === s}
            onClick={() => onStatusChange(s)}
          />
        ))}
      </div>
      {/* Dropdowns */}
      <div className="flex items-center gap-4">
        <div style={{ minWidth: 180 }}>
          <DropdownField
            name="platform"
            options={platforms.map((p) => ({ label: p, value: p }))}
            value={platform ?? ""}
            onChange={(e) => {
              const value = e.target.value;
              onPlatformChange(typeof value === 'string' ? (value || null) : null);
            }}
            placeholder="Select Platform"
          />
        </div>
        <div style={{ minWidth: 180 }}>
          <DropdownField
            name="type"
            options={types.map((t) => ({ label: t, value: t }))}
            value={type ?? ""}
            onChange={(e) => {
              const value = e.target.value;
              onTypeChange(typeof value === 'string' ? (value || null) : null);
            }}
            placeholder="Select Type"
          />
        </div>
      </div>
    </div>
  );
};

export default PostsCalendarFilter;