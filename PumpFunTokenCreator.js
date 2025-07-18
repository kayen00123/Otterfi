import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Card,
  CardContent,
  Grid,
  Chip,
  Link,
  useTheme
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { styled } from '@mui/material/styles';
import { useWallet } from '@solana/wallet-adapter-react';
import Header from '../components/Header';
import LiveFeed from '../components/LiveFeed';
import WalletConnectButton from '../components/WalletConnectButton';
import { 
  generateKeypair, 
  createTokenTransaction, 
  signAndSendTransaction, 
  uploadToIPFS,
  isValidSolanaAddress 
} from '../components/solanaUtils';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const GradientButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #00d4ff 30%, #ff6b35 90%)',
  border: 0,
  borderRadius: 12,
  boxShadow: '0 3px 5px 2px rgba(0, 212, 255, .3)',
  color: 'white',
  height: 48,
  padding: '0 30px',
  '&:hover': {
    background: 'linear-gradient(45deg, #0099cc 30%, #cc5529 90%)',
    boxShadow: '0 6px 10px 4px rgba(0, 212, 255, .3)',
  },
}));

function PumpFunTokenCreator() {
  const theme = useTheme();
  const { connected, publicKey } = useWallet();
  
  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    description: '',
    twitter: '',
    telegram: '',
    website: '',
    amount: 0.01,
    slippage: 10,
    priorityFee: 0.0005,
    pool: 'pump'
  });
  
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const API_KEY = '8tnqej216tj4wm3cctk54y1b5x272uhn6t1mcrbgan330p2qcgr52c3tf1536nvhdxkprkjqd5qm8vhjcd4m6nbda8t6cy3h95x46rkc8n766vjh613qjh1pehrk0y34d0v3eu9pcwyku8n8q8vbgf98kgkj4axbk8c9n5cdgt68nuu9ruq6jv7f565cgjg8526phtqddvkuf8';

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      if (!selectedFile.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      setFile(selectedFile);
      setError('');
    }
  };

  const createToken = async () => {
    if (!connected || !publicKey) {
      setError('Please connect your wallet first');
      return;
    }

    if (!file || !formData.name || !formData.symbol) {
      setError('Please fill in all required fields and select an image');
      return;
    }

    // Validate wallet address
    if (!isValidSolanaAddress(publicKey.toString())) {
      setError('Invalid wallet address');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      // Step 1: Generate keypair for the token
      console.log('Generating keypair...');
      const mintKeypair = generateKeypair();
      console.log('Generated mint address:', mintKeypair.publicKey);
      
      // Step 2: Upload metadata to IPFS
      console.log('Preparing metadata upload...');
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      uploadFormData.append('name', formData.name);
      uploadFormData.append('symbol', formData.symbol);
      uploadFormData.append('description', formData.description);
      uploadFormData.append('twitter', formData.twitter || '');
      uploadFormData.append('telegram', formData.telegram || '');
      uploadFormData.append('website', formData.website || '');
      uploadFormData.append('showName', 'true');

      const metadataResult = await uploadToIPFS(uploadFormData);
      console.log('Metadata uploaded successfully');

      // Step 3: Create transaction payload
      const createPayload = {
        publicKey: publicKey.toString(),
        action: 'create',
        tokenMetadata: {
          name: metadataResult.metadata.name,
          symbol: metadataResult.metadata.symbol,
          uri: metadataResult.metadataUri,
        },
        denominatedInSol: 'true',
        amount: parseFloat(formData.amount),
        slippage: parseInt(formData.slippage),
        priorityFee: parseFloat(formData.priorityFee),
        pool: formData.pool,
      };

      console.log('Creating transaction...');
      
      // Step 4: Get unsigned transaction from PumpPortal
      const transaction = await createTokenTransaction(API_KEY, createPayload, mintKeypair);
      
      // Step 5: Sign and send transaction with wallet (this will prompt user)
      console.log('Requesting wallet signature...');
      const signature = await signAndSendTransaction(transaction, { publicKey, connected }, mintKeypair);
      
      console.log('Token created successfully!');
      
      // Step 6: Set success result
      setResult({
        signature: signature,
        mint: mintKeypair.publicKey, // Use the generated mint public key
        metadata: metadataResult,
        tokenName: formData.name,
        tokenSymbol: formData.symbol,
      });

    } catch (err) {
      console.error('Token creation failed:', err);
      setError(err.message || 'An error occurred while creating the token');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: theme.palette.mode === 'dark' 
        ? 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)' 
        : 'linear-gradient(135deg, #f5f7fa, #c3cfe2)',
      pt: 4,
      pb: 8
    }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Header />
        
        <Box textAlign="center" mb={4} mt={4}>
          <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
            🚀 PumpFun Token Creator
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Create your own Solana token with wallet confirmation, instantly tradable on pump.fun and all major DEXes.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            {!connected ? (
              <Paper 
                elevation={0}
                className="glass"
                sx={{ p: 4, textAlign: 'center', borderRadius: 4 }}
              >
                <AccountBalanceWalletIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Connect Your Wallet
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  You need to connect your wallet to create tokens
                </Typography>
                <WalletConnectButton
                  variant="contained"
                  size="large"
                  sx={{
                    py: 1.5,
                    px: 4,
                    borderRadius: 3,
                    fontSize: '1rem',
                    textTransform: 'none',
                    background: 'linear-gradient(45deg, #9945FF 0%, #14F195 100%)',
                  }}
                />
              </Paper>
            ) : (
              <Paper 
                elevation={0}
                className="glass"
                sx={{ p: 4, mb: 3, borderRadius: 4 }}
              >
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Token Name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      variant="outlined"
                      placeholder="e.g., My Awesome Token"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Token Symbol"
                      name="symbol"
                      value={formData.symbol}
                      onChange={handleInputChange}
                      required
                      variant="outlined"
                      placeholder="e.g., MAT"
                      inputProps={{ maxLength: 10 }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      multiline
                      rows={3}
                      variant="outlined"
                      placeholder="Describe your token..."
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Twitter URL"
                      name="twitter"
                      value={formData.twitter}
                      onChange={handleInputChange}
                      variant="outlined"
                      placeholder="https://twitter.com/..."
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Telegram URL"
                      name="telegram"
                      value={formData.telegram}
                      onChange={handleInputChange}
                      variant="outlined"
                      placeholder="https://t.me/..."
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Website URL"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      variant="outlined"
                      placeholder="https://..."
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      component="label"
                      variant="outlined"
                      startIcon={<CloudUploadIcon />}
                      fullWidth
                      sx={{ height: 56, mb: 1 }}
                    >
                      {file ? file.name : 'Upload Token Image (Required)'}
                      <VisuallyHiddenInput
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </Button>
                    <Typography variant="caption" color="text.secondary">
                      Supported formats: PNG, JPG, GIF (Max 5MB)
                    </Typography>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                <Typography variant="h6" gutterBottom>
                  Advanced Settings
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={3}>
                    <TextField
                      fullWidth
                      label="Dev Buy (SOL)"
                      name="amount"
                      type="number"
                      value={formData.amount}
                      onChange={handleInputChange}
                      variant="outlined"
                      inputProps={{ min: 0.01, step: 0.01 }}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField
                      fullWidth
                      label="Slippage (%)"
                      name="slippage"
                      type="number"
                      value={formData.slippage}
                      onChange={handleInputChange}
                      variant="outlined"
                      inputProps={{ min: 1, max: 50 }}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField
                      fullWidth
                      label="Priority Fee (SOL)"
                      name="priorityFee"
                      type="number"
                      value={formData.priorityFee}
                      onChange={handleInputChange}
                      variant="outlined"
                      inputProps={{ min: 0.0001, step: 0.0001 }}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <FormControl fullWidth>
                      <InputLabel>Pool</InputLabel>
                      <Select
                        name="pool"
                        value={formData.pool}
                        onChange={handleInputChange}
                        label="Pool"
                      >
                        <MenuItem value="pump">Pump</MenuItem>
                        <MenuItem value="bonk">Bonk</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>

                <Box mt={4} textAlign="center">
                  <GradientButton
                    onClick={createToken}
                    disabled={loading}
                    size="large"
                    startIcon={loading ? <CircularProgress size={20} /> : <RocketLaunchIcon />}
                  >
                    {loading ? 'Creating Token...' : 'Create Token (Wallet Confirmation Required)'}
                  </GradientButton>
                </Box>
              </Paper>
            )}

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {result && (
              <Paper 
                elevation={0}
                className="glass"
                sx={{ p: 4, mb: 3, borderRadius: 4 }}
              >
                <Alert severity="success" sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    🎉 Token Created Successfully!
                  </Typography>
                  <Typography variant="body2">
                    Your token <strong>{result.tokenName} ({result.tokenSymbol})</strong> has been created on Solana!
                  </Typography>
                </Alert>

                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          Transaction Signature
                        </Typography>
                        <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                          {result.signature}
                        </Typography>
                        <Link
                          href={`https://solscan.io/tx/${result.signature}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{ mt: 1, display: 'inline-block' }}
                        >
                          View on Solscan →
                        </Link>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          Token Mint Address
                        </Typography>
                        <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                          {result.mint}
                        </Typography>
                        <Link
                          href={`https://solscan.io/token/${result.mint}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{ mt: 1, display: 'inline-block' }}
                        >
                          View Token →
                        </Link>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>

                <Box mt={3} textAlign="center">
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setResult(null);
                      setFormData({
                        name: '',
                        symbol: '',
                        description: '',
                        twitter: '',
                        telegram: '',
                        website: '',
                        amount: 0.01,
                        slippage: 10,
                        priorityFee: 0.0005,
                        pool: 'pump'
                      });
                      setFile(null);
                    }}
                    sx={{ mr: 2 }}
                  >
                    Create Another Token
                  </Button>
                  <Button
                    variant="contained"
                    href={`https://pump.fun/${result.mint}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      background: 'linear-gradient(45deg, #9945FF 0%, #14F195 100%)',
                    }}
                  >
                    View on Pump.fun
                  </Button>
                </Box>
              </Paper>
            )}
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper 
              elevation={0}
              className="glass"
              sx={{ p: 3, mb: 3, borderRadius: 4 }}
            >
              <Typography variant="h6" gutterBottom>
                💡 Tips for Success
              </Typography>
              <Box component="ul" sx={{ pl: 2, m: 0 }}>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  Choose a memorable and unique token name
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  Keep your symbol short (3-5 characters)
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  Use high-quality images (512x512px recommended)
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  Add social links to build trust
                </Typography>
                <Typography component="li" variant="body2">
                  Higher dev buy shows commitment to your project
                </Typography>
              </Box>
            </Paper>

            <Paper 
              elevation={0}
              className="glass"
              sx={{ p: 3, mb: 3, borderRadius: 4 }}
            >
              <Typography variant="h6" gutterBottom>
                ⚡ Live Token Feed
              </Typography>
              <LiveFeed />
            </Paper>

            <Paper 
              elevation={0}
              className="glass"
              sx={{ p: 3, borderRadius: 4 }}
            >
              <Typography variant="h6" gutterBottom>
                📊 Current Settings
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Chip 
                  label={`Dev Buy: ${formData.amount} SOL`} 
                  size="small" 
                  color="primary" 
                />
                <Chip 
                  label={`Slippage: ${formData.slippage}%`} 
                  size="small" 
                  color="secondary" 
                />
                <Chip 
                  label={`Priority Fee: ${formData.priorityFee} SOL`} 
                  size="small" 
                  color="info" 
                />
                <Chip 
                  label={`Pool: ${formData.pool.toUpperCase()}`} 
                  size="small" 
                  color="success" 
                />
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default PumpFunTokenCreator;
