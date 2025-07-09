// src/pages/HomePage.jsx
import React from 'react';
import {
  Box,
  Button,
  Container,
  Typography,
  Stack,
  Paper,
  Grid,
  AppBar,
  Toolbar,
  IconButton,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/system';
import { motion } from 'framer-motion';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import DevicesIcon from '@mui/icons-material/Devices';
import BarChartIcon from '@mui/icons-material/BarChart';
import SecurityIcon from '@mui/icons-material/Security';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

const BackgroundBox = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  backgroundImage:
    'url(https://images.unsplash.com/photo-1605902711622-cfb43c44367f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(4),
  position: 'relative',
  overflow: 'hidden',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1,
  },
}));

const ScrollDownIndicator = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: theme.spacing(8),
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 3,
  color: '#ffffff',
  animation: 'bounce 2s infinite',
  '@keyframes bounce': {
    '0%, 100%': {
      transform: 'translateX(-50%) translateY(0)',
    },
    '50%': {
      transform: 'translateX(-50%) translateY(10px)',
    },
  },
}));

const GlassCard = styled(Paper)(({ theme }) => ({
  position: 'relative',
  zIndex: 2,
  padding: theme.spacing(6),
  borderRadius: '20px',
  backdropFilter: 'blur(15px)',
  background: 'rgba(255, 255, 255, 0.08)',
  color: '#fff',
  textAlign: 'center',
  maxWidth: '800px',
  margin: '0 auto',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  boxShadow: `
    0 0 10px rgba(255, 255, 255, 0.2),
    0 0 20px rgba(255, 255, 255, 0.2),
    0 0 40px rgba(0, 123, 255, 0.2),
    0 0 60px rgba(0, 123, 255, 0.15)
  `,
}));

const MotionTypography = motion(Typography);
const MotionButton = motion(Button);

