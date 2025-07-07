import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  CircularProgress,
  Alert,
  Box,
  TextField,
  TablePagination,
  Chip,
  Button,
  Select,
  MenuItem,
  FormControl,
  useTheme,
  TableContainer,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Tooltip,
} from '@mui/material';
import { fetchUsers } from '../services/userService';
import Layout from '../components/Layout';
import { jwtDecode } from 'jwt-decode';
import { ArrowUpward, ArrowDownward, Close } from '@mui/icons-material';

function UsersPage({ darkMode, toggleDarkMode }) {
  const [users, setUsers] = useState([]);
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortConfigs, setSortConfigs] = useState([{ key: 'username', direction: 'asc' }]);
  const [roleFilter, setRoleFilter] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const token = localStorage.getItem('token');

  const allColumns = [
    { key: 'username', label: 'Username' },
    { key: 'role', label: 'Role' },
    { key: 'assignedAssetCount', label: 'Assigned Assets' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const decoded = jwtDecode(token);
        setRole(decoded.role);
        if (decoded.role !== 'ROLE_ADMIN') {
          setError('Access denied. Admins only.');
          setLoading(false);
          return;
        }
        const userList = await fetchUsers(token);
        setUsers(userList);
      } catch (err) {
        setError('Failed to load user list.');
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchData();
  }, [token]);

  const handleSort = (key) => {
    setSortConfigs((prev) => {
      const existing = prev.find((s) => s.key === key);
      if (existing) {
        const newDir = existing.direction === 'asc' ? 'desc' : 'asc';
        return [{ key, direction: newDir }, ...prev.filter((s) => s.key !== key)];
      }
      return [{ key, direction: 'asc' }, ...prev];
    });
  };

  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredUsers = users.filter((user) => {
    const matchesQuery =
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === '' || user.role === roleFilter;
    return matchesQuery && matchesRole;
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    for (let sort of sortConfigs) {
      const { key, direction } = sort;
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const paginatedUsers = sortedUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const exportToCSV = () => {
    const csv = [
      ['Username', 'Role', 'Assigned Assets'],
      ...filteredUsers.map((u) => [u.username, u.role, u.assignedAssetCount])
    ]
      .map((r) => r.join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'users.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const getSortIcon = (col) => {
    const active = sortConfigs.find((s) => s.key === col);
    return active
      ? active.direction === 'asc'
        ? <ArrowUpward fontSize="small" />
        : <ArrowDownward fontSize="small" />
      : <ArrowUpward fontSize="small" sx={{ opacity: 0.3 }} />;
  };

  const handleRowClick = (user) => setSelectedUser(user);

  if (loading) {
    return (
      <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
        <Container sx={{ mt: 4, textAlign: 'center' }}>
          <CircularProgress />
        </Container>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
        <Container sx={{ mt: 4 }}>
          <Alert severity="error">{error}</Alert>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
      <Container sx={{ mt: 5 }}>
        <Typography variant="h4" fontWeight={700} mb={2}>
          👥 Registered Users
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
          <TextField
            label="Search username or role"
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ width: 250 }}
          />
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <Select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              displayEmpty
              renderValue={(selected) => selected ? selected.replace('ROLE_', '') : 'All Roles'}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="ROLE_ADMIN">Admin</MenuItem>
              <MenuItem value="ROLE_USER">User</MenuItem>
            </Select>
          </FormControl>
          <Button variant="contained" color="secondary" onClick={exportToCSV}>
            📄 Export CSV
          </Button>
        </Box>

        <Paper elevation={3} sx={{ borderRadius: 3 ,overflow: 'hidden' }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow sx={{ backgroundColor: isDark ? '#FFD700' : '#1976d2' }}>
                  {allColumns.map(({ key, label }) => (
                    <Tooltip key={key} title={`Click to sort by ${label}`} arrow>
                      <TableCell
                        onClick={() => handleSort(key)}
                        sx={{
                          cursor: 'pointer',
                          color: isDark ? '#000' : '#fff',
                          fontWeight: 'bold',
                          textAlign: 'center',
                          backgroundColor: sortConfigs[0].key === key
                            ? (isDark ? '#fbc02d' : '#64b5f6') // stronger contrast
                            : 'inherit'
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                          {label}
                          {getSortIcon(key)}
                        </Box>
                      </TableCell>
                    </Tooltip>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedUsers.length === 0 ? (
                  <TableRow><TableCell colSpan={3} align="center">No users found.</TableCell></TableRow>
                ) : (
                  paginatedUsers.map((user) => (
                    <TableRow
                      key={user.id}
                      hover
                      onClick={() => handleRowClick(user)}
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell align="center">{user.username}</TableCell>
                      <TableCell align="center">
                        <Chip
                          label={user.role.replace('ROLE_', '')}
                          color={user.role === 'ROLE_ADMIN' ? 'error' : 'primary'}
                          variant="outlined"
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">{user.assignedAssetCount}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={filteredUsers.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 20]}
          />
        </Paper>

        <Dialog open={Boolean(selectedUser)} onClose={() => setSelectedUser(null)}>
          <DialogTitle>
            User Details
            <IconButton sx={{ position: 'absolute', right: 8, top: 8 }} onClick={() => setSelectedUser(null)}>
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            {selectedUser && (
              <Box>
                <Typography><strong>Username:</strong> {selectedUser.username}</Typography>
                <Typography><strong>Role:</strong> {selectedUser.role}</Typography>
                <Typography><strong>Assigned Assets:</strong> {selectedUser.assignedAssetCount}</Typography>
              </Box>
            )}
          </DialogContent>
        </Dialog>
      </Container>
    </Layout>
  );
}

export default UsersPage;
