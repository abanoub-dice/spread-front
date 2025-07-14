import React from 'react';
import StatusBadge from '../StatusBadge';
import { DropdownField } from '../../form/DropdownField';
import type { Platform, Status, Type } from '~/routes/client/protected/ClientHome';

interface PostsCalendarFilterProps {
  status: Status;
  platform: Platform | null;
  type: Type | null;
  onStatusChange: (status: Status) => void;
  onPlatformChange: (platform: Platform | null) => void;
  onTypeChange: (type: Type | null) => void;
}

const statuses: Status[] = ['All', 'Approved', 'Pending', 'Rejected', 'Sponsored'];
const platforms: Platform[] = ['Facebook', 'Instagram', 'X', 'Linkedin', 'Snapchat', 'Youtube', 'Tiktok'];
const types: Type[] = ['Static', 'Carousel', 'GIF', 'Video', 'Story', 'Copy Only Post', 'Article'];

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
        {statuses.map(s => (
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
            options={platforms.map(p => ({ label: p, value: p }))}
            value={platform ?? ''}
            onChange={e => {
              const value = e.target.value;
              onPlatformChange(typeof value === 'string' ? value as Platform : null);
            }}
            placeholder="Select Platform"
          />
        </div>
        <div style={{ minWidth: 180 }}>
          <DropdownField
            name="type"
            options={types.map(t => ({ label: t, value: t }))}
            value={type ?? ''}
            onChange={e => {
              const value = e.target.value;
              onTypeChange(typeof value === 'string' ? value as Type : null);
            }}
            placeholder="Select Type"
          />
        </div>
      </div>
    </div>
  );
};

export default PostsCalendarFilter;
