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
  CssBaseline,
  TextField,
  TablePagination,
  Chip,
  Button,
  Switch,
  Tooltip,
} from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Layout from '../components/Layout';
import { fetchUsers } from '../services/userService';
import { jwtDecode } from 'jwt-decode';

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const token = localStorage.getItem('token');

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: { main: '#1976d2' },
      secondary: { main: '#f50057' },
      background: {
        default: darkMode ? '#121212' : '#f5f5f5',
        paper: darkMode ? '#1e1e1e' : '#ffffff',
      },
      text: {
        primary: darkMode ? '#fff' : '#000',
      },
    },
    shape: { borderRadius: 6 },
    typography: {
      fontFamily: 'Roboto, sans-serif',
    },
  });

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
        console.error('Failed to fetch users:', err);
        setError('Failed to load user list.');
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchData();
  }, [token]);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedUsers = filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const exportToCSV = () => {
    const csv = [
      ['Username', 'Role', 'Assigned Assets'],
      ...filteredUsers.map(user => [user.username, user.role, user.assignedAssetCount])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'users.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Layout>
          <Container sx={{ mt: 4, textAlign: 'center' }}>
            <CircularProgress />
          </Container>
        </Layout>
      </ThemeProvider>
    );
  }

  if (error) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Layout>
          <Container sx={{ mt: 4 }}>
            <Alert severity="error">{error}</Alert>
          </Container>
        </Layout>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Layout>
        <Container sx={{ mt: 5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" fontWeight={700}>
              👥 Registered Users
            </Typography>
            <Tooltip title="Toggle Dark Mode">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Switch checked={darkMode} onChange={() => setDarkMode(prev => !prev)} />
                <Brightness4Icon sx={{ color: theme.palette.text.primary }} />
              </Box>
            </Tooltip>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, mb: 3 }}>
            <TextField
              label="Search username or role"
              variant="outlined"
              size="small"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ width: '100%', maxWidth: 320 }}
            />
            <Button
              variant="contained"
              onClick={exportToCSV}
              color="secondary"
              sx={{ textTransform: 'none', fontWeight: 'bold', height: '40px' }}
            >
              📄 Export CSV
            </Button>
          </Box>

          <Paper
            elevation={3}
            sx={{
              borderRadius: 4,
              overflowX: 'auto',
            }}
          >
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: darkMode ? '#FFD700' : '#1976d2' }}>
                  {['Username', 'Role', 'Assigned Assets'].map(header => (
                    <TableCell
                      key={header}
                      sx={{
                        fontWeight: 'bold',
                        color: darkMode ? '#000' : '#fff',
                        textAlign: 'center',
                        fontSize: '16px',
                      }}
                    >
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {paginatedUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      No users found.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedUsers.map((user) => (
                    <TableRow
                      key={user.id}
                      hover
                      sx={{
                        transition: 'all 0.3s ease-in-out',
                        '&:hover': {
                          backgroundColor: darkMode ? '#2c2c2c' : '#f0f8ff',
                        },
                      }}
                    >
                      <TableCell align="center" sx={{ color: theme.palette.text.primary }}>
                        {user.username}
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={user.role.replace('ROLE_', '')}
                          color={user.role === 'ROLE_ADMIN' ? 'error' : 'primary'}
                          variant="outlined"
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center" sx={{ color: theme.palette.text.primary }}>
                        {user.assignedAssetCount}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            <TablePagination
              component="div"
              count={filteredUsers.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 20]}
              sx={{
                backgroundColor: theme.palette.background.paper,
                '& .MuiTablePagination-toolbar': {
                  justifyContent: 'flex-end',
                  color: theme.palette.text.primary,
                },
              }}
            />
          </Paper>
        </Container>
      </Layout>
    </ThemeProvider>
  );
}

export default UsersPage;
