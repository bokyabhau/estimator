import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  CircularProgress,
  Divider,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { GoogleLogin } from '@react-oauth/google';
import RegistrationForm from '../components/RegistrationForm';
import apiService from '../services/api';
import authService from '../services/auth';
import { useUser } from '../context/UserContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [registrationOpen, setRegistrationOpen] = useState(false);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isMediumScreen = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { setUser } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await apiService.loginClient({
        email,
        password,
      });

      // Save token and user info
      authService.saveToken(response.access_token);
      authService.saveUser(response.user);

      // Fetch full user profile with file URLs
      const profileResponse = await apiService.getClientById(response.user.id);
      const fullUserData = {
        id: response.user.id,
        email: response.user.email,
        firstName: response.user.firstName,
        lastName: response.user.lastName,
        stampUrl: profileResponse.data?.stampUrl || null,
        logoUrl: profileResponse.data?.logoUrl || null,
      };

      // Store in context
      setUser(fullUserData);

      // Navigate to home page
      navigate('/home');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (credentialResponse: any) => {
    setError('');
    setLoading(true);

    try {
      // Send the Google token to backend
      const response = await apiService.verifyGoogleToken(credentialResponse.credential);

      // Save token and user info
      authService.saveToken(response.access_token);
      authService.saveUser(response.user);

      // Store in context
      const fullUserData = {
        id: response.user.id,
        email: response.user.email,
        firstName: response.user.firstName,
        lastName: response.user.lastName,
        // stampUrl: response.user.stampUrl || '',
        // logoUrl: response.user.logoUrl || '',
      };

      setUser(fullUserData);

      // Navigate to home page
      navigate('/home');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Determine width based on screen size
  let width = '100%';
  if (!isSmallScreen && isMediumScreen) {
    width = '100%'; // md: full width with padding
  } else if (!isSmallScreen && !isMediumScreen) {
    width = '450px'; // lg and above
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: {
          xs: 2, // small screens
          sm: 2, // small
          md: 3, // medium
          lg: 0, // large
          xl: 0, // extra large
        },
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={8}
          sx={{
            padding: {
              xs: 2, // small screens: 16px
              sm: 3, // small: 24px
              md: 4, // medium: 32px
              lg: 4, // large: 32px
            },
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            width: {
              xs: '100%', // small: full width
              sm: '100%', // small: full width
              md: '100%', // medium: full width
              lg: width, // large: 450px
              xl: width, // extra large: 450px
            },
          }}
        >
          {/* Header */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant={isSmallScreen ? 'h5' : 'h4'}
              component="h1"
              sx={{
                fontWeight: 600,
                marginBottom: 1,
              }}
            >
              Estimator Admin
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{
                fontSize: {
                  xs: '0.875rem',
                  sm: '0.875rem',
                  md: '1rem',
                },
              }}
            >
              Sign in to your account
            </Typography>
          </Box>

          {/* Error Alert */}
          {error && <Alert severity="error">{error}</Alert>}

          {/* Form */}
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Email Field */}
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={loading}
              size={isSmallScreen ? 'small' : 'medium'}
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontSize: {
                    xs: '0.875rem',
                    sm: '0.875rem',
                    md: '1rem',
                  },
                },
              }}
            />

            {/* Password Field */}
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              disabled={loading}
              size={isSmallScreen ? 'small' : 'medium'}
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontSize: {
                    xs: '0.875rem',
                    sm: '0.875rem',
                    md: '1rem',
                  },
                },
              }}
            />

            {/* Login Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size={isSmallScreen ? 'small' : 'medium'}
              disabled={loading}
              sx={{
                padding: {
                  xs: '8px 16px',
                  sm: '10px 16px',
                  md: '12px 16px',
                },
                fontSize: {
                  xs: '0.875rem',
                  sm: '0.875rem',
                  md: '1rem',
                },
                fontWeight: 600,
                marginTop: 1,
              }}
            >
              {loading ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={20} color="inherit" />
                  Signing in...
                </Box>
              ) : (
                'Sign In'
              )}
            </Button>
          </Box>

          {/* Divider */}
          <Divider sx={{ my: 1 }}>OR</Divider>

          {/* Google Login */}
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            {!loading && (
              <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={() => setError('Google login failed. Please try again.')}
              />
            )}
          </Box>

          {/* Registration Link */}
          <Box sx={{ textAlign: 'center', pt: 1 }}>
            <Typography
              variant="body2"
              sx={{
                fontSize: {
                  xs: '0.75rem',
                  sm: '0.875rem',
                  md: '0.875rem',
                },
              }}
            >
              Don't have an account?{' '}
              <Button
                onClick={() => setRegistrationOpen(true)}
                disabled={loading}
                sx={{
                  textTransform: 'none',
                  p: 0,
                  fontSize: 'inherit',
                  fontWeight: 600,
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                Register here
              </Button>
            </Typography>
          </Box>

          {/* Footer */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="caption"
              color="textSecondary"
              sx={{
                fontSize: {
                  xs: '0.75rem',
                  sm: '0.75rem',
                  md: '0.875rem',
                },
              }}
            >
              © 2025 Estimator Admin. All rights reserved.
            </Typography>
          </Box>
        </Paper>
      </Container>

      {/* Registration Form Dialog */}
      <RegistrationForm open={registrationOpen} onClose={() => setRegistrationOpen(false)} />
    </Box>
  );
}

