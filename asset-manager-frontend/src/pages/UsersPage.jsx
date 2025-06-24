import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Table, TableHead, TableBody,
  TableRow, TableCell, Paper, CircularProgress, Alert
} from '@mui/material';
import Layout from '../components/Layout';
import { fetchUsers } from '../services/userService';
import { jwtDecode } from 'jwt-decode';

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

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

  if (loading) {
    return (
      <Layout>
        <Container sx={{ mt: 4 }}><CircularProgress /></Container>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Container sx={{ mt: 4 }}><Alert severity="error">{error}</Alert></Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>Registered Users</Typography>
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Username</strong></TableCell>
                <TableCell><strong>Role</strong></TableCell>
                <TableCell><strong>Assigned Assets</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.assignedAssetCount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Container>
    </Layout>
  );
}

export default UsersPage;
