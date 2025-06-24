import { useState } from 'react';
import {
  Box, TextField, Typography, Button, Paper,
  Stack, Snackbar, Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/authService';
import { jwtDecode } from 'jwt-decode';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';


function Login() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    try {
      const response = await loginUser(credentials);
      const token = response.token;
      login(token);
      const role = jwtDecode(token).role;

      setSuccessMessage('Login successful!');
      setTimeout(() => {
        if (role === 'ROLE_ADMIN' || role === 'ROLE_USER') {
          navigate('/dashboard');
        } else {
          navigate('/unauthorized');
        }
      }, 1000);
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  return (
    <Box
      sx={{
        height: '100vh',
        background: 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Paper
          elevation={10}
          sx={{
            width: '100%',
            maxWidth: 500,
            px: { xs: 3, sm: 4 },
            py: { xs: 4, sm: 5 },
            borderRadius: 4,
            background: 'rgba(18,18,18,0.75)',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <Stack spacing={1} alignItems="center" mb={4}>
            <img
              src="https://cdn-icons-png.flaticon.com/128/15368/15368503.png"
              alt=""
              width="100"
              height="100"
              style={{ marginBottom: 8 }}
            />
            <Typography variant="h4" fontWeight="bold" sx={{ color: '#00B0FF' }}>
              Asset Manager
            </Typography>
            <Typography variant="h6" fontWeight="bold" sx={{ color: '#aaa' }}>
              Sign in to continue
            </Typography>
          </Stack>

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              variant="filled"
              label="Username"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              sx={textFieldStyles}
              InputProps={{ disableUnderline: true }}
              InputLabelProps={{ sx: labelStyles }}
            />

            <TextField
              fullWidth
              variant="filled"
              type="password"
              label="Password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              sx={textFieldStyles}
              InputProps={{ disableUnderline: true }}
              InputLabelProps={{ sx: labelStyles }}
            />

            <Stack direction="row" justifyContent="space-between" mb={1}>
              <Typography
                variant="body2"
                sx={{
                  color: '#00B0FF',
                  cursor: 'pointer',
                  '&:hover': { textDecoration: 'underline' },
                }}
                onClick={() => navigate('/register')}
              >
                Register Here
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: '#00B0FF',
                  cursor: 'pointer',
                  '&:hover': { textDecoration: 'underline' },
                }}
                onClick={() => navigate('/forgot-password')}
              >
                Forgot password?
              </Typography>
            </Stack>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                py: 1.3,
                fontWeight: 'bold',
                textTransform: 'none',
                fontSize: '1rem',
                background: 'linear-gradient(135deg, #00B0FF, #0088cc)',
                color: '#fff',
                borderRadius: '10px',
                '&:hover': {
                  background: 'linear-gradient(135deg, #0096e0, #0077aa)',
                },
              }}
            >
              Sign In
            </Button>
          </Box>
        </Paper>
      </motion.div>

      {/* Snackbars */}
      <Snackbar
        open={!!error}
        autoHideDuration={4000}
        onClose={() => setError('')}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setError('')}
          severity="error"
          sx={{ width: '100%', bgcolor: '#d32f2f', color: '#fff' }}
          role="alert"
        >
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!successMessage}
        autoHideDuration={3000}
        onClose={() => setSuccessMessage('')}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSuccessMessage('')}
          severity="success"
          sx={{ width: '100%', bgcolor: '#388e3c', color: '#fff' }}
          role="alert"
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

const textFieldStyles = {
  mb: 2,
  '& .MuiFilledInput-root': {
    backgroundColor: '#1e1e1e',
    borderRadius: '10px',
    color: '#fff',
    padding: '6px 12px',
    fontSize: '0.9rem',
    transition: '0.3s ease',
    '&:hover': {
      backgroundColor: '#252525',
    },
    '&.Mui-focused': {
      backgroundColor: '#252525',
      boxShadow: '0 0 0 2px #00B0FF',
    },
  },
};

const labelStyles = {
  color: '#aaa',
  '&.Mui-focused': {
    color: '#00B0FF',
  },
};

export default Login;
