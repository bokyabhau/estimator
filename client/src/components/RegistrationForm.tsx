import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Grid,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import apiService from '../services/api';
import validationService from '../services/validation';

interface RegistrationFormProps {
  open: boolean;
  onClose: () => void;
}

export default function RegistrationForm({ open, onClose }: RegistrationFormProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // For phone number, only allow numeric input
    if (name === 'phoneNumber') {
      const sanitizedPhone = validationService.sanitizePhoneNumber(value);
      setFormData((prev) => ({
        ...prev,
        [name]: sanitizedPhone,
      }));
      return;
    }
    
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = (): boolean => {
    const validationError = validationService.validateRegistrationForm(formData);
    
    if (validationError) {
      setError(validationError);
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      await apiService.registerClient({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        password: formData.password,
      });

      // Reset form and close
      handleReset();
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      address: '',
      password: '',
      confirmPassword: '',
    });
    setError('');
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      fullScreen={isSmallScreen}
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: isSmallScreen ? 0 : 1,
        },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: 600,
          fontSize: {
            xs: '1.25rem',
            sm: '1.5rem',
          },
        }}
      >
        Create Account
      </DialogTitle>

      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
        {error && <Alert severity="error">{error}</Alert>}

        <Grid container spacing={2}>
          {/* First Name */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              disabled={loading}
              size={isSmallScreen ? 'small' : 'medium'}
              required
            />
          </Grid>

          {/* Last Name */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              disabled={loading}
              size={isSmallScreen ? 'small' : 'medium'}
              required
            />
          </Grid>

          {/* Email */}
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={loading}
              size={isSmallScreen ? 'small' : 'medium'}
              required
            />
          </Grid>

          {/* Phone Number */}
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Phone Number"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              placeholder="10-digit number"
              disabled={loading}
              size={isSmallScreen ? 'small' : 'medium'}
              inputProps={{ maxLength: 10 }}
              required
            />
          </Grid>

          {/* Address */}
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              multiline
              rows={3}
              disabled={loading}
              size={isSmallScreen ? 'small' : 'medium'}
              required
            />
          </Grid>

          {/* Password */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              disabled={loading}
              size={isSmallScreen ? 'small' : 'medium'}
              required
            />
          </Grid>

          {/* Confirm Password */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              disabled={loading}
              size={isSmallScreen ? 'small' : 'medium'}
              required
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ gap: 1, p: 2 }}>
        <Button
          onClick={onClose}
          disabled={loading}
          variant="outlined"
          size={isSmallScreen ? 'small' : 'medium'}
        >
          Back to Login
        </Button>
        <Button
          onClick={handleReset}
          disabled={loading}
          variant="text"
          size={isSmallScreen ? 'small' : 'medium'}
        >
          Clear
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          size={isSmallScreen ? 'small' : 'medium'}
          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
        >
          {loading ? (
            <>
              <CircularProgress size={20} color="inherit" />
              Registering...
            </>
          ) : (
            'Register'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
