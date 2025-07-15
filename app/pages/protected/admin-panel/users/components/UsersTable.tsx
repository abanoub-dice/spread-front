import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Typography,
  Tooltip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { FiEdit } from 'react-icons/fi';
import { GoTrash } from 'react-icons/go';
import { PiPasswordDuotone } from "react-icons/pi";
import { UserRole, UserRoleLabel } from '~/utils/interfaces/role';
import type { User } from '~/utils/interfaces/user';
import { StatusChip } from '~/components/StatusChip';

interface UsersTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onChangePassword: (user: User) => void;
  currentUserId?: number;
}

const ROLE_COLORS = {
  [UserRole.ADMIN]: '#FF4D4F',  // Error red
  [UserRole.PROJECT_MANAGER]: '#1890FF',   // Primary blue
  [UserRole.PRODUCTION_MEMBER]: '#52C41A',  // Success green
} as const;

export default function UsersTable({ users, onEdit, onDelete, onChangePassword, currentUserId }: UsersTableProps) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <TableContainer component={Paper}  sx={{ minHeight: '50vh' }}>
      <Table sx={{ width: '100%' }}>
        <TableHead>
          <TableRow>
            <TableCell width="25%">
              <Typography variant="h3">Email</Typography>
            </TableCell>
            <TableCell width="15%">
              <Typography variant="h3">First Name</Typography>
            </TableCell>
            <TableCell width="20%">
              <Typography variant="h3">Last Name</Typography>
            </TableCell>
            <TableCell width="10%">
              <Typography variant="h3">Role</Typography>
            </TableCell>
            <TableCell width="30%" align="right">
              <Typography variant="h3">Actions</Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map(user => (
            <TableRow
              key={user.id}
              sx={{
                '& td': {
                  py: 1,
                },
              }}
            >
              <TableCell>
                <Typography variant="subHeader" noWrap>
                  {user.email}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subHeader" noWrap>
                  {user.firstName}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subHeader" noWrap>
                  {user.lastName}
                </Typography>
              </TableCell>
              <TableCell>
                <StatusChip
                  label={UserRoleLabel[user.type]}
                  color={ROLE_COLORS[user.type]}
                />
              </TableCell>
              <TableCell align="right">
                {currentUserId !== user.id && (
                  <Tooltip title="Change Password">
                    <IconButton
                      onClick={() => onChangePassword(user)}
                      sx={{
                        '&:hover': {
                          color: 'primary.main',
                        },
                        mr: 0,
                        '& svg': {
                          fontSize: {
                            xs: '14px',
                            sm: '16px',
                            md: '18px',
                          },
                        },
                      }}
                    >
                      <PiPasswordDuotone />
                    </IconButton>
                  </Tooltip>
                )}
                <Tooltip title="Edit User">
                  <IconButton
                    onClick={() => onEdit(user)}
                      sx={{
                      '&:hover': {
                        color: 'primary.main',
                      },
                      mr: 0,
                      '& svg': {
                        fontSize: {
                          xs: '14px',
                          sm: '16px',
                          md: '18px',
                        },
                      },
                    }}
                  >
                    <FiEdit />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete User">
                  <IconButton
                    onClick={() => onDelete(user)}
                    sx={{
                      '&:hover': {
                        color: 'error.main',
                      },
                      mr: 0,
                      '& svg': {
                        fontSize: {
                          xs: '14px',
                          sm: '16px',
                          md: '18px',
                        },
                      },
                    }}
                  >
                    <GoTrash />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
