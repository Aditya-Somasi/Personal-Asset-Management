// src/pages/HomePage.jsx
import React from 'react';
import { Box, Button, Container, Typography, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/system';
import { motion } from 'framer-motion';

const BackgroundBox = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  backgroundImage: 'url(https://images.unsplash.com/photo-1605902711622-cfb43c44367f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.common.white,
  textShadow: '1px 1px 4px rgba(0,0,0,0.7)',
}));

const MotionTypography = motion(Typography);

function HomePage() {
  const navigate = useNavigate();

  return (
    <BackgroundBox>
      <Container maxWidth="md" sx={{ textAlign: 'center' }}>
        <MotionTypography
          variant="h2"
          component="h1"
          gutterBottom
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          sx={{ fontWeight: 'bold' }}
        >
          Welcome to Personal Asset Management
        </MotionTypography>

        <MotionTypography
          variant="h5"
          gutterBottom
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
        >
          Manage and track your assets effortlessly with advanced inventory tools.
        </MotionTypography>

        <MotionTypography
          variant="body1"
          sx={{ mt: 2 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
        >
          Whether you’re a personal user keeping track of your belongings or an admin assigning assets to your team,
          our app simplifies asset management with powerful features and a modern user experience.
        </MotionTypography>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center" sx={{ mt: 4 }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => navigate('/login')}
            component={motion.button}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            Login
          </Button>
          <Button
            variant="outlined"
            color="inherit"
            size="large"
            onClick={() => navigate('/register')}
            component={motion.button}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            Register
          </Button>
        </Stack>
      </Container>
    </BackgroundBox>
  );
}

export default HomePage;