function HomePage() {
  const navigate = useNavigate();

  return (
    <>
      <AppBar position="sticky" color="transparent" elevation={0} sx={{ backdropFilter: 'blur(10px)', background: 'rgba(0,0,0,0.3)' }}>
        <Toolbar>
          <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            Asset Manager
          </Typography>
          <Button
            color="inherit"
            startIcon={<LoginIcon fontSize="medium" />}
            onClick={() => navigate('/login')}
            sx={{ fontSize: '1rem', textTransform: 'none' }}
          >
            Login
          </Button>
          <Button
            color="inherit"
            startIcon={<PersonAddIcon fontSize="medium" />}
            onClick={() => navigate('/register')}
            sx={{ fontSize: '1rem', textTransform: 'none', ml: 2 }}
          >
            Register
          </Button>
        </Toolbar>
      </AppBar>

      <BackgroundBox>
        <Container maxWidth="md">
          <GlassCard elevation={0}>
            <MotionTypography
              variant="h3"
              component="h1"
              gutterBottom
              initial={{ opacity: 0, y: -40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              sx={{ fontWeight: 'bold' }}
            >
              Personal Asset Manager
            </MotionTypography>

            <MotionTypography
              variant="h6"
              gutterBottom
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 1 }}
              sx={{ color: '#e0e0e0' }}
            >
              Securely track and manage your belongings, anytime, anywhere.
            </MotionTypography>

            <MotionTypography
              variant="body1"
              sx={{ mt: 2, color: '#cfcfcf' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
            >
              Simplify your inventory with powerful tools designed for individuals and teams.
            </MotionTypography>

            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              justifyContent="center"
              sx={{ mt: 4 }}
            >
              <MotionButton
                variant="contained"
                size="large"
                color="primary"
                onClick={() => navigate('/login')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                startIcon={<LoginIcon />}
              >
                Login
              </MotionButton>
              <MotionButton
                variant="outlined"
                size="large"
                color="inherit"
                onClick={() => navigate('/register')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                startIcon={<PersonAddIcon />}
                sx={{
                  borderColor: '#ffffff',
                  color: '#ffffff',
                  '&:hover': {
                    borderColor: '#90caf9',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                  },
                }}
              >
                Register
              </MotionButton>
            </Stack>
          </GlassCard>
        </Container>
        <ScrollDownIndicator>
          <ArrowDownwardIcon fontSize="large" />
        </ScrollDownIndicator>
      </BackgroundBox>  

      <Container sx={{ py: 10 }}>
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          fontWeight="bold"
          sx={{ color: 'white' }}
        >
          What is Asset Management?
        </Typography>

        <Typography align="center" color="gray" sx={{ maxWidth: '700px', mx: 'auto', mb: 4 }}>
          Asset management is about knowing what you own, where it is, and how it’s being used. Our system helps you track physical and digital assets, assign them, and maintain them with ease.
        </Typography>

        <Box display="flex" justifyContent="center" mb={6}>
          <img
            src="https://www.scnsoft.com/blog-pictures/software-development-outsourcing/asset-management-software.png"
            alt="Asset Management Illustration"
            style={{ width: '100%', maxWidth: '700px', borderRadius: '16px' }}
          />
        </Box>

        <Grid container spacing={4} justifyContent="center">
          {[
            {
              icon: <DevicesIcon sx={{ fontSize: 50, color: 'primary.main' }} />,
              title: 'Track Assets',
              desc: 'Keep tabs on all your assets in one place with detailed tracking.',
            },
            {
              icon: <BarChartIcon sx={{ fontSize: 50, color: 'primary.main' }} />,
              title: 'Analytics',
              desc: 'Gain insights with real-time data, reports, and analytics.',
            },
            {
              icon: <SecurityIcon sx={{ fontSize: 50, color: 'primary.main' }} />,
              title: 'Secure Access',
              desc: 'Role-based access ensures your data stays safe and private.',
            },
          ].map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Paper
                elevation={3}
                sx={{
                  p: 4,
                  textAlign: 'center',
                  height: '100%',
                  background: 'rgba(255,255,255,0.03)',
                  backdropFilter: 'blur(8px)',
                  borderRadius: 4,
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#fff',
                }}
              >
                <Box mb={2}>{feature.icon}</Box>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="gray">
                  {feature.desc}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 10 }}>
  <Typography variant="h4" align="center" fontWeight="bold" color="white" gutterBottom>
    How It Works
  </Typography>
  <Grid container spacing={4} mt={4} justifyContent="center">
    {[
      {
        title: 'Add Assets',
        description: 'Upload items with details and images.',
        icon: '📦',
      },
      {
        title: 'Assign',
        description: 'Allocate to team members and track handovers.',
        icon: '🔗',
      },
      {
        title: 'Monitor & Report',
        description: 'Track usage, status, and generate reports.',
        icon: '📊',
      },
    ].map((step, i) => (
      <Grid item xs={12} sm={4} key={i}>
        <Paper
          elevation={3}
          sx={{
            textAlign: 'center',
            p: 4,
            borderRadius: 4,
            background: 'rgba(255,255,255,0.03)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#fff',
          }}
        >
          <Box mb={2} fontSize={50}>{step.icon}</Box>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            {step.title}
          </Typography>
          <Typography color="gray">{step.description}</Typography>
        </Paper>
      </Grid>
    ))}
  </Grid>
</Box>
      </Container>

      <Box
  sx={{
    py: 6,
    background: 'rgba(255,255,255,0.03)',
    backdropFilter: 'blur(8px)',
    borderTop: '1px solid rgba(255,255,255,0.1)',
  }}
>
  <Container>
    <Typography variant="h5" align="center" fontWeight="bold" color="white">
      Ready to take control of your assets?
    </Typography>
    <Stack direction="column" alignItems="center" spacing={2} mt={3}>
      <Button variant="contained" size="large" onClick={() => navigate('/register')}>
        Get Started Now
      </Button>
    </Stack>
  </Container>
</Box>

    </>
  );
}

export default HomePage;