import React from 'react';
import TeamMembersTable from './components/TeamMembersTable';
import { Button, Typography } from '@mui/material';
import AddMemberModal from './components/AddMemberModal';
import { useState } from 'react';

const accounts = [
  { id: 1, name: 'Main Company', logo: '', pmp_link: '', description: '', monthly_posts_limit: 30, created_at: '', updated_at: '', deleted_at: null },
  { id: 2, name: 'Tech Solutions', logo: '', pmp_link: '', description: '', monthly_posts_limit: 30, created_at: '', updated_at: '', deleted_at: null },
  { id: 3, name: 'Green Energy', logo: '', pmp_link: '', description: '', monthly_posts_limit: 30, created_at: '', updated_at: '', deleted_at: null },
  // ... add more as needed ...
];

export default function TeamMembers() {
  const [open, setOpen] = useState(false);
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Team Members</h1>
        <Button variant="contained" size="small" onClick={() => setOpen(true)}>
          <Typography variant="body1" textTransform="none" px={2} py={1}>
            Add Team Member
          </Typography>
        </Button>
        {/* <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded transition">Add Team Member</button> */}
      </div>
      <TeamMembersTable />
      <AddMemberModal open={open} onClose={() => setOpen(false)} accounts={accounts} />
    </div>
  );
}
