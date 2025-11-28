import { useState, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Alert,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import FolderIcon from '@mui/icons-material/Folder';
import authService from '../services/auth';
import apiService from '../services/api';
import { useUser } from '../context/UserContext';
import { getImageUrl } from '../utils/image';

export default function FilesSection() {
  const [stampFile, setStampFile] = useState<File | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');
  const stampInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const user = authService.getUser();
  const { user: contextUser, updateUser } = useUser();

  console.log('FilesSection contextUser:', contextUser);

  const handleFileSelect = (file: File | null, setFile: (file: File | null) => void) => {
    if (!file) return;
    setFile(file);
  };

  const handleFileUpload = async (fileType: 'stamp' | 'logo') => {
    const file = fileType === 'stamp' ? stampFile : logoFile;
    if (!file || !user) return;

    setUploadLoading(true);
    setUploadError('');
    setUploadSuccess('');

    try {
      // Use API service to upload file
      await apiService.uploadClientFile(user.id, fileType, file);

      setUploadSuccess(`${fileType} uploaded successfully!`);

      // Clear local file state
      if (fileType === 'stamp') {
        setStampFile(null);
      } else {
        setLogoFile(null);
      }

      // Refetch latest user profile to refresh context
      const latestResponse = await apiService.getClientById(user.id);
      const clientData = latestResponse.data || latestResponse;
      
      const updatedData: { stampUrl?: string | null; logoUrl?: string | null } = {};
      if (clientData?.stampUrl) updatedData.stampUrl = clientData.stampUrl;
      if (clientData?.logoUrl) updatedData.logoUrl = clientData.logoUrl;

      if (Object.keys(updatedData).length > 0) {
        updateUser(updatedData);
      }

      setTimeout(() => setUploadSuccess(''), 3000);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploadLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 600, marginBottom: 3 }}>
        Files
      </Typography>

      {uploadError && (
        <Alert severity="error" sx={{ marginBottom: 2 }}>
          {uploadError}
        </Alert>
      )}
      {uploadSuccess && (
        <Alert severity="success" sx={{ marginBottom: 2 }}>
          {uploadSuccess}
        </Alert>
      )}

      {/* Upload Sections */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
          gap: 3,
          marginBottom: 4,
        }}
      >
        {/* Stamp Upload */}
        <Paper
          sx={{
            padding: 3,
            textAlign: 'center',
            backgroundColor: 'rgba(33, 150, 243, 0.05)',
            border: '2px dashed rgba(33, 150, 243, 0.3)',
            cursor: 'pointer',
            transition: 'all 0.3s',
            '&:hover': {
              backgroundColor: 'rgba(33, 150, 243, 0.1)',
              borderColor: 'primary.main',
            },
          }}
        >
          <input
            ref={stampInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => handleFileSelect(e.target.files?.[0] || null, setStampFile)}
          />
          <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', marginBottom: 2 }} />
          <Typography variant="h6" sx={{ fontWeight: 600, marginBottom: 1 }}>
            Upload Stamp
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ marginBottom: 2 }}>
            {stampFile ? stampFile.name : 'Click to select or drag and drop'}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
            <Button
              size="small"
              variant="outlined"
              onClick={() => stampInputRef.current?.click()}
            >
              Browse
            </Button>
            {stampFile && (
              <Button
                size="small"
                variant="contained"
                color="primary"
                disabled={uploadLoading}
                onClick={() => handleFileUpload('stamp')}
              >
                {uploadLoading ? <CircularProgress size={20} /> : 'Upload'}
              </Button>
            )}
          </Box>
        </Paper>

        {/* Logo Upload */}
        <Paper
          sx={{
            padding: 3,
            textAlign: 'center',
            backgroundColor: 'rgba(76, 175, 80, 0.05)',
            border: '2px dashed rgba(76, 175, 80, 0.3)',
            cursor: 'pointer',
            transition: 'all 0.3s',
            '&:hover': {
              backgroundColor: 'rgba(76, 175, 80, 0.1)',
              borderColor: 'success.main',
            },
          }}
        >
          <input
            ref={logoInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => handleFileSelect(e.target.files?.[0] || null, setLogoFile)}
          />
          <CloudUploadIcon sx={{ fontSize: 48, color: 'success.main', marginBottom: 2 }} />
          <Typography variant="h6" sx={{ fontWeight: 600, marginBottom: 1 }}>
            Upload Logo
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ marginBottom: 2 }}>
            {logoFile ? logoFile.name : 'Click to select or drag and drop'}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
            <Button
              size="small"
              variant="outlined"
              onClick={() => logoInputRef.current?.click()}
            >
              Browse
            </Button>
            {logoFile && (
              <Button
                size="small"
                variant="contained"
                color="success"
                disabled={uploadLoading}
                onClick={() => handleFileUpload('logo')}
              >
                {uploadLoading ? <CircularProgress size={20} /> : 'Upload'}
              </Button>
            )}
          </Box>
        </Paper>
      </Box>

      {/* Current Files Preview */}
      <Typography variant="h6" sx={{ fontWeight: 600, marginBottom: 2, marginTop: 4 }}>
        Current Files
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
          gap: 2,
        }}
      >
        {/* Stamp Card */}
        <Card>
          <CardMedia
            sx={{
              height: 200,
              backgroundColor: 'rgba(33, 150, 243, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {contextUser?.stampUrl ? (
              <Box
                component="img"
                src={getImageUrl(contextUser.stampUrl) || contextUser.stampUrl}
                alt="Stamp"
                sx={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
              />
            ) : (
              <Box sx={{ textAlign: 'center', color: 'text.secondary' }}>
                <FolderIcon sx={{ fontSize: 48, marginBottom: 1 }} />
                <Typography variant="body2">No stamp uploaded</Typography>
              </Box>
            )}
          </CardMedia>
          <CardContent>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              Stamp
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {contextUser?.stampUrl ? 'Ready to use' : 'Upload to get started'}
            </Typography>
          </CardContent>
        </Card>

        {/* Logo Card */}
        <Card>
          <CardMedia
            sx={{
              height: 200,
              backgroundColor: 'rgba(76, 175, 80, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {contextUser?.logoUrl ? (
              <Box
                component="img"
                src={getImageUrl(contextUser.logoUrl) || contextUser.logoUrl}
                alt="Logo"
                sx={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
              />
            ) : (
              <Box sx={{ textAlign: 'center', color: 'text.secondary' }}>
                <FolderIcon sx={{ fontSize: 48, marginBottom: 1 }} />
                <Typography variant="body2">No logo uploaded</Typography>
              </Box>
            )}
          </CardMedia>
          <CardContent>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              Logo
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {contextUser?.logoUrl ? 'Ready to use' : 'Upload to get started'}
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
