import React, { useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Pagination from '~/components/shared/Pagination';
import { Typography } from '@mui/material';
import { useDialogueStore } from '~/utils/store/zustandHooks';


const membersData = {
  current_page: 1,
  data: [
    { id: 1, name: 'Admin User', email: 'amir.haroun@dicema.com', role: 'Admin' },
    { id: 2, name: 'Account Manager', email: 'manager@example.com', role: 'Account Manager' },
    {
      id: 3,
      name: 'Social Media Specialist',
      email: 'specialist@example.com',
      role: 'Social Media Specialist',
    },
    { id: 4, name: 'Dicer 1', email: 'dicer1@example.com', role: 'Social Media Specialist' },
    { id: 5, name: 'Dicer 2', email: 'dicer2@example.com', role: 'Social Media Specialist' },
    { id: 6, name: 'Dicer 3', email: 'dicer3@example.com', role: 'Social Media Specialist' },
    { id: 7, name: 'Dicer 4', email: 'dicer4@example.com', role: 'Social Media Specialist' },
    { id: 8, name: 'Dicer 5', email: 'dicer5@example.com', role: 'Social Media Specialist' },
    { id: 9, name: 'very new', email: 'new@gmail.com', role: 'Social Media Specialist' },
  ],
  last_page: 1,
  total: 9,
};

const TeamMembersTable: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(membersData.current_page);
  const setDialogue = useDialogueStore((state) => state.setDialogue);

  const handleDelete = (member: typeof membersData.data[number]) => {
    setDialogue({
      show: true,
      title: 'Delete Team Member',
      text: `Are you sure you want to delete ${member.name}?`,
      acceptLabel: 'Delete',
      acceptColor: 'error',
      closable: true,
      onAccept: () => {
        // Replace this with actual delete logic
        console.log('Deleting member:', member);
      },
    });
  };

  return (
    <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}><Typography variant="h3" textTransform="none">Name</Typography></TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}><Typography variant="h3" textTransform="none">Email</Typography></TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}><Typography variant="h3" textTransform="none">Role</Typography></TableCell>
              <TableCell sx={{ fontWeight: 'bold' }} align="right"><Typography variant="h3" textTransform="none">Actions</Typography></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {membersData.data.map(member => (
              <TableRow
                key={member.id}
                hover
                sx={{
                  '&:hover': {
                    backgroundColor: 'grey.100',
                  },
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <TableCell><Typography variant="body1" textTransform="none">{member.name}</Typography></TableCell>
                <TableCell><Typography variant="body2" textTransform="none">{member.email}</Typography></TableCell>
                <TableCell><Typography variant="body2" textTransform="none">{member.role}</Typography></TableCell>
                <TableCell align="right">
                  <Button variant="contained" color="warning" size="small" sx={{ mr: 1 }} onClick={() => handleDelete(member)}>
                    <Typography variant="body2" textTransform="none">
                      Edit
                    </Typography>
                  </Button>
                  <Button variant="contained" color="error" size="small" onClick={() => handleDelete(member)}>
                    <Typography variant="body2" textTransform="none">
                      Delete
                    </Typography>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div style={{ margin: '16px' }}>
        <Pagination
          currentPage={currentPage}
          totalPages={membersData.last_page}
          onPageChange={setCurrentPage}
        />
      </div>
    </Paper>
  );
};

export default TeamMembersTable;
