import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  TextField, 
  Button, 
  IconButton, 
  FormControl, 
  Select, 
  MenuItem, 
  InputAdornment,
  Snackbar,
  Alert,
  AlertTitle,
  CircularProgress,
  Divider,
  Tooltip,
  useTheme,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Radio,
  RadioGroup,
  Chip,
  Tabs,
  Tab
} from '@mui/material';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import SettingsIcon from '@mui/icons-material/Settings';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import SearchIcon from '@mui/icons-material/Search';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import RefreshIcon from '@mui/icons-material/Refresh';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { Transaction } from '@solana/web3.js';
import { Buffer } from 'buffer';
import { VersionedTransaction } from '@solana/web3.js';
import { Link } from 'react-router-dom';
import WalletConnectButton from '../components/WalletConnectButton';
import Header from '../components/Header';
import { useTokenList } from '../utils/tokenList';
import { getTokenBalance, validateSolanaAddress, fetchTokenInfo } from '../utils/tokenUtils';
import { useLocalStorage } from '../hooks/useLocalStorage';
import TradingViewChart from '../components/TradingViewChart';
import TrendingSolanaTokens from '../components/TrendingSolanaTokens';
import { recordTransaction } from '../services/analyticsService';
import CloseIcon from '@mui/icons-material/Close';
import SwapDetails from '../components/SwapDetails';
import bs58 from 'bs58';
import nacl from 'tweetnacl';
import { useSearchParams } from 'react-router-dom';
import { 
  createTransferInstruction, 
  getAssociatedTokenAddress, 
  createAssociatedTokenAccountInstruction,
  getAccount,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID
} from '@solana/spl-token';
import { Keypair } from '@solana/web3.js';
import BN from 'bn.js';


const formatUsdValue = (value) => {
  if (value === null || value === undefined) return '';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};


const FEE_BPS = 40; // 0.4% = 40 basis points

const FEE_ACCOUNTS = {
  // SOL fee account
 "So11111111111111111111111111111111111111112": "8Bs1aHeo2aje8MqXBEK6JPwVp6qMo5STGQbiYfGQ4Vf8",
   
  // USDT fee account
 "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB": "C7MPZc9VbMo5EhBaXTLZtQrwCLmVg3McHGbVPuAEvbsK",
   
  // JUP fee account
 "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN": "D7R576QacfN4hSnZbqikyp6rDum6LmhWBcz6UqskmA5f",
   
 // POX fee account
 "mpoxP5wyoR3eRW8L9bZjGPFtCsmX8WcqU5BHxFW1xkn": "GXJPxdp4ncFkSRxCytRutsHiC8pTcnvxxTgSPBzbgAwD",
 
 // TRUMP fee account
 "6p6xgHyF7AeE6TZkSmFsko444wqoP15icUSqi2jfGiPN": "CEg3V9jV3RJsUbtvE22RRCtjfGpajd86WuipT1AuwYL6",
   
 // FART fee account
 "9BB6NFEcjBCtnNLFko2FqVQBq8HHM13kCyYcdQbgpump": "6z6acWg1dwP3yuuGukYntKwGnz2qKAtjyQheRfUpMADt",
 
 // cbBTC fee account
 "cbbtcf3aa214zXHbiAZQwf4122FBYbraNdFqgw4iMij": "Dg7RehydfJFVxpkX4JkwpPY99Tecoy1EW8MCnUzbHf3g",
 
 // USDe fee account
 "DEkqHyPN7GMRJ5cArtQFAWefqbZb33Hyf6s5iCwjEonT": "DAxZkUQwjCvptuZqpidCUQWXUfC4VmwEUMjReJwz3KDb",
 
 // GRASS fee account
 "Grass7B4RdKfBCjTKgSqnXkqjwiGvQyFbuSCUJr3XXjs": "Any33YEWfCUJF6PZiTDRYaVTu4uGVRS75jTSP3deqkPF",
   
 // Bonk fee account
 "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263": "Bi5hqaKCbaoZvh2BSTawyxC2g5bCadqFgaVXQ2cxATJM",
 
 // WIF fee account
 "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm": "8cBMbQc3Sxe8SoUwyFWe9Kp596sX78jSUeJpZ3u8FtcD",
 
 // JitoSOL fee account
 "J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn": "878UfhL2rQqQsKeYsMdWkqH5xYJ1pASjbKjFr5H89Uxd",
 
 // RAY fee account
 "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R": "DYr38CN5mrWk4MgnufogniyRK9xKVWnVzrKRMGYbzx4h",
 
   // Default fee account for all other tokens
   "DEFAULT": "J3mmyrV6bFSbejBHC3kBzhdY17Y7gJSx1bR53Lx8oQ2V"
 };

const OTFI_TOKEN_MINT = "A1CjRHDCTJndDYXzLBE77bggofCrtFX9XC8rV57GB9kn"; // Replace with your actual OTFI token mint address
const OTFI_AIRDROP_AMOUNT = 5; // Amount of OTFI tokens to airdrop per swap
const OTFI_DECIMALS = 9; // Your OTFI token decimals
const AIRDROP_AUTHORITY_PRIVATE_KEY = "vbPHRLjvUmrWiFZDZzd8LgRd1dhf6iekjQ2JdBVduS1hbHjuQ4ELQ1hXmbomtXU8JYVU6JcGkNGQfeMXNAafWnQ"; // Private key of the wallet that holds OTFI tokens
const OTFI_AIRDROP_THRESHOLD_USD = 40; // Minimum trade value for OTFI airdrop
// Add these constants after your existing constants
const RATE_LIMIT_KEY = 'otfi_airdrop_attempts';
const AIRDROP_HISTORY_KEY = 'otfi_airdrop_history';
const STRICT_AIRDROP_ENFORCEMENT = true;
const MINIMUM_AIRDROP_USD = 40; // Hardcoded, cannot be bypassed
const PRICE_VERIFICATION_RETRIES = 3;
const TRANSACTION_VERIFICATION_DELAY = 3000; // 3 seconds
const MAX_TRANSACTION_AGE = 300000; // 5 minutes in milliseconds



const MEV_PROTECTION = {
  // Trade Protection
  MAX_PRICE_IMPACT: 0.05,        // 5% max price impact
  SLIPPAGE: 0.05,                // 5% slippage tolerance
  MIN_ROUTES: 2,                 // Minimum DEX routes
  
  // Priority Fees
  MIN_PRIORITY_FEE: 10_000,
  MAX_PRIORITY_FEE: 1_000_000,
  PRIORITY_MULTIPLIER: 2,
  
  // TWAP Settings
  TWAP_ENABLED: true,
  TWAP_INTERVALS: 4,             // Split into 4 parts
  TWAP_DELAY_MS: 2000,          // 2s between trades
  TWAP_THRESHOLD_USD: 1000,     // Enable TWAP for trades > $1000
  
  // Transaction Settings
  COMPUTE_UNITS: 300_000,
  MAX_RETRIES: 3,
  CONFIRMATION_TIMEOUT: 60_000,
  
  // Block Targeting
  TARGET_SPECIFIC_BLOCKS: true,
  PREFERRED_SLOT_OFFSET: 2,      // Target blocks with slot % 4 == 2
} 

// Constants for localStorage keys
const ANALYTICS_KEYS = {
  TRANSACTIONS: 'solanatrade_transactions',
  DAILY_VOLUMES: 'solanatrade_daily_volumes',
  PAIRS_VOLUME: 'solanatrade_pairs_volume'
};

// Record transaction directly
const recordSwapForAnalytics = (transaction) => {
  try {
    console.log('DIRECT ANALYTICS: Recording transaction:', transaction);
    
    // Add timestamp
    const txWithTimestamp = {
      ...transaction,
      timestamp: Date.now()
    };
    
    // Get existing transactions
    const existingTxsStr = localStorage.getItem(ANALYTICS_KEYS.TRANSACTIONS);
    const existingTxs = existingTxsStr ? JSON.parse(existingTxsStr) : [];
    
    // Add new transaction
    existingTxs.push(txWithTimestamp);
    
    // Save back to storage
    localStorage.setItem(ANALYTICS_KEYS.TRANSACTIONS, JSON.stringify(existingTxs));
    
    // Update daily volumes
    updateDailyVolume(transaction.usdValue || 0);
    
    // Update pairs volume
    updatePairsVolume(
      transaction.fromToken, 
      transaction.toToken, 
      transaction.usdValue || 0
    );
    
    console.log('DIRECT ANALYTICS: Transaction recorded successfully');
  } catch (error) {
    console.error('Error recording transaction for analytics:', error);
  }
};

// Update daily volume
const updateDailyVolume = (usdValue) => {
  try {
    // Get existing daily volumes
    const volumesStr = localStorage.getItem(ANALYTICS_KEYS.DAILY_VOLUMES);
    const dailyVolumes = volumesStr ? JSON.parse(volumesStr) : [];
    
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];
    
    // Find today's record or create new one
    const todayRecord = dailyVolumes.find(item => item.date === today);
    
    if (todayRecord) {
      todayRecord.volume += usdValue;
    } else {
      dailyVolumes.push({
        date: today,
        volume: usdValue
      });
    }
    
    // Save back to storage
    localStorage.setItem(ANALYTICS_KEYS.DAILY_VOLUMES, JSON.stringify(dailyVolumes));
  } catch (error) {
    console.error('Error updating daily volume:', error);
  }
};

// Update pairs volume
const updatePairsVolume = (fromToken, toToken, usdValue) => {
  try {
    // Get existing pairs volume
    const volumesStr = localStorage.getItem(ANALYTICS_KEYS.PAIRS_VOLUME);
    const pairsVolume = volumesStr ? JSON.parse(volumesStr) : [];
    
    // Create pair key (alphabetically sorted to ensure consistency)
    const tokens = [fromToken, toToken].sort();
    const pairKey = `${tokens[0]}-${tokens[1]}`;
    
    // Find pair record or create new one
    const pairRecord = pairsVolume.find(item => item.pair === pairKey);
    
    if (pairRecord) {
      pairRecord.volume += usdValue;
      pairRecord.count += 1;
    } else {
      pairsVolume.push({
        pair: pairKey,
        tokens: tokens,
        volume: usdValue,
        count: 1
      });
    }
    
    // Save back to storage
    localStorage.setItem(ANALYTICS_KEYS.PAIRS_VOLUME, JSON.stringify(pairsVolume));
  } catch (error) {
    console.error('Error updating pairs volume:', error);
  }
};

// Function to fetch token from CoinCodex
const fetchTokenFromCoinCodex = async (symbol) => {
  try {
    // Normalize the symbol to uppercase
    const normalizedSymbol = symbol.toUpperCase();
    
    // Fetch token data from CoinCodex API
    const response = await fetch(`https://coincodex.com/api/coincodex/get_coin/${normalizedSymbol}`);
    
    if (!response.ok) {
      console.warn(`CoinCodex API returned ${response.status} for symbol ${normalizedSymbol}`);
      return null;
    }
    
    const data = await response.json();
    
    // Check if we got valid data
    if (!data || !data.symbol) {
      console.warn(`No valid data returned from CoinCodex for symbol ${normalizedSymbol}`);
      return null;
    }
    
    // Check if the token has a Solana address
    if (!data.addresses || !data.addresses.solana) {
      console.warn(`Token ${normalizedSymbol} doesn't have a Solana address in CoinCodex data`);
      return null;
    }
    
    // Format the token data to match your application's format
    return {
      address: data.addresses.solana,
      symbol: data.symbol,
      name: data.name,
      decimals: 9, // Default to 9 decimals for Solana tokens
      image: data.icon_url || 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/solana/info/logo.png',
      volume24h: data.volume_24h || 0,
      liquidity: 0, // CoinCodex might not provide this
      price: data.last_price_usd || 0,
      priceChange24h: data.change_24h || 0,
      fromCoinCodex: true // Flag to indicate this token came from CoinCodex
    };
  } catch (error) {
    console.error('Error fetching token from CoinCodex:', error);
    return null;
  }
};

const SwapPage = () => {
  const theme = useTheme();
  const { connected, publicKey, sendTransaction } = useWallet();
  
  // State
  const [fromToken, setFromToken] = useState(null);
  const [toToken, setToToken] = useState(null);
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [slippage, setSlippage] = useState(0.5);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [fromTokenBalance, setFromTokenBalance] = useState(0);
  const [toTokenBalance, setToTokenBalance] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTokens, setFilteredTokens] = useState([]);
  const [isFromDropdownOpen, setIsFromDropdownOpen] = useState(false);
  const [isToDropdownOpen, setIsToDropdownOpen] = useState(false);
  const [importTokenAddress, setImportTokenAddress] = useState('');
  const [importTokenInfo, setImportTokenInfo] = useState(null);
  const [exchangeRate, setExchangeRate] = useState(null);
  const [priceImpact, setPriceImpact] = useState(null);
  const [customTokens, setCustomTokens] = useLocalStorage('customTokens', []);
  const [showImportWarning, setShowImportWarning] = useState(false);
  const [tokenToImport, setTokenToImport] = useState(null);
  const [importConfirmed, setImportConfirmed] = useState(false);
  const [fromUsdValue, setFromUsdValue] = useState(null);
  const [toUsdValue, setToUsdValue] = useState(null);
  const [availableRoutes, setAvailableRoutes] = useState([]);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);
  const [showRoutesDialog, setShowRoutesDialog] = useState(false);
  const [lastPriceUpdate, setLastPriceUpdate] = useState(null);
  const [refreshingPrice, setRefreshingPrice] = useState(false);
  const [routeMarkets, setRouteMarkets] = useState([]);
  const [txStatus, setTxStatus] = useState('');
  const [txMessage, setTxMessage] = useState('');
  const [networkFee, setNetworkFee] = useState(0.000005);
  const [route, setRoute] = useState(null);
  const [activeTab, setActiveTab] = useState('market');
  const [limitPrice, setLimitPrice] = useState('');
  const fromTokenAddressRef = useRef(null);
  const toTokenAddressRef = useRef(null);
  const priceRefreshIntervalRef = useRef(null);
  const [showSettings, setShowSettings] = useState(false);
  const [customSlippage, setCustomSlippage] = useState(null);
  const [txDeadline, setTxDeadline] = useState('30');
  const { tokens: jupiterTokens, popularTokens, loading: tokensLoading } = useTokenList();
const [searchParams] = useSearchParams();
const [airdropStatus, setAirdropStatus] = useState(null);
const [airdropLoading, setAirdropLoading] = useState(false);
const [mevProtectionEnabled, setMevProtectionEnabled] = useState(true);
const [twapProgress, setTwapProgress] = useState(null);
  // Create a Solana connection
  const connection = new Connection(
    'https://mainnet.helius-rpc.com/?api-key=887a40ac-2f47-4df7-bc37-1b9589ba5a48',
    'confirmed'
  );

  useEffect(() => {
  const tokenParam = searchParams.get('token');
  if (tokenParam && jupiterTokens.length > 0) {
    // Try to find the token in Jupiter tokens first
    let foundToken = jupiterTokens.find(t => 
      t.address.toLowerCase() === tokenParam.toLowerCase()
    );
    
    // If not found in Jupiter tokens, try custom tokens
    if (!foundToken) {
      foundToken = customTokens.find(t => 
        t.address.toLowerCase() === tokenParam.toLowerCase()
      );
    }
    
    // If still not found, try to fetch token info and import it
    if (!foundToken && validateSolanaAddress(tokenParam)) {
      fetchAccurateTokenInfo(tokenParam).then(tokenInfo => {
        if (tokenInfo) {
          // Add to custom tokens and set as from token
          setCustomTokens(prev => {
            if (!prev.some(t => t.address === tokenInfo.address)) {
              return [...prev, tokenInfo];
            }
            return prev;
          });
          setFromToken(tokenInfo);
          fromTokenAddressRef.current = tokenInfo.address;
        }
      });
    } else if (foundToken) {
      setFromToken(foundToken);
      fromTokenAddressRef.current = foundToken.address;
    }
  }
}, [searchParams, jupiterTokens, customTokens]);
  
  // Format market name for display
  const formatMarketName = (marketName) => {
    // Common market names to make more readable
    const marketMap = {
      'Orca (Whirlpools)': 'Orca',
      'Raydium (CLMM)': 'Raydium',
      'Jupiter Limit Order': 'Jupiter',
      'Meteora': 'Meteora',
      'Openbook': 'Openbook'
    };
    
    return marketMap[marketName] || marketName;
  };


  
  // Add this function to fetch token metadata accurately
  const fetchAccurateTokenInfo = async (tokenAddress) => {
    try {
      // First check if it's a valid Solana address
      if (!validateSolanaAddress(tokenAddress)) {
        return null;
      }
      
      console.log(`Fetching accurate token info for ${tokenAddress}`);
      
      // Get token metadata from on-chain
      const tokenMint = new PublicKey(tokenAddress);
      const mintInfo = await connection.getParsedAccountInfo(tokenMint);
      
      if (!mintInfo || !mintInfo.value || !mintInfo.value.data) {
        console.warn(`No mint info found for ${tokenAddress}`);
        return null;
      }
      
      // Parse the data to get decimals
      const parsedData = mintInfo.value.data;
      let decimals = 9; // Default
      
      if ('parsed' in parsedData && 
          parsedData.parsed.type === 'mint' && 
          'info' in parsedData.parsed && 
          'decimals' in parsedData.parsed.info) {
        decimals = parsedData.parsed.info.decimals;
        console.log(`Found on-chain decimals for ${tokenAddress}: ${decimals}`);
      }
      
      // Try to get token info from Jupiter API
      const response = await fetch(`https://token.jup.ag/all`);
      const allTokens = await response.json();
      
      // Find the token in Jupiter's list
      const jupiterToken = allTokens.find(t => t.address === tokenAddress);
      
      if (jupiterToken) {
        console.log(`Found token in Jupiter list: ${jupiterToken.symbol}`);
        return {
          ...jupiterToken,
          decimals: decimals // Use the on-chain decimals for accuracy
        };
      }
      
      // If not found in Jupiter, create a basic token info
      return {
        address: tokenAddress,
        symbol: `Token-${tokenAddress.slice(0, 4)}`,
        name: `Unknown Token ${tokenAddress.slice(0, 8)}`,
        decimals: decimals,
        image: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/solana/info/logo.png',
        extensions: {},
        hasFreeze: false // Assume no freeze authority
      };
    } catch (error) {
      console.error('Error fetching accurate token info:', error);
      return null;
    }
  };


  

  const phantomSignAndSendTransaction = async (transaction) => {
    try {
      // Check if Phantom is installed and connected
      if (!window.phantom || !window.phantom.solana || !window.phantom.solana.isConnected) {
        console.log('Phantom wallet not detected or not connected, falling back to adapter');
        throw new Error('Phantom wallet not connected');
      }
      
      // Get the Phantom provider
      const provider = window.phantom.solana;
      console.log('Using Phantom native signAndSendTransaction method');
      
      // Use Phantom's signAndSendTransaction method directly
      const { signature } = await provider.signAndSendTransaction(transaction);
      console.log('Phantom signAndSendTransaction successful with signature:', signature);
      
      return signature;
    } catch (error) {
      console.error('Error using Phantom signAndSendTransaction:', error);
      throw error;
    }
  };
  
  

  // Improved token balance fetching function
  const fetchTokenBalances = async () => {
    if (!connected || !publicKey || !fromToken || !toToken) return;
    
    try {
      console.log(`Fetching balance for ${fromToken.symbol} (${fromToken.address})`);
      
      // For SOL token
      if (fromToken.address === "So11111111111111111111111111111111111111112") {
        const solBalance = await connection.getBalance(publicKey);
        // Leave some SOL for transaction fees
        const adjustedBalance = (solBalance / LAMPORTS_PER_SOL) - 0.01;
        setFromTokenBalance(Math.max(0, adjustedBalance));
      } else {
        const fromBalance = await getTokenBalance(
          connection, 
          fromToken.address, 
          publicKey.toString()
        );
        setFromTokenBalance(fromBalance);
      }
      
      // For TO token
      if (toToken.address === "So11111111111111111111111111111111111111112") {
        const solBalance = await connection.getBalance(publicKey);
        setToTokenBalance(solBalance / LAMPORTS_PER_SOL);
      } else {
        const toBalance = await getTokenBalance(
          connection, 
          toToken.address, 
          publicKey.toString()
        );
        setToTokenBalance(toBalance);
      }
    } catch (err) {
      console.error('Error fetching token balances:', err);
    }
  };

// Update the fetchPrice function in your SwapPage.js

const fetchPrice = useCallback(async (amount) => {
  if (!amount || !fromToken || !toToken) return;
  
  setLoading(true);
  try {
    // Ensure proper decimal handling for the input amount
    const inputAmount = Math.floor(parseFloat(amount) * Math.pow(10, fromToken.decimals));
    
    console.log(`Fetching quote for ${inputAmount} (${amount} ${fromToken.symbol}) to ${toToken.symbol}`);
    
    const quoteResponse = await fetch(
      `https://quote-api.jup.ag/v6/quote?inputMint=${fromToken.address}`+
      `&outputMint=${toToken.address}`+
      `&amount=${inputAmount}`+
      `&slippageBps=${Math.floor(slippage * 100)}`
    );
    
    if (!quoteResponse.ok) {
      const errorData = await quoteResponse.json();
      console.error("Jupiter quote error:", errorData);
      throw new Error(`Jupiter API error: ${errorData.error || 'Failed to get quote'}`);
    }
    
    const quoteData = await quoteResponse.json();
    console.log("Jupiter quote data:", quoteData);
    
    // Get token prices using the new API V3
    const priceResponse = await fetch(
      `https://lite-api.jup.ag/price/v3?ids=${fromToken.address},${toToken.address}`
    );
    
    if (!priceResponse.ok) {
      console.warn("Failed to fetch prices from Jupiter Price API V3, continuing without USD values");
      // Continue without USD prices
      const outputAmount = quoteData.outAmount / Math.pow(10, toToken.decimals);
      setToAmount(outputAmount.toFixed(6));
      
      // Set route information
      setRoute(quoteData.routePlan?.map(step => step.swapInfo?.label) || [fromToken.symbol, toToken.symbol]);
      
      // Set the price impact from Jupiter quote
      if (quoteData && quoteData.priceImpactPct) {
        setPriceImpact(parseFloat(quoteData.priceImpactPct) * 100);
      }
      
      setLastPriceUpdate(new Date());
      return;
    }
    
    const priceData = await priceResponse.json();
    console.log("Price data from Jupiter API V3:", priceData);
    
    // Extract prices from the new API format
    const fromPrice = priceData[fromToken.address]?.usdPrice || 0;
    const toPrice = priceData[toToken.address]?.usdPrice || 0;
    
    console.log(`Token prices: ${fromToken.symbol}=${fromPrice}, ${toToken.symbol}=${toPrice}`);
    
    // Calculate output amount from Jupiter quote for better accuracy
    const outputAmount = quoteData.outAmount / Math.pow(10, toToken.decimals);
    setToAmount(outputAmount.toFixed(6));
    
    // Calculate exchange rate
    const exchangeRate = fromPrice > 0 && toPrice > 0 ? fromPrice / toPrice : null;
    setExchangeRate(exchangeRate);
    
    // Set USD values
    if (fromPrice > 0) {
      setFromUsdValue(parseFloat(amount) * fromPrice);
    }
    if (toPrice > 0) {
      setToUsdValue(outputAmount * toPrice);
    }
    
    // Set route information
    setRoute(quoteData.routePlan?.map(step => step.swapInfo?.label) || [fromToken.symbol, toToken.symbol]);
    
    // Set the real price impact from Jupiter quote
    if (quoteData && quoteData.priceImpactPct) {
      setPriceImpact(parseFloat(quoteData.priceImpactPct) * 100);
    }
    
    setLastPriceUpdate(new Date());
    
    // Store available routes for later use
    if (quoteData.routesInfos) {
      setAvailableRoutes(quoteData.routesInfos);
      
      // Extract market information
      const markets = quoteData.routePlan?.map(step => step.swapInfo?.label) || ['Jupiter'];
      setRouteMarkets(markets);
    }
    
  } catch (error) {
    console.error('Error fetching price:', error);
    setError(`Failed to fetch price: ${error.message}`);
  } finally {
    setLoading(false);
  }
}, [fromToken, toToken, slippage]);


// Update this function in SwapPage.js
const handleTokenSelect = async (token, isFromToken) => {
  setLoading(true);
  try {
    // For custom tokens, make sure we use the metadata we already have
    if (isCustomToken(token.address)) {
      // Find the token in our custom tokens list to get the correct metadata
      const customToken = customTokens.find(t => t.address === token.address);
      if (customToken) {
        // Use the custom token's metadata
        token = {
          ...customToken,
          // Ensure these fields exist for UI consistency
          image: customToken.image || customToken.logo || customToken.logoURI,
          logo: customToken.logo || customToken.image || customToken.logoURI,
          logoURI: customToken.logoURI || customToken.logo || customToken.image
        };
        console.log('Using custom token metadata:', token);
      }
    }
    
    if (isFromToken) {
      setFromToken(token);
      fromTokenAddressRef.current = token.address;
      setIsFromDropdownOpen(false);
    } else {
      setToToken(token);
      toTokenAddressRef.current = token.address;
      setIsToDropdownOpen(false);
    }
    setSearchQuery('');
    
    // Reset amounts and price data when tokens change
    setFromAmount('');
    setToAmount('');
    setFromUsdValue(null);
    setToUsdValue(null);
    setExchangeRate(null);
    setPriceImpact(null);
    setRouteMarkets([]);
    
    // Fetch updated balances
    if (connected && publicKey) {
      fetchTokenBalances();
    }
  } catch (error) {
    console.error("Error selecting token:", error);
    setError("Failed to select token: " + error.message);
  } finally {
    setLoading(false);
  }
};

// Update the handleImportToken function with this simpler approach
const handleImportToken = async (isFromToken) => {
  if (importTokenAddress) {
    setLoading(true);
    try {
      // Get token decimals directly from the blockchain
      const tokenMint = new PublicKey(importTokenAddress);
      const mintInfo = await connection.getParsedAccountInfo(tokenMint);
      
      let decimals = 9; // Default
      if (mintInfo?.value?.data && 'parsed' in mintInfo.value.data) {
        decimals = mintInfo.value.data.parsed.info.decimals;
        console.log(`Found on-chain decimals: ${decimals}`);
      }
      
      // Create token with accurate decimals
      const finalToken = {
        address: importTokenAddress,
        symbol: importTokenInfo?.symbol || `Token-${importTokenAddress.slice(0, 4)}`,
        name: importTokenInfo?.name || `Unknown Token ${importTokenAddress.slice(0, 8)}`,
        decimals: decimals,
        image: importTokenInfo?.image || 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/solana/info/logo.png',
        logo: importTokenInfo?.image || 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/solana/info/logo.png',
        logoURI: importTokenInfo?.image || 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/solana/info/logo.png'
      };
      
      // Add to custom tokens
      if (!customTokens.some(t => t.address === finalToken.address)) {
        setCustomTokens([...customTokens, finalToken]);
      }
      
      // Select the token
      if (isFromToken) {
        setFromToken(finalToken);
        fromTokenAddressRef.current = finalToken.address;
        setIsFromDropdownOpen(false);
      } else {
        setToToken(finalToken);
        toTokenAddressRef.current = finalToken.address;
        setIsToDropdownOpen(false);
      }
      
      // Reset import state
      setImportTokenInfo(null);
      setImportTokenAddress('');
      setSearchQuery('');
      
      // Update swap parameters in Jupiter API request
      if (fromAmount && parseFloat(fromAmount) > 0) {
        // Wait a moment for Jupiter to recognize the token
        setTimeout(() => fetchPrice(fromAmount), 500);
      }
    } catch (error) {
      console.error("Error importing token:", error);
      setError("Failed to import token: " + error.message);
    } finally {
      setLoading(false);
    }
  }
};



  // Confirm token import with improved metadata handling
  const confirmImportToken = async (isFromToken) => {
    if (tokenToImport) {
      setLoading(true);
      try {
        // Ensure we have accurate token information
        const accurateToken = await fetchAccurateTokenInfo(tokenToImport.address);
        const finalToken = accurateToken || tokenToImport;
        
        // Add to custom tokens if not already there
        if (!customTokens.some(t => t.address === finalToken.address)) {
          // Store the token in localStorage
          setCustomTokens([...customTokens, finalToken]);
          console.log(`Token ${finalToken.symbol} added to custom tokens list with decimals: ${finalToken.decimals}`);
        } else {
          // Update existing token with accurate information
          const updatedCustomTokens = customTokens.map(t => 
            t.address === finalToken.address ? finalToken : t
          );
          setCustomTokens(updatedCustomTokens);
          console.log(`Updated token ${finalToken.symbol} in custom tokens list with decimals: ${finalToken.decimals}`);
        }
        
        // Select the token
        handleTokenSelect(finalToken, isFromToken);
        
        // Reset import state
        setTokenToImport(null);
        setShowImportWarning(false);
        setImportConfirmed(false);
        setImportTokenInfo(null);
        setImportTokenAddress('');
      } catch (error) {
        console.error("Error confirming token import:", error);
        setError("Failed to import token: " + error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  // When setting default tokens
  useEffect(() => {
    if (jupiterTokens.length > 0 && !fromToken && !toToken) {
      // Find SOL and USDC tokens
      const solToken = jupiterTokens.find(t => t.symbol === 'SOL');
      const usdcToken = jupiterTokens.find(t => t.symbol === 'USDC');
      
      // Ensure tokens have valid decimals
      if (solToken && typeof solToken.decimals === 'number') {
        console.log('Setting SOL token with decimals:', solToken.decimals);
        setFromToken(solToken);
        fromTokenAddressRef.current = solToken.address;
      }
      
      if (usdcToken && typeof usdcToken.decimals === 'number') {
        console.log('Setting USDC token with decimals:', usdcToken.decimals);
        setToToken(usdcToken);
        toTokenAddressRef.current = usdcToken.address;
      }
      
      setFilteredTokens(jupiterTokens);
    }
  }, [jupiterTokens]);
  
  // Update token balances when wallet connects or tokens change
  useEffect(() => {
    if (connected && publicKey && fromToken && toToken) {
      fetchTokenBalances();
    }
  }, [connected, publicKey, fromToken?.address, toToken?.address]);
  
  // Combine Jupiter tokens with custom tokens
  useEffect(() => {
    if (jupiterTokens.length > 0) {
      // Create a map of addresses to avoid duplicates
      const tokenMap = new Map();
      
      // Add Jupiter tokens to map
      jupiterTokens.forEach(token => {
        tokenMap.set(token.address, token);
      });
      
      // Add custom tokens to map (will overwrite Jupiter tokens if same address)
      customTokens.forEach(token => {
        tokenMap.set(token.address, token);
      });
      
      // Convert map back to array
      const allTokens = Array.from(tokenMap.values());
      setFilteredTokens(allTokens);
      
      console.log(`Combined token list has ${allTokens.length} tokens (${jupiterTokens.length} from Jupiter, ${customTokens.length} custom)`);
    }
  }, [jupiterTokens, customTokens]);
  
  // Filter tokens based on search query
  useEffect(() => {
    const searchTokens = async () => {
      if (searchQuery) {
        // First, search in existing Jupiter tokens
        const filtered = jupiterTokens.filter(token => 
          token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
          token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          token.address.toLowerCase() === searchQuery.toLowerCase()
        );
        setFilteredTokens(filtered);
        
        // Check if the search query is a valid Solana address
        if (validateSolanaAddress(searchQuery) && !filtered.some(t => t.address === searchQuery)) {
          setImportTokenAddress(searchQuery);
          fetchTokenInfo(searchQuery).then(tokenInfo => {
            if (tokenInfo) {
              setImportTokenInfo(tokenInfo);
            } else {
              setImportTokenInfo(null);
            }
          });
        } else {
          setImportTokenAddress('');
          setImportTokenInfo(null);
          
          // If no tokens found in Jupiter list and it's not an address, try CoinCodex
          if (filtered.length === 0 && searchQuery.length >= 2) {
            // Try to fetch from CoinCodex
            const coinCodexToken = await fetchTokenFromCoinCodex(searchQuery);
            
            if (coinCodexToken) {
              // If token found on CoinCodex, set it as import token info
              setImportTokenInfo(coinCodexToken);
              setImportTokenAddress(coinCodexToken.address);
            }
          }
        }
      } else {
        // If search query is empty, reset to all tokens
        if (jupiterTokens.length > 0) {
          const tokenMap = new Map();
          jupiterTokens.forEach(token => tokenMap.set(token.address, token));
          customTokens.forEach(token => tokenMap.set(token.address, token));
          setFilteredTokens(Array.from(tokenMap.values()));
        }
        setImportTokenAddress('');
        setImportTokenInfo(null);
      }
    };
    
    searchTokens();
  }, [searchQuery, jupiterTokens, customTokens]);
  
  // Set up price refresh interval
  useEffect(() => {
    // Clear any existing interval
    if (priceRefreshIntervalRef.current) {
      clearInterval(priceRefreshIntervalRef.current);
      priceRefreshIntervalRef.current = null;
    }
    
    // Only set up interval if we have all required data
    if (fromAmount && parseFloat(fromAmount) > 0 && fromToken && toToken) {
      // Initial fetch
      fetchPrice(fromAmount);
      
      // Set up interval for refreshing price every 30 seconds
      priceRefreshIntervalRef.current = setInterval(() => {
        fetchPrice(fromAmount);
      }, 7000);
    }
    
    return () => {
      if (priceRefreshIntervalRef.current) {
        clearInterval(priceRefreshIntervalRef.current);
        priceRefreshIntervalRef.current = null;
      }
    };
  }, [fromAmount, fromToken?.address, toToken?.address, fetchPrice]);

  // Function to check if a token is custom/imported
  const isCustomToken = (tokenAddress) => {
    return customTokens.some(t => t.address === tokenAddress);
  };

  // Function to get the appropriate fee account based on the token
  const getFeeAccount = (tokenAddress) => {
    // If we have a specific fee account for this token, use it
    if (FEE_ACCOUNTS[tokenAddress]) {
      return FEE_ACCOUNTS[tokenAddress];
    }
    
    // Otherwise use the default fee account
    return FEE_ACCOUNTS.DEFAULT;
  };
    
  // Swap tokens
  const handleSwapTokens = () => {
    const temp = fromToken;
    setFromToken(toToken);
    fromTokenAddressRef.current = toToken?.address;
    setToToken(temp);
    toTokenAddressRef.current = temp?.address;
    
    setFromAmount('');
    setToAmount('');
    setFromUsdValue(null);
    setToUsdValue(null);
    setAvailableRoutes([]);
    setSelectedRouteIndex(0);
    setRouteMarkets([]);
  };
  
  // Handle refresh price
  const handleRefreshPrice = async () => {
    if (fromAmount && parseFloat(fromAmount) > 0 && fromToken && toToken) {
      setRefreshingPrice(true);
      await fetchPrice(fromAmount);
      setRefreshingPrice(false);
    }
  };

  // Add MEV Protection utility functions
const getPriorityFee = async () => {
  try {
    const recentFees = await connection.getRecentPrioritizationFees();
    if (recentFees.length === 0) {
      return MEV_PROTECTION.MIN_PRIORITY_FEE;
    }
    
    const maxFee = Math.max(...recentFees.map(fee => fee.prioritizationFee));
    const calculatedFee = Math.max(
      maxFee * MEV_PROTECTION.PRIORITY_MULTIPLIER,
      MEV_PROTECTION.MIN_PRIORITY_FEE
    );
    
    return Math.min(calculatedFee, MEV_PROTECTION.MAX_PRIORITY_FEE);
  } catch (error) {
    console.warn('Failed to get priority fee, using default:', error);
    return MEV_PROTECTION.MIN_PRIORITY_FEE;
  }
};

// TWAP Execution class
class TWAPExecution {
  static async splitTrade(totalAmount, fromTokenAddress, toTokenAddress, fromTokenDecimals) {
    const amount = new BN(totalAmount);
    const chunkSize = amount.divn(MEV_PROTECTION.TWAP_INTERVALS);
    const remainder = amount.modn(MEV_PROTECTION.TWAP_INTERVALS);
    
    const chunks = [];
    for (let i = 0; i < MEV_PROTECTION.TWAP_INTERVALS; i++) {
      let chunkAmount = chunkSize.clone();
      
      // Add remainder to the last chunk
      if (i === MEV_PROTECTION.TWAP_INTERVALS - 1) {
        chunkAmount = chunkAmount.addn(remainder);
      }
      
      chunks.push({
        amount: chunkAmount.toString(),
        fromTokenAddress,
        toTokenAddress,
        chunkIndex: i + 1,
        totalChunks: MEV_PROTECTION.TWAP_INTERVALS
      });
    }
    
    return chunks;
  }
  
  static async executeChunk(chunk, userPublicKey, slippage) {
    try {
      console.log(`Executing TWAP chunk ${chunk.chunkIndex}/${chunk.totalChunks}`);
      
      // Get priority fee for this chunk
      const priorityFee = await getPriorityFee();
      
      // Get quote for this chunk
      const quoteResponse = await fetch(
        `https://quote-api.jup.ag/v6/quote?inputMint=${chunk.fromTokenAddress}` +
        `&outputMint=${chunk.toTokenAddress}` +
        `&amount=${chunk.amount}` +
        `&slippageBps=${Math.floor(slippage * 100)}` +
        `&platformFeeBps=${FEE_BPS}`
      );
      
      if (!quoteResponse.ok) {
        throw new Error(`Failed to get quote for chunk ${chunk.chunkIndex}`);
      }
      
      const quoteData = await quoteResponse.json();
      
      // Check price impact
      if (quoteData.priceImpactPct && Math.abs(quoteData.priceImpactPct) > MEV_PROTECTION.MAX_PRICE_IMPACT) {
        throw new Error(`Price impact too high for chunk ${chunk.chunkIndex}: ${(quoteData.priceImpactPct * 100).toFixed(2)}%`);
      }
      
      // Fee account selection
      let feeAccount;
      const hasFeeAccountForInput = FEE_ACCOUNTS[chunk.fromTokenAddress] !== undefined;
      const hasFeeAccountForOutput = FEE_ACCOUNTS[chunk.toTokenAddress] !== undefined;

      if (hasFeeAccountForInput) {
        feeAccount = FEE_ACCOUNTS[chunk.fromTokenAddress];
      } else if (hasFeeAccountForOutput) {
        feeAccount = FEE_ACCOUNTS[chunk.toTokenAddress];
      } else {
        feeAccount = FEE_ACCOUNTS.DEFAULT;
      }
      
      // Create swap transaction with MEV protection
      const swapRequestBody = {
        quoteResponse: quoteData,
        userPublicKey: userPublicKey.toString(),
        wrapAndUnwrapSol: true,
        platformFeeBps: FEE_BPS,
        feeAccount: feeAccount,
        computeUnitPriceMicroLamports: priorityFee,
        asLegacyTransaction: false,
        skipUserAccountsCheck: true
      };
      
      const swapResponse = await fetch('https://quote-api.jup.ag/v6/swap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(swapRequestBody)
      });
      
      if (!swapResponse.ok) {
        throw new Error(`Failed to create swap transaction for chunk ${chunk.chunkIndex}`);
      }
      
      const swapData = await swapResponse.json();
      return {
        transaction: swapData.swapTransaction,
        quote: quoteData,
        chunkIndex: chunk.chunkIndex,
        priorityFee
      };
      
    } catch (error) {
      console.error(`Error executing chunk ${chunk.chunkIndex}:`, error);
      throw error;
    }
  }
}


// Enhanced rate limiting with stricter controls
const checkRateLimit = (userPublicKey) => {
  try {
    const attempts = localStorage.getItem(RATE_LIMIT_KEY) || '{}';
    const userAttempts = JSON.parse(attempts);
    const userKey = userPublicKey.toString();
    
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;
    const oneDay = 24 * 60 * 60 * 1000;
    
    // Clean old attempts
    if (userAttempts[userKey]) {
      userAttempts[userKey] = userAttempts[userKey].filter(
        attempt => now - attempt.timestamp < oneDay
      );
    } else {
      userAttempts[userKey] = [];
    }
    
    // STRICT: Check hourly limit (reduced from 3 to 2)
    const hourlyAttempts = userAttempts[userKey].filter(
      attempt => now - attempt.timestamp < oneHour
    );
    
    if (hourlyAttempts.length >= 2) {
      return {
        allowed: false,
        error: `  Airdrop Error: Rate limit exceeded. Maximum 2 airdrop attempts per hour.`
      };
    }
    
    // STRICT: Check daily limit (reduced from 10 to 5)
    if (userAttempts[userKey].length >= 5) {
      return {
        allowed: false,
        error: `STRICT ENFORCEMENT: Daily limit exceeded. Maximum 5 airdrop attempts per day.`
      };
    }
    
    // Record this attempt with additional metadata
    userAttempts[userKey].push({
      timestamp: now,
      type: 'attempt',
      userAgent: navigator.userAgent,
      url: window.location.href
    });
    
    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(userAttempts));
    
    return { allowed: true };
  } catch (error) {
    console.error('Rate limit check error:', error);
    // STRICT: If rate limit check fails, deny access
    return { 
      allowed: false, 
      error: 'STRICT ENFORCEMENT: Rate limit system error - access denied' 
    };
  }
};


/// Enhanced duplicate check with additional validation
const checkExistingAirdrop = (userPublicKey, swapSignature) => {
  try {
    const history = localStorage.getItem(AIRDROP_HISTORY_KEY) || '[]';
    const airdropHistory = JSON.parse(history);
    
    // Check for exact match
    const exactMatch = airdropHistory.some(airdrop => 
      airdrop.userPublicKey === userPublicKey.toString() && 
      airdrop.swapSignature === swapSignature
    );
    
    if (exactMatch) {
      console.log('❌ DUPLICATE DETECTED: Exact signature match found');
      return true;
    }
    
    // STRICT: Check for suspicious patterns (same user, similar timestamps)
    const userHistory = airdropHistory.filter(
      airdrop => airdrop.userPublicKey === userPublicKey.toString()
    );
    
    const now = Date.now();
    const recentClaims = userHistory.filter(
      airdrop => now - airdrop.timestamp < 60000 // Within 1 minute
    );
    
    if (recentClaims.length > 0) {
      console.log('❌ SUSPICIOUS ACTIVITY: Multiple claims within 1 minute');
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error checking existing airdrop:', error);
    // STRICT: If check fails, assume duplicate to be safe
    return true;
  }
};


// Enhanced success recording with additional metadata
const recordAirdropSuccess = (userPublicKey, swapSignature, swapValue, airdropAmount, airdropSignature) => {
  try {
    const history = localStorage.getItem(AIRDROP_HISTORY_KEY) || '[]';
    const airdropHistory = JSON.parse(history);
    
    // Add comprehensive record
    airdropHistory.push({
      userPublicKey: userPublicKey.toString(),
      swapSignature,
      swapValue,
      airdropAmount,
      airdropSignature,
      timestamp: Date.now(),
      verificationMethod: 'STRICT_ONCHAIN',
      userAgent: navigator.userAgent,
      url: window.location.href,
      blockTime: Date.now() // For additional verification
    });
    
    // STRICT: Keep only last 1000 records to prevent storage bloat
    if (airdropHistory.length > 1000) {
      airdropHistory.splice(0, airdropHistory.length - 1000);
    }
    
    localStorage.setItem(AIRDROP_HISTORY_KEY, JSON.stringify(airdropHistory));
    console.log('✅ Airdrop success recorded with strict verification');
  } catch (error) {
    console.error('Error recording airdrop success:', error);
  }
};



// Enhanced price fetching with multiple sources
const getTokenPriceFromMultipleSources = async (tokenAddress) => {
  const sources = [
    // Jupiter Price API V3
    async () => {
      const response = await fetch(`https://lite-api.jup.ag/price/v3?ids=${tokenAddress}`);
      if (response.ok) {
        const data = await response.json();
        return data[tokenAddress]?.usdPrice || 0;
      }
      return 0;
    },
    
    // Backup: Jupiter Price API V2
    async () => {
      const response = await fetch(`https://price.jup.ag/v4/price?ids=${tokenAddress}`);
      if (response.ok) {
        const data = await response.json();
        return data.data[tokenAddress]?.price || 0;
      }
      return 0;
    },
    
    // Backup: CoinGecko (if available)
    async () => {
      try {
        const response = await fetch(`https://api.coingecko.com/api/v3/simple/token_price/solana?contract_addresses=${tokenAddress}&vs_currencies=usd`);
        if (response.ok) {
          const data = await response.json();
          return data[tokenAddress]?.usd || 0;
        }
      } catch (error) {
        console.warn('CoinGecko price fetch failed:', error);
      }
      return 0;
    }
  ];
  
  // Try each source and return the first valid price
  for (const source of sources) {
    try {
      const price = await source();
      if (price > 0) {
        console.log(`Got price ${price} for token ${tokenAddress}`);
        return price;
      }
    } catch (error) {
      console.warn('Price source failed:', error);
      continue;
    }
  }
  
  throw new Error(`Could not fetch price for token ${tokenAddress} from any source`);
};



// BULLETPROOF transaction value calculation
const calculateSwapValueFromTransaction = async (transaction, fromTokenAddress, toTokenAddress) => {
  try {
    console.log('🔍 STRICT VERIFICATION: Calculating swap value from blockchain transaction...');
    console.log('Transaction signature:', transaction);
    
    // Multiple attempts to get accurate price
    let fromTokenPrice = 0;
    let attempts = 0;
    
    while (fromTokenPrice === 0 && attempts < PRICE_VERIFICATION_RETRIES) {
      attempts++;
      console.log(`Price fetch attempt ${attempts}/${PRICE_VERIFICATION_RETRIES}`);
      
      try {
        fromTokenPrice = await getTokenPriceFromMultipleSources(fromTokenAddress);
        if (fromTokenPrice > 0) {
          console.log(`✅ Got valid price: $${fromTokenPrice} for ${fromTokenAddress}`);
          break;
        }
      } catch (error) {
        console.warn(`Price fetch attempt ${attempts} failed:`, error);
        if (attempts < PRICE_VERIFICATION_RETRIES) {
          await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retry
        }
      }
    }
    
    if (fromTokenPrice === 0) {
      throw new Error(`STRICT ENFORCEMENT: Could not get valid price for token ${fromTokenAddress} after ${PRICE_VERIFICATION_RETRIES} attempts`);
    }
    
    // Parse transaction to get EXACT amounts
    const preBalances = transaction.meta.preTokenBalances || [];
    const postBalances = transaction.meta.postTokenBalances || [];
    const preBalancesSOL = transaction.meta.preBalances || [];
    const postBalancesSOL = transaction.meta.postBalances || [];
    
    let swapAmount = 0;
    let swapAmountFound = false;
    
    console.log('🔍 Analyzing transaction balances...');
    console.log('Pre SOL balances:', preBalancesSOL);
    console.log('Post SOL balances:', postBalancesSOL);
    console.log('Pre token balances:', preBalances);
    console.log('Post token balances:', postBalances);
    
    // For SOL transactions (STRICT CHECKING)
    if (fromTokenAddress === "So11111111111111111111111111111111111111112") {
      console.log('🔍 Processing SOL transaction...');
      
      // Get the user's account (first account is usually the signer)
      const userAccountIndex = 0;
      const preBalance = preBalancesSOL[userAccountIndex] || 0;
      const postBalance = postBalancesSOL[userAccountIndex] || 0;
      const lamportsDiff = preBalance - postBalance;
      
      console.log(`SOL Balance change: ${preBalance} -> ${postBalance} (diff: ${lamportsDiff} lamports)`);
      
      if (lamportsDiff > 0) {
        // Account for transaction fees more accurately
        const transactionFee = transaction.meta.fee || 5000; // Actual transaction fee
        const priorityFee = 100000; // Estimated priority fee buffer
        const totalFees = transactionFee + priorityFee;
        
        const actualSwapLamports = lamportsDiff - totalFees;
        
        console.log(`Transaction fee: ${transactionFee}, Priority fee buffer: ${priorityFee}`);
        console.log(`Actual swap amount: ${actualSwapLamports} lamports`);
        
        if (actualSwapLamports > 0) {
          swapAmount = actualSwapLamports / LAMPORTS_PER_SOL;
          swapAmountFound = true;
          console.log(`✅ SOL swap amount calculated: ${swapAmount} SOL`);
        }
      }
    } else {
      // For SPL tokens (STRICT CHECKING)
      console.log('🔍 Processing SPL token transaction...');
      
      // Find the user's token account changes
      for (const preBalance of preBalances) {
        if (preBalance.mint === fromTokenAddress) {
          const postBalance = postBalances.find(
            pb => pb.accountIndex === preBalance.accountIndex && pb.mint === fromTokenAddress
          );
          
          if (postBalance) {
            const preAmount = preBalance.uiTokenAmount.uiAmount || 0;
            const postAmount = postBalance.uiTokenAmount.uiAmount || 0;
            const amountDiff = preAmount - postAmount;
            
            console.log(`Token balance change: ${preAmount} -> ${postAmount} (diff: ${amountDiff})`);
            
            if (amountDiff > 0) {
              swapAmount = amountDiff;
              swapAmountFound = true;
              console.log(`✅ SPL token swap amount calculated: ${swapAmount} ${fromTokenAddress}`);
              break;
            }
          }
        }
      }
    }
    
    if (!swapAmountFound || swapAmount <= 0) {
      throw new Error('STRICT ENFORCEMENT: Could not determine valid swap amount from transaction');
    }
    
    const usdValue = swapAmount * fromTokenPrice;
    console.log(`🔍 FINAL CALCULATION: ${swapAmount} tokens × $${fromTokenPrice} = $${usdValue}`);
    
    // STRICT ENFORCEMENT: Double-check the calculation
    if (usdValue <= 0) {
      throw new Error('STRICT ENFORCEMENT: Calculated USD value is zero or negative');
    }
    
    if (usdValue > 1000000) { // Sanity check for unrealistic values
      throw new Error('STRICT ENFORCEMENT: Calculated USD value is unrealistically high');
    }
    
    return usdValue;
  } catch (error) {
    console.error('❌ STRICT ENFORCEMENT: Error calculating swap value:', error);
    throw error;
  }
};

// Verify transaction is recent to prevent replay attacks
const verifyTransactionAge = (transaction) => {
  try {
    const blockTime = transaction.blockTime;
    if (!blockTime) {
      throw new Error('STRICT ENFORCEMENT: Transaction has no block time');
    }
    
    const transactionTime = blockTime * 1000; // Convert to milliseconds
    const now = Date.now();
    const age = now - transactionTime;
    
    console.log(`🕐 Transaction age: ${Math.floor(age / 1000)} seconds`);
    
    if (age > MAX_TRANSACTION_AGE) {
      throw new Error(`STRICT ENFORCEMENT: Transaction too old (${Math.floor(age / 1000)}s). Must be within ${MAX_TRANSACTION_AGE / 1000}s`);
    }
    
    if (age < 0) {
      throw new Error('STRICT ENFORCEMENT: Transaction appears to be from the future');
    }
    
    console.log('✅ Transaction age verified');
    return true;
  } catch (error) {
    console.error('❌ Transaction age verification failed:', error);
    throw error;
  }
};


// Verify the user actually owns the transaction
const verifyUserOwnership = (transaction, userPublicKey) => {
  try {
    const accountKeys = transaction.transaction.message.accountKeys || [];
    const staticAccountKeys = transaction.transaction.message.staticAccountKeys || [];
    const allAccountKeys = [...accountKeys, ...staticAccountKeys];
    
    // Check if user's public key is in the transaction
    const userKeyString = userPublicKey.toString();
    const isUserInTransaction = allAccountKeys.some(key => {
      const keyString = typeof key === 'string' ? key : key.toString();
      return keyString === userKeyString;
    });
    
    if (!isUserInTransaction) {
      throw new Error('STRICT ENFORCEMENT: User public key not found in transaction');
    }
    
    // Additional check: User should be the fee payer (first account)
    const feePayer = allAccountKeys[0];
    const feePayerString = typeof feePayer === 'string' ? feePayer : feePayer.toString();
    
    if (feePayerString !== userKeyString) {
      console.warn('⚠️ User is not the fee payer, additional verification needed');
      // Still allow but log for monitoring
    }
    
    console.log('✅ User ownership verified');
    return true;
  } catch (error) {
    console.error('❌ User ownership verification failed:', error);
    throw error;
  }
};


// Verify this is actually a swap transaction
const verifySwapTransaction = (transaction, fromTokenAddress, toTokenAddress) => {
  try {
    console.log('🔍 Verifying transaction is a valid swap...');
    
    // Check if transaction was successful
    if (transaction.meta.err) {
      throw new Error('STRICT ENFORCEMENT: Transaction failed on blockchain');
    }
    
    // Verify transaction contains token transfers
    const preTokenBalances = transaction.meta.preTokenBalances || [];
    const postTokenBalances = transaction.meta.postTokenBalances || [];
    
    // For SOL swaps, check SOL balance changes
    if (fromTokenAddress === "So11111111111111111111111111111111111111112") {
      const preBalances = transaction.meta.preBalances || [];
      const postBalances = transaction.meta.postBalances || [];
      
      if (preBalances.length === 0 || postBalances.length === 0) {
        throw new Error('STRICT ENFORCEMENT: No SOL balance changes found');
      }
      
      // Check for meaningful balance change (more than just fees)
      const balanceChange = preBalances[0] - postBalances[0];
      if (balanceChange < 1000000) { // Less than 0.001 SOL
        throw new Error('STRICT ENFORCEMENT: SOL balance change too small to be a valid swap');
      }
    } else {
      // For SPL tokens, verify token balance changes
      const fromTokenFound = preTokenBalances.some(balance => balance.mint === fromTokenAddress);
      if (!fromTokenFound) {
        throw new Error('STRICT ENFORCEMENT: From token not found in transaction');
      }
    }
    
    // Verify transaction contains Jupiter program interactions
    const instructions = transaction.transaction.message.instructions || [];
    const jupiterProgramIds = [
      'JUP4Fb2cqiRUcaTHdrPC8h2gNsA2ETXiPDD33WcGuJB', // Jupiter V4
      'JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4', // Jupiter V6
    ];
    
    let jupiterInteraction = false;
    for (const instruction of instructions) {
      const programId = instruction.programId || instruction.programIdIndex;
      if (jupiterProgramIds.includes(programId)) {
        jupiterInteraction = true;
        break;
      }
    }
    
    if (!jupiterInteraction) {
      console.warn('⚠️ No Jupiter program interaction detected, but continuing...');
    }
    
    console.log('✅ Swap transaction verified');
    return true;
  } catch (error) {
    console.error('❌ Swap transaction verification failed:', error);
    throw error;
  }
};

// Enhanced UI display for strict enforcement
const displayStrictAirdropInfo = (fromUsdValue) => {
  if (fromUsdValue === null) return null;
  
  const isEligible = fromUsdValue >= MINIMUM_AIRDROP_USD;
  const shortfall = MINIMUM_AIRDROP_USD - fromUsdValue;
  
  return (
    <Box 
      sx={{ 
        mb: 2,
        p: 2,
        borderRadius: 2,
        backgroundColor: isEligible 
          ? 'rgba(20, 241, 149, 0.1)' 
          : 'rgba(231, 76, 60, 0.1)',
        border: '2px solid',
        borderColor: isEligible 
          ? 'rgba(20, 241, 149, 0.5)' 
          : 'rgba(231, 76, 60, 0.5)'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <Typography 
          variant="body2" 
          fontWeight="bold" 
          color={isEligible ? '#14F195' : '#e74c3c'}
        >
          {isEligible ? '✅ ELIGIBLE' : '🚫 NOT ELIGIBLE'} - OTFI Airdrop
        </Typography>
      </Box>
      
      {isEligible ? (
        <Box>
          <Typography variant="body2" color="success.main" sx={{ fontWeight: 'bold' }}>
            🎉 You will receive {
              fromUsdValue >= 100 ? OTFI_AIRDROP_AMOUNT * 2 :
              fromUsdValue >= 50 ? OTFI_AIRDROP_AMOUNT * 1.5 :
              OTFI_AIRDROP_AMOUNT
            } OTFI tokens after this swap!
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
            ✅ Verified on-chain • Current trade: ${fromUsdValue.toFixed(2)}
          </Typography>
        </Box>
      ) : (
        <Box>
          <Typography variant="body2" color="error.main" sx={{ fontWeight: 'bold' }}>
            🚫 TRANSACTIONS BELOW ${MINIMUM_AIRDROP_USD} = NO AIRDROP
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
            Need ${shortfall.toFixed(2)} more • Current: ${fromUsdValue.toFixed(2)}
          </Typography>
        </Box>
      )}
    </Box>
  );
};


// COMPLETE BULLETPROOF executeOTFIAirdrop function
const executeOTFIAirdrop = async (userPublicKey, swapSignature, fromTokenAddress, toTokenAddress) => {
  try {
    console.log('🚀 STRICT AIRDROP VERIFICATION STARTED');
    console.log('='.repeat(60));
    console.log('User:', userPublicKey.toString());
    console.log('Swap signature:', swapSignature);
    console.log('From token:', fromTokenAddress);
    console.log('To token:', toTokenAddress);
    console.log('Minimum required:', `$${MINIMUM_AIRDROP_USD}`);
    console.log('Enforcement enabled:', STRICT_AIRDROP_ENFORCEMENT);
    console.log('='.repeat(60));
    
    // STRICT ENFORCEMENT: Check if enforcement is enabled
    if (!STRICT_AIRDROP_ENFORCEMENT) {
      console.log('❌ AIRDROP SYSTEM DISABLED');
      throw new Error('AIRDROP SYSTEM DISABLED');
    }
    
    // STRICT: Validate inputs
    if (!userPublicKey || !swapSignature || !fromTokenAddress || !toTokenAddress) {
      throw new Error('STRICT ENFORCEMENT: Missing required parameters');
    }
    
    if (swapSignature.length < 80 || swapSignature.length > 90) {
      throw new Error('STRICT ENFORCEMENT: Invalid transaction signature format');
    }
    
    // Rate limiting check
    console.log('🔒 Checking rate limits...');
    const rateLimitCheck = checkRateLimit(userPublicKey);
    if (!rateLimitCheck.allowed) {
      console.log('❌ RATE LIMITED:', rateLimitCheck.error);
      return {
        success: false,
        error: rateLimitCheck.error,
        rateLimited: true
      };
    }
    console.log('✅ Rate limit check passed');
    
    // Duplicate claim check
    console.log('🔍 Checking for duplicate claims...');
    if (checkExistingAirdrop(userPublicKey, swapSignature)) {
      console.log('❌ DUPLICATE CLAIM DETECTED');
      return {
        success: false,
        error: 'STRICT ENFORCEMENT: Airdrop already claimed for this transaction',
        alreadyClaimed: true
      };
    }
    console.log('✅ No duplicate claims found');
    
    // Wait for transaction to be fully confirmed
    console.log('⏳ Waiting for transaction confirmation...');
    await new Promise(resolve => setTimeout(resolve, TRANSACTION_VERIFICATION_DELAY));
    
    // Fetch and verify transaction with multiple attempts
    console.log('🔍 Fetching transaction from blockchain...');
    let swapTx = null;
    let attempts = 0;
    
    while (!swapTx && attempts < 3) {
      attempts++;
      console.log(`Transaction fetch attempt ${attempts}/3`);
      
      try {
        swapTx = await connection.getTransaction(swapSignature, {
          commitment: 'confirmed',
          maxSupportedTransactionVersion: 0
        });
        
        if (swapTx) {
          console.log('✅ Transaction fetched successfully');
          break;
        }
      } catch (error) {
        console.warn(`Transaction fetch attempt ${attempts} failed:`, error);
        if (attempts < 3) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
    }
    
    if (!swapTx) {
      console.log('❌ TRANSACTION NOT FOUND AFTER 3 ATTEMPTS');
      throw new Error('STRICT ENFORCEMENT: Swap transaction not found on blockchain after multiple attempts');
    }
    
    // Verify transaction age
    console.log('🕐 Verifying transaction age...');
    const blockTime = swapTx.blockTime;
    if (!blockTime) {
      throw new Error('STRICT ENFORCEMENT: Transaction has no block time');
    }
    
    const transactionTime = blockTime * 1000; // Convert to milliseconds
    const now = Date.now();
    const age = now - transactionTime;
    
    console.log(`🕐 Transaction age: ${Math.floor(age / 1000)} seconds`);
    
    if (age > MAX_TRANSACTION_AGE) {
      throw new Error(`STRICT ENFORCEMENT: Transaction too old (${Math.floor(age / 1000)}s). Must be within ${MAX_TRANSACTION_AGE / 1000}s`);
    }
    
    if (age < 0) {
      throw new Error('STRICT ENFORCEMENT: Transaction appears to be from the future');
    }
    
    console.log('✅ Transaction age verified');
    
    // Verify user ownership
    console.log('👤 Verifying user ownership...');
    const accountKeys = swapTx.transaction.message.accountKeys || [];
    const staticAccountKeys = swapTx.transaction.message.staticAccountKeys || [];
    const allAccountKeys = [...accountKeys, ...staticAccountKeys];
    
    const userKeyString = userPublicKey.toString();
    const isUserInTransaction = allAccountKeys.some(key => {
      const keyString = typeof key === 'string' ? key : key.toString();
      return keyString === userKeyString;
    });
    
    if (!isUserInTransaction) {
      throw new Error('STRICT ENFORCEMENT: User public key not found in transaction');
    }
    
    console.log('✅ User ownership verified');
    
    // Verify this is a swap transaction
    console.log('🔄 Verifying swap transaction...');
    if (swapTx.meta.err) {
      throw new Error('STRICT ENFORCEMENT: Transaction failed on blockchain');
    }
    
    const preTokenBalances = swapTx.meta.preTokenBalances || [];
    const postTokenBalances = swapTx.meta.postTokenBalances || [];
    
    // For SOL swaps, check SOL balance changes
    if (fromTokenAddress === "So11111111111111111111111111111111111111112") {
      const preBalances = swapTx.meta.preBalances || [];
      const postBalances = swapTx.meta.postBalances || [];
      
      if (preBalances.length === 0 || postBalances.length === 0) {
        throw new Error('STRICT ENFORCEMENT: No SOL balance changes found');
      }
      
      const balanceChange = preBalances[0] - postBalances[0];
      if (balanceChange < 1000000) { // Less than 0.001 SOL
        throw new Error('STRICT ENFORCEMENT: SOL balance change too small to be a valid swap');
      }
    } else {
      // For SPL tokens, verify token balance changes
      const fromTokenFound = preTokenBalances.some(balance => balance.mint === fromTokenAddress);
      if (!fromTokenFound) {
        throw new Error('STRICT ENFORCEMENT: From token not found in transaction');
      }
    }
    
    console.log('✅ Swap transaction verified');
    
    // STRICT VALUE CALCULATION
    console.log('💰 Starting strict value calculation...');
    
    // Multiple attempts to get accurate price
    let fromTokenPrice = 0;
    let priceAttempts = 0;
    
    while (fromTokenPrice === 0 && priceAttempts < PRICE_VERIFICATION_RETRIES) {
      priceAttempts++;
      console.log(`Price fetch attempt ${priceAttempts}/${PRICE_VERIFICATION_RETRIES}`);
      
      try {
        fromTokenPrice = await getTokenPriceFromMultipleSources(fromTokenAddress);
        if (fromTokenPrice > 0) {
          console.log(`✅ Got valid price: $${fromTokenPrice} for ${fromTokenAddress}`);
          break;
        }
      } catch (error) {
        console.warn(`Price fetch attempt ${priceAttempts} failed:`, error);
        if (priceAttempts < PRICE_VERIFICATION_RETRIES) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }
    
    if (fromTokenPrice === 0) {
      throw new Error(`STRICT ENFORCEMENT: Could not get valid price for token ${fromTokenAddress} after ${PRICE_VERIFICATION_RETRIES} attempts`);
    }
    
    // Parse transaction to get EXACT amounts
    const preBalances = swapTx.meta.preTokenBalances || [];
    const postBalances = swapTx.meta.postTokenBalances || [];
    const preBalancesSOL = swapTx.meta.preBalances || [];
    const postBalancesSOL = swapTx.meta.postBalances || [];
    
    let swapAmount = 0;
    let swapAmountFound = false;
    
    console.log('🔍 Analyzing transaction balances...');
    
    // For SOL transactions (STRICT CHECKING)
    if (fromTokenAddress === "So11111111111111111111111111111111111111112") {
      console.log('🔍 Processing SOL transaction...');
      
      const userAccountIndex = 0;
      const preBalance = preBalancesSOL[userAccountIndex] || 0;
      const postBalance = postBalancesSOL[userAccountIndex] || 0;
      const lamportsDiff = preBalance - postBalance;
      
      console.log(`SOL Balance change: ${preBalance} -> ${postBalance} (diff: ${lamportsDiff} lamports)`);
      
      if (lamportsDiff > 0) {
        const transactionFee = swapTx.meta.fee || 5000;
        const priorityFee = 100000;
        const totalFees = transactionFee + priorityFee;
        
        const actualSwapLamports = lamportsDiff - totalFees;
        
        console.log(`Transaction fee: ${transactionFee}, Priority fee buffer: ${priorityFee}`);
        console.log(`Actual swap amount: ${actualSwapLamports} lamports`);
        
        if (actualSwapLamports > 0) {
          swapAmount = actualSwapLamports / LAMPORTS_PER_SOL;
          swapAmountFound = true;
          console.log(`✅ SOL swap amount calculated: ${swapAmount} SOL`);
        }
      }
    } else {
      // For SPL tokens (STRICT CHECKING)
      console.log('🔍 Processing SPL token transaction...');
      
      for (const preBalance of preBalances) {
        if (preBalance.mint === fromTokenAddress) {
          const postBalance = postBalances.find(
            pb => pb.accountIndex === preBalance.accountIndex && pb.mint === fromTokenAddress
          );
          
          if (postBalance) {
            const preAmount = preBalance.uiTokenAmount.uiAmount || 0;
            const postAmount = postBalance.uiTokenAmount.uiAmount || 0;
            const amountDiff = preAmount - postAmount;
            
            console.log(`Token balance change: ${preAmount} -> ${postAmount} (diff: ${amountDiff})`);
            
            if (amountDiff > 0) {
              swapAmount = amountDiff;
              swapAmountFound = true;
              console.log(`✅ SPL token swap amount calculated: ${swapAmount} ${fromTokenAddress}`);
              break;
            }
          }
        }
      }
    }
    
    if (!swapAmountFound || swapAmount <= 0) {
      throw new Error('STRICT ENFORCEMENT: Could not determine valid swap amount from transaction');
    }
    
    const actualSwapValue = swapAmount * fromTokenPrice;
    console.log(`🔍 FINAL CALCULATION: ${swapAmount} tokens × $${fromTokenPrice} = $${actualSwapValue}`);
    
    // STRICT ENFORCEMENT: Double-check the calculation
    if (actualSwapValue <= 0) {
      throw new Error('STRICT ENFORCEMENT: Calculated USD value is zero or negative');
    }
    
    if (actualSwapValue > 1000000) {
      throw new Error('STRICT ENFORCEMENT: Calculated USD value is unrealistically high');
    }
    
    console.log('💰 VERIFIED SWAP VALUE:', `$${actualSwapValue.toFixed(2)}`);
    
    // STRICT THRESHOLD ENFORCEMENT - ABSOLUTE MINIMUM
    console.log('🔒 STRICT THRESHOLD CHECK...');
    console.log(`Required: $${MINIMUM_AIRDROP_USD} (ABSOLUTE MINIMUM)`);
    console.log(`Actual: $${actualSwapValue.toFixed(2)}`);
    console.log('🚫 TRANSACTIONS BELOW $40 = NO AIRDROP');
    
    if (actualSwapValue < MINIMUM_AIRDROP_USD) {
      console.log('❌ BELOW THRESHOLD - AIRDROP DENIED');
      console.log(`STRICT ENFORCEMENT: $${actualSwapValue.toFixed(2)} < $${MINIMUM_AIRDROP_USD}`);
      console.log('🚫 TRANSACTION BELOW $40 MINIMUM - NO AIRDROP ALLOWED');
      
      return {
        success: false,
        error: `🚫 TRANSACTION BELOW $${MINIMUM_AIRDROP_USD} MINIMUM - NO AIRDROP`,
        belowThreshold: true,
        actualValue: actualSwapValue,
        requiredValue: MINIMUM_AIRDROP_USD
      };
    }
    
    console.log('✅ THRESHOLD MET - PROCEEDING WITH AIRDROP');
    console.log('🎉 USER QUALIFIES FOR OTFI AIRDROP');
    
    // Calculate airdrop amount based on verified value
    let airdropAmount = OTFI_AIRDROP_AMOUNT;
    if (actualSwapValue >= 100) {
      airdropAmount = OTFI_AIRDROP_AMOUNT * 2;
      console.log(`🎁 Premium airdrop: ${airdropAmount} OTFI (trade ≥ $100)`);
    } else if (actualSwapValue >= 50) {
      airdropAmount = OTFI_AIRDROP_AMOUNT * 1.5;
      console.log(`🎁 Enhanced airdrop: ${airdropAmount} OTFI (trade ≥ $50)`);
    } else {
      console.log(`🎁 Standard airdrop: ${airdropAmount} OTFI (trade ≥ $40)`);
    }
    
    // Convert to smallest unit
    const airdropAmountInSmallestUnit = Math.floor(airdropAmount * Math.pow(10, OTFI_DECIMALS));
    console.log(`🔢 Airdrop amount in smallest unit: ${airdropAmountInSmallestUnit}`);
    
    // Create airdrop authority keypair with enhanced error handling
    let airdropAuthority;
    console.log('🔑 Creating airdrop authority keypair...');
    
    try {
      const privateKeyBytes = bs58.decode(AIRDROP_AUTHORITY_PRIVATE_KEY);
      airdropAuthority = Keypair.fromSecretKey(privateKeyBytes);
      console.log('✅ Authority keypair created from base58');
    } catch (bs58Error) {
      console.log('⚠️ Base58 decode failed, trying JSON format...');
      try {
        const privateKeyArray = JSON.parse(AIRDROP_AUTHORITY_PRIVATE_KEY);
                airdropAuthority = Keypair.fromSecretKey(new Uint8Array(privateKeyArray));
        console.log('✅ Authority keypair created from JSON array');
      } catch (jsonError) {
        console.log('⚠️ JSON decode failed, trying CSV format...');
        try {
          const privateKeyArray = AIRDROP_AUTHORITY_PRIVATE_KEY.split(',').map(num => parseInt(num.trim()));
          airdropAuthority = Keypair.fromSecretKey(new Uint8Array(privateKeyArray));
          console.log('✅ Authority keypair created from CSV');
        } catch (csvError) {
          throw new Error('STRICT ENFORCEMENT: Invalid airdrop authority private key format');
        }
      }
    }
    
    console.log('🔑 Airdrop authority public key:', airdropAuthority.publicKey.toString());
    
    // Get token accounts
    console.log('🏦 Getting token accounts...');
    const userOTFITokenAccount = await getAssociatedTokenAddress(
      new PublicKey(OTFI_TOKEN_MINT),
      userPublicKey
    );
    
    const authorityOTFITokenAccount = await getAssociatedTokenAddress(
      new PublicKey(OTFI_TOKEN_MINT),
      airdropAuthority.publicKey
    );
    
    console.log('👤 User OTFI account:', userOTFITokenAccount.toString());
    console.log('🏛️ Authority OTFI account:', authorityOTFITokenAccount.toString());
    
    // Check if user account exists
    let userAccountExists = true;
    try {
      await getAccount(connection, userOTFITokenAccount);
      console.log('✅ User OTFI account exists');
    } catch (error) {
      userAccountExists = false;
      console.log('ℹ️ User OTFI account will be created');
    }
    
    // STRICT: Verify authority has enough tokens
    console.log('💰 Verifying authority token balance...');
    try {
      const authorityAccount = await getAccount(connection, authorityOTFITokenAccount);
      const authorityBalance = Number(authorityAccount.amount);
      const authorityBalanceUI = authorityBalance / Math.pow(10, OTFI_DECIMALS);
      
      console.log(`💰 Authority balance: ${authorityBalanceUI} OTFI (${authorityBalance} smallest units)`);
      console.log(`💸 Required for airdrop: ${airdropAmount} OTFI (${airdropAmountInSmallestUnit} smallest units)`);
      
      if (authorityBalance < airdropAmountInSmallestUnit) {
        throw new Error(`STRICT ENFORCEMENT: Insufficient OTFI tokens in airdrop wallet. Need: ${airdropAmount}, Have: ${authorityBalanceUI}`);
      }
      
      console.log('✅ Authority has sufficient balance');
    } catch (error) {
      if (error.message.includes('could not find account')) {
        throw new Error('STRICT ENFORCEMENT: Airdrop authority does not have an OTFI token account');
      }
      throw error;
    }
    
    // Create airdrop transaction
    console.log('📝 Creating airdrop transaction...');
    const airdropTransaction = new Transaction();
    
    // Add create associated token account instruction if needed
    if (!userAccountExists) {
      console.log('🏗️ Adding create ATA instruction...');
      const createATAInstruction = createAssociatedTokenAccountInstruction(
        airdropAuthority.publicKey, // payer
        userOTFITokenAccount, // associated token account
        userPublicKey, // owner
        new PublicKey(OTFI_TOKEN_MINT), // mint
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
      );
      airdropTransaction.add(createATAInstruction);
      console.log('✅ Create ATA instruction added');
    }
    
    // Add transfer instruction
    console.log('💸 Adding transfer instruction...');
    const transferInstruction = createTransferInstruction(
      authorityOTFITokenAccount, // source
      userOTFITokenAccount, // destination
      airdropAuthority.publicKey, // owner
      airdropAmountInSmallestUnit, // amount
      [],
      TOKEN_PROGRAM_ID
    );
    airdropTransaction.add(transferInstruction);
    console.log('✅ Transfer instruction added');
    
    // Get recent blockhash with retry logic
    console.log('🔗 Getting recent blockhash...');
    let blockhash;
    let blockAttempts = 0;
    
    while (!blockhash && blockAttempts < 3) {
      blockAttempts++;
      try {
        const { blockhash: recentBlockhash } = await connection.getLatestBlockhash('confirmed');
        blockhash = recentBlockhash;
        console.log(`✅ Got blockhash on attempt ${blockAttempts}`);
      } catch (error) {
        console.warn(`Blockhash fetch attempt ${blockAttempts} failed:`, error);
        if (blockAttempts < 3) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }
    
    if (!blockhash) {
      throw new Error('STRICT ENFORCEMENT: Could not get recent blockhash after 3 attempts');
    }
    
    airdropTransaction.recentBlockhash = blockhash;
    airdropTransaction.feePayer = airdropAuthority.publicKey;
    
    // Sign and send the airdrop transaction
    console.log('✍️ Signing airdrop transaction...');
    airdropTransaction.sign(airdropAuthority);
    
    console.log('📤 Sending airdrop transaction...');
    const airdropSignature = await connection.sendRawTransaction(
      airdropTransaction.serialize(),
      {
        skipPreflight: false,
        preflightCommitment: 'confirmed',
        maxRetries: 3
      }
    );
    
    console.log('📋 OTFI Airdrop transaction sent:', airdropSignature);
    
    // Wait for confirmation with timeout
    console.log('⏳ Waiting for airdrop confirmation...');
    const confirmationPromise = connection.confirmTransaction(airdropSignature, 'confirmed');
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Confirmation timeout')), 30000)
    );
    
    await Promise.race([confirmationPromise, timeoutPromise]);
    
    console.log('✅ AIRDROP TRANSACTION CONFIRMED');
    console.log(`🎉 Successfully airdropped ${airdropAmount} OTFI tokens to user!`);
    
    // Record successful airdrop
    try {
      const history = localStorage.getItem(AIRDROP_HISTORY_KEY) || '[]';
      const airdropHistory = JSON.parse(history);
      
      airdropHistory.push({
        userPublicKey: userPublicKey.toString(),
        swapSignature,
        swapValue: actualSwapValue,
        airdropAmount,
        airdropSignature,
        timestamp: Date.now(),
        verificationMethod: 'STRICT_ONCHAIN',
        userAgent: navigator.userAgent,
        url: window.location.href,
        blockTime: Date.now()
      });
      
      // Keep only last 1000 records
      if (airdropHistory.length > 1000) {
        airdropHistory.splice(0, airdropHistory.length - 1000);
      }
      
      localStorage.setItem(AIRDROP_HISTORY_KEY, JSON.stringify(airdropHistory));
      console.log('✅ Airdrop success recorded with strict verification');
    } catch (error) {
      console.error('Error recording airdrop success:', error);
    }
    
    // Return success with all details
    return {
      success: true,
      amount: airdropAmount,
      signature: airdropSignature,
      verifiedValue: actualSwapValue,
      message: `🎉 VERIFIED ON-CHAIN: You received ${airdropAmount} OTFI tokens!`
    };
    
  } catch (error) {
    console.error('❌ STRICT AIRDROP VERIFICATION FAILED:', error);
    return {
      success: false,
      error: error.message || 'Unknown error during airdrop verification'
    };
  }
};


// Add this function before executeSwap
const shouldProcessAirdrop = (usdValue) => {
  return usdValue && usdValue >= MINIMUM_AIRDROP_USD;
};



const executeSwap = async () => {
  if (!connected || !publicKey || !fromToken || !toToken || !fromAmount || parseFloat(fromAmount) <= 0) return;
  
  setLoading(true);
  setTxStatus('processing');
  
  // Check if user qualifies for airdrop BEFORE processing
  const qualifiesForAirdrop = shouldProcessAirdrop(fromUsdValue);
  
  // Set appropriate message based on qualification
  setTxMessage(mevProtectionEnabled ? 'Preparing swap with MEV protection...' : 'Preparing swap...');
  
  let signatures = [];
  let executedChunks = 0;
  let shouldUseTwap = false;
  let priorityFee = 0;
  let signature = null;

  try {
    const inputAmountInSmallestUnit = Math.floor(parseFloat(fromAmount) * Math.pow(10, fromToken.decimals));
    
    console.log(`Swapping ${fromAmount} ${fromToken.symbol}${mevProtectionEnabled ? ' with MEV protection' : ''}`);
    console.log(`Airdrop qualification: ${qualifiesForAirdrop ? 'YES' : 'NO'} (Value: $${fromUsdValue?.toFixed(2) || 0})`);
    
    // Check balance
    if (fromToken.address === "So11111111111111111111111111111111111111112") {
      if (fromTokenBalance < parseFloat(fromAmount) + 0.01) {
        throw new Error(`Insufficient SOL balance. Keep some SOL for transaction fees.`);
      }
    } else if (fromTokenBalance < parseFloat(fromAmount)) {
      throw new Error(`Insufficient ${fromToken.symbol} balance`);
    }
    
    // Check if TWAP should be enabled based on trade size
    shouldUseTwap = mevProtectionEnabled && 
                   MEV_PROTECTION.TWAP_ENABLED && 
                   fromUsdValue && 
                   fromUsdValue >= MEV_PROTECTION.TWAP_THRESHOLD_USD;
    
    if (shouldUseTwap) {
      setTxMessage('Large trade detected - using TWAP execution for MEV protection...');
      
      // Split trade into chunks
      const chunks = await TWAPExecution.splitTrade(
        inputAmountInSmallestUnit.toString(),
        fromToken.address,
        toToken.address,
        fromToken.decimals
      );
      
      console.log(`Split trade into ${chunks.length} chunks for TWAP execution`);
      
      let totalOutputAmount = 0;
      executedChunks = 0;
      
      // Execute chunks with delays
      for (const chunk of chunks) {
        try {
          setTwapProgress({
            current: chunk.chunkIndex,
            total: chunk.totalChunks,
            status: 'executing'
          });
          
          setTxMessage(`Executing chunk ${chunk.chunkIndex}/${chunk.totalChunks} with MEV protection...`);
          
          // Get chunk transaction
          const chunkData = await TWAPExecution.executeChunk(chunk, publicKey, slippage);
          
          // Deserialize and send transaction
          const transaction = VersionedTransaction.deserialize(Buffer.from(chunkData.transaction, 'base64'));
          
          let chunkSignature;
          if (window.phantom && window.phantom.solana) {
            chunkSignature = await phantomSignAndSendTransaction(transaction);
          } else {
            chunkSignature = await sendTransaction(transaction, connection);
          }
          
          signatures.push(chunkSignature);
          console.log(`Chunk ${chunk.chunkIndex} executed with signature:`, chunkSignature);
          
          // Wait for confirmation
          await connection.confirmTransaction(chunkSignature, 'confirmed');
          
          totalOutputAmount += parseFloat(chunkData.quote.outAmount) / Math.pow(10, toToken.decimals);
          executedChunks++;
          
          setTwapProgress({
            current: chunk.chunkIndex,
            total: chunk.totalChunks,
            status: 'confirmed'
          });
          
          // Add delay between chunks (except for the last one)
          if (chunk.chunkIndex < chunk.totalChunks) {
            setTxMessage(`Chunk ${chunk.chunkIndex} completed. Waiting ${MEV_PROTECTION.TWAP_DELAY_MS/1000}s before next chunk...`);
            await new Promise(resolve => setTimeout(resolve, MEV_PROTECTION.TWAP_DELAY_MS));
          }
          
        } catch (chunkError) {
          console.error(`Failed to execute chunk ${chunk.chunkIndex}:`, chunkError);
          
          // For TWAP, we can continue with remaining chunks if one fails
          setTwapProgress({
            current: chunk.chunkIndex,
            total: chunk.totalChunks,
            status: 'failed'
          });
          
          // Wait a bit before trying next chunk
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
      
      if (executedChunks === 0) {
        throw new Error('All TWAP chunks failed to execute');
      }
      
      // TWAP execution completed
      setSuccess(true);
      setTxStatus('success');
      setTwapProgress(null);
      signature = signatures[0]; // Use first signature for airdrop processing
      
    } else {
      // Regular transaction - with or without MEV protection
      setTxMessage(mevProtectionEnabled ? 'Executing swap with MEV protection...' : 'Executing swap...');
      
      // Only get priority fee if MEV protection is enabled
      if (mevProtectionEnabled) {
        priorityFee = await getPriorityFee();
        console.log('Using priority fee:', priorityFee);
      } else {
        console.log('MEV protection disabled, using default priority fee');
      }
      
      // Get quote
      const quoteResponse = await fetch(
        `https://quote-api.jup.ag/v6/quote?inputMint=${fromToken.address}` +
        `&outputMint=${toToken.address}` +
        `&amount=${inputAmountInSmallestUnit}` +
        `&slippageBps=${Math.floor(slippage * 100)}` +
        `&platformFeeBps=${FEE_BPS}`
      );
      
      if (!quoteResponse.ok) {
        const errorData = await quoteResponse.json();
        throw new Error(`Failed to get quote: ${errorData.error || 'Unknown error'}`);
      }
      
      const quoteData = await quoteResponse.json();
      
      // MEV Protection checks - only if enabled
      if (mevProtectionEnabled) {
        // Check price impact
        if (quoteData.priceImpactPct && Math.abs(quoteData.priceImpactPct) > MEV_PROTECTION.MAX_PRICE_IMPACT) {
          throw new Error(`Price impact too high: ${(quoteData.priceImpactPct * 100).toFixed(2)}%. Consider using smaller amounts or TWAP.`);
        }
        
        // Check minimum routes
        const routeCount = quoteData.routePlan ? quoteData.routePlan.length : 1;
        if (routeCount < MEV_PROTECTION.MIN_ROUTES) {
          console.warn(`Only ${routeCount} route(s) available, MEV risk may be higher`);
        }
      }
      
      setTxMessage(mevProtectionEnabled ? 'Building MEV-protected transaction...' : 'Building transaction...');
      
      // Fee account selection
      let feeAccount;
      const hasFeeAccountForInput = FEE_ACCOUNTS[fromToken.address] !== undefined;
      const hasFeeAccountForOutput = FEE_ACCOUNTS[toToken.address] !== undefined;
      
      if (hasFeeAccountForInput) {
        feeAccount = FEE_ACCOUNTS[fromToken.address];
      } else if (hasFeeAccountForOutput) {
        feeAccount = FEE_ACCOUNTS[toToken.address];
      } else {
        feeAccount = FEE_ACCOUNTS.DEFAULT;
      }
      
      // Create swap transaction
      const swapRequestBody = {
        quoteResponse: quoteData,
        userPublicKey: publicKey.toString(),
        wrapAndUnwrapSol: true,
        platformFeeBps: FEE_BPS,
        feeAccount: feeAccount,
        asLegacyTransaction: false,
        skipUserAccountsCheck: true
      };
      
      // Only add priority fee if MEV protection is enabled
      if (mevProtectionEnabled && priorityFee > 0) {
        swapRequestBody.computeUnitPriceMicroLamports = priorityFee;
      }
      
      console.log(mevProtectionEnabled ? "MEV-protected swap request:" : "Regular swap request:", swapRequestBody);
      
      const swapResponse = await fetch('https://quote-api.jup.ag/v6/swap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(swapRequestBody)
      });

      if (!swapResponse.ok) {
        const errorData = await swapResponse.json();
        throw new Error(`Failed to create swap transaction: ${errorData.error || 'Unknown error'}`);
      }

      const swapData = await swapResponse.json();
      const { swapTransaction } = swapData;
      
      if (!swapTransaction) {
        throw new Error('No swap transaction received');
      }

      setTxMessage(mevProtectionEnabled ? 'Please approve MEV-protected transaction in wallet...' : 'Please approve transaction in wallet...');
      
      // Deserialize the transaction
      const transaction = VersionedTransaction.deserialize(Buffer.from(swapTransaction, 'base64'));
      
      // Execute transaction
      try {
        if (window.phantom && window.phantom.solana) {
          signature = await phantomSignAndSendTransaction(transaction);
        } else {
          signature = await sendTransaction(transaction, connection);
        }
      } catch (error) {
        console.error('Transaction signing failed:', error);
        if (window.phantom && window.phantom.solana) {
          try {
            signature = await sendTransaction(transaction, connection);
          } catch (fallbackError) {
            throw fallbackError;
          }
        } else {
          throw error;
        }
      }
      
      signatures.push(signature);
      setTxMessage(mevProtectionEnabled ? 'Processing MEV-protected swap...' : 'Processing swap...');
      
      // Wait for confirmation
      const confirmationStrategy = {
        signature: signature,
        commitment: 'confirmed',
        timeout: mevProtectionEnabled ? MEV_PROTECTION.CONFIRMATION_TIMEOUT : 60000
      };
      
      await connection.confirmTransaction(confirmationStrategy);
      
      // Single transaction success
      setSuccess(true);
      setTxStatus('success');
      executedChunks = 1;
    }
    
    // Handle post-swap processing based on airdrop qualification
    if (qualifiesForAirdrop) {
      console.log('✅ User qualifies for airdrop - processing...');
      
      // Execute airdrop
      setAirdropLoading(true);
      setTxMessage(shouldUseTwap 
        ? 'TWAP execution completed! Processing OTFI airdrop...' 
        : (mevProtectionEnabled ? 'MEV-protected swap completed! Processing OTFI airdrop...' : 'Swap completed! Processing OTFI airdrop...')
      );
      
      const airdropResult = await executeOTFIAirdrop(
        publicKey, 
        signature, // The actual swap transaction signature
        fromToken.address, // From token address
        toToken.address // To token address
      );
      
      setAirdropStatus(airdropResult);
      setAirdropLoading(false);
      
      // Handle airdrop success/failure messages
      if (airdropResult.success) {
        setTxMessage(
          <div>
            <div>{shouldUseTwap ? 'TWAP swap completed successfully!' : (mevProtectionEnabled ? 'MEV-protected swap completed successfully!' : 'Swap completed successfully!')}</div>
            <div style={{ color: '#14F195', marginTop: '8px', fontWeight: 'bold' }}>
              🎉 You received {airdropResult.amount} OTFI tokens as a reward!
            </div>
            {mevProtectionEnabled && !shouldUseTwap && (
              <div style={{ color: '#9945FF', marginTop: '4px', fontSize: '0.9em' }}>
                🛡️ Protected from MEV with priority fee: {priorityFee.toLocaleString()} lamports
              </div>
            )}
            <div style={{ marginTop: '8px' }}>
              {shouldUseTwap ? (
                <div>
                  {signatures.map((sig, index) => (
                    <div key={index}>
                      <a 
                        href={`https://solscan.io/tx/${sig}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: '#3498db', textDecoration: 'underline' }}
                      >
                        View Chunk {index + 1}
                      </a>
                      {index < signatures.length - 1 && ' | '}
                    </div>
                  ))}
                  <a 
                    href={`https://solscan.io/tx/${airdropResult.signature}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#14F195', textDecoration: 'underline' }}
                  >
                    View Airdrop
                  </a>
                </div>
              ) : (
                <div>
                  <a 
                    href={`https://solscan.io/tx/${signature}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#3498db', textDecoration: 'underline' }}
                  >
                    View Swap
                  </a>
                  {' | '}
                  <a 
                    href={`https://solscan.io/tx/${airdropResult.signature}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#14F195', textDecoration: 'underline' }}
                  >
                    View Airdrop
                  </a>
                </div>
              )}
            </div>
          </div>
        );
      } else {
        setTxMessage(
          <div>
            <div>{shouldUseTwap ? 'TWAP swap completed successfully!' : (mevProtectionEnabled ? 'MEV-protected swap completed successfully!' : 'Swap completed successfully!')}</div>
            <div style={{ color: '#e74c3c', marginTop: '8px' }}>
              ❌ OTFI airdrop failed: {airdropResult.error}
            </div>
            {mevProtectionEnabled && !shouldUseTwap && (
              <div style={{ color: '#9945FF', marginTop: '4px', fontSize: '0.9em' }}>
                🛡️ Protected from MEV with priority fee: {priorityFee.toLocaleString()} lamports
                </div>
            )}
            <div style={{ marginTop: '8px' }}>
              {shouldUseTwap ? (
                <div>
                  {signatures.map((sig, index) => (
                    <div key={index}>
                      <a 
                        href={`https://solscan.io/tx/${sig}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: '#3498db', textDecoration: 'underline' }}
                      >
                        View Chunk {index + 1}
                      </a>
                      {index < signatures.length - 1 && ' | '}
                    </div>
                  ))}
                </div>
              ) : (
                <a 
                  href={`https://solscan.io/tx/${signature}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#3498db', textDecoration: 'underline' }}
                >
                  View Swap on Solscan
                </a>
              )}
            </div>
          </div>
        );
      }
    } else {
      // User doesn't qualify - just show simple success message
      console.log('ℹ️ User does not qualify for airdrop - showing simple success message');
      
      setTxMessage(
        <div>
          <div>{shouldUseTwap ? 'TWAP swap completed successfully!' : (mevProtectionEnabled ? 'MEV-protected swap completed successfully!' : 'Swap completed successfully!')}</div>
          {mevProtectionEnabled && !shouldUseTwap && (
            <div style={{ color: '#9945FF', marginTop: '4px', fontSize: '0.9em' }}>
              🛡️ Protected from MEV with priority fee: {priorityFee.toLocaleString()} lamports
            </div>
          )}
          <div style={{ marginTop: '8px' }}>
            {shouldUseTwap ? (
              <div>
                {signatures.map((sig, index) => (
                  <div key={index}>
                    <a 
                      href={`https://solscan.io/tx/${sig}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#3498db', textDecoration: 'underline' }}
                    >
                      View Chunk {index + 1}
                    </a>
                    {index < signatures.length - 1 && ' | '}
                  </div>
                ))}
              </div>
            ) : (
              <a 
                href={`https://solscan.io/tx/${signature}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#3498db', textDecoration: 'underline' }}
              >
                View Transaction on Solscan
              </a>
            )}
          </div>
        </div>
      );
      
      // Set airdrop status to null so UI doesn't show airdrop info
      setAirdropStatus(null);
      setAirdropLoading(false);
    }
    
    // Record transaction for analytics (include airdrop info only if processed)
    try {
      recordSwapForAnalytics({
        fromToken: fromToken.symbol,
        toToken: toToken.symbol,
        fromAmount: parseFloat(fromAmount),
        toAmount: parseFloat(toAmount),
        usdValue: fromUsdValue || 0,
        txHash: signatures[0],
        walletAddress: publicKey.toString(),
        airdropReceived: qualifiesForAirdrop ? (airdropStatus?.success || false) : false,
        airdropAmount: qualifiesForAirdrop ? (airdropStatus?.success ? airdropStatus.amount : 0) : 0,
        airdropTxHash: qualifiesForAirdrop ? (airdropStatus?.success ? airdropStatus.signature : null) : null,
        airdropEligible: qualifiesForAirdrop,
        airdropThresholdMet: qualifiesForAirdrop,
        mevProtected: mevProtectionEnabled,
        twapUsed: shouldUseTwap,
        chunksExecuted: executedChunks
      });
    } catch (analyticsError) {
      console.error('Error recording analytics:', analyticsError);
    }
    
    // Reset form
    setFromAmount('');
    setToAmount('');
    setFromUsdValue(null);
    setToUsdValue(null);
    setExchangeRate(null);
    setPriceImpact(null);
    
    // Update balances after swap
    fetchTokenBalances();
    
  } catch (err) {
    console.error(mevProtectionEnabled ? 'MEV-protected swap failed:' : 'Swap failed:', err);
    setTxStatus('error');
    setError('Transaction failed: ' + (err.message || 'Unknown error'));
    setTxMessage('Transaction failed: ' + (err.message || 'Unknown error'));
    
    // Reset states on error
    setAirdropStatus(null);
    setAirdropLoading(false);
    setTwapProgress(null);
  } finally {
    setLoading(false);
  }
};








    

    
  
// Updated createLimitOrder function
const createLimitOrder = async () => {
  if (!connected || !publicKey || !fromToken || !toToken || !fromAmount || !limitPrice) return;
  
  // Check minimum order size (5 USD)
  if (fromUsdValue < 5) {
    setError('Minimum order size is 5 USD');
    return;
  }

  setLoading(true);
  setTxStatus('processing');
  setTxMessage('Preparing limit order...');

  try {
    // Calculate exact amounts with proper decimal handling
    const makingAmount = Math.floor(parseFloat(fromAmount) * Math.pow(10, fromToken.decimals));
    
    // Calculate takingAmount based on the limit price
    // This is how much the user expects to receive
    const takingAmount = Math.floor(parseFloat(fromAmount) * parseFloat(limitPrice) * Math.pow(10, toToken.decimals));

    console.log('Creating limit order with:');
    console.log(`- Input: ${fromAmount} ${fromToken.symbol} (${makingAmount} base units)`);
    console.log(`- Expected output: ${parseFloat(fromAmount) * parseFloat(limitPrice)} ${toToken.symbol} (${takingAmount} base units)`);
    console.log(`- Price per ${fromToken.symbol}: ${limitPrice} ${toToken.symbol}`);

    const orderRequest = {
      inputMint: fromToken.address,
      outputMint: toToken.address,
      maker: publicKey.toString(),
      payer: publicKey.toString(),
      params: {
        makingAmount: makingAmount.toString(),
        takingAmount: takingAmount.toString()
      },
      computeUnitPrice: "auto",
      wrapAndUnwrapSol: true
    };

    console.log('Order Request:', orderRequest);

    const response = await fetch('https://api.jup.ag/limit/v2/createOrder', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(orderRequest)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || errorData.error || 'Failed to create order');
    }

    const data = await response.json();
    console.log('API Response:', data);

// Deserialize and send the transaction
const transaction = VersionedTransaction.deserialize(Buffer.from(data.tx, 'base64'));

// Check which wallet is connected and use the appropriate method
let signature;
try {
  // Check if we're using Phantom specifically
  const isPhantomWallet = window.phantom && window.phantom.solana && window.phantom.solana.isConnected;
  
  if (isPhantomWallet) {
    // Use Phantom's native method
    console.log('Using Phantom native signAndSendTransaction');
    signature = await phantomSignAndSendTransaction(transaction);
  } else {
    // For all other wallets, use the wallet adapter
    console.log('Using wallet adapter sendTransaction for non-Phantom wallet');
    signature = await sendTransaction(transaction, connection);
  }
} catch (error) {
  console.error('Transaction signing failed:', error);
  throw error;
}
    
    console.log('Transaction sent with signature:', signature);
    
    // Wait for confirmation
    setTxMessage('Confirming transaction...');
    await connection.confirmTransaction(signature, 'confirmed');
    
    setTxStatus('success');
    setTxMessage(`Limit order created! You will receive ${parseFloat(fromAmount) * parseFloat(limitPrice)} ${toToken.symbol} when your order is filled.`);
    
    // Record the order for analytics
    try {
      recordSwapForAnalytics({
        fromToken: fromToken.symbol,
        toToken: toToken.symbol,
        fromAmount: parseFloat(fromAmount),
        toAmount: parseFloat(fromAmount) * parseFloat
        (limitPrice),
        usdValue: fromUsdValue || 0,
        txHash: signature,
        walletAddress: publicKey.toString(),
        orderType: 'limit'
      });
    } catch (analyticsError) {
      console.error('Error recording analytics:', analyticsError);
    }
    
    // Reset form
    setFromAmount('');
    setLimitPrice('');
    setSuccess(true);
    
    // Refresh balances
    if (typeof fetchTokenBalances === 'function') {
      fetchTokenBalances();
    } else {
      // If fetchTokenBalances is not defined, manually update balances
      if (connected && publicKey) {
        const fromBalance = await getTokenBalance(
          connection, 
          fromToken.address, 
          publicKey.toString()
        );
        setFromTokenBalance(fromBalance);
        
        const toBalance = await getTokenBalance(
          connection, 
          toToken.address, 
          publicKey.toString()
        );
        setToTokenBalance(toBalance);
      }
    }

  } catch (error) {
    console.error('Limit order failed:', error);
    setTxStatus('error');
    setError(`Order creation failed: ${error.message}`);
    setTxMessage(`Order creation failed: ${error.message}`);
  } finally {
    setLoading(false);
  }
};





  
  
// Token dropdown component
const TokenDropdown = ({ isFrom, isOpen, setIsOpen }) => {
  const currentToken = isFrom ? fromToken : toToken;
  
  // Filter tokens based on search query
  const searchResults = React.useMemo(() => {
    if (!searchQuery) return [];
    
    // Search in all tokens including imported tokens
    const allTokens = [...filteredTokens, ...customTokens];
    
    // Remove duplicates by address
    const uniqueTokens = Array.from(
      new Map(allTokens.map(token => [token.address, token])).values()
    );
    
    // Filter by search query
    const results = uniqueTokens.filter(token => 
      token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.address.toLowerCase() === searchQuery.toLowerCase()
    );
    
    // Sort by relevance
    return results.sort((a, b) => {
      // Exact symbol match gets highest priority
      if (a.symbol.toLowerCase() === searchQuery.toLowerCase()) return -1;
      if (b.symbol.toLowerCase() === searchQuery.toLowerCase()) return 1;
      
      // Then sort by whether symbol starts with query
      const aStartsWith = a.symbol.toLowerCase().startsWith(searchQuery.toLowerCase());
      const bStartsWith = b.symbol.toLowerCase().startsWith(searchQuery.toLowerCase());
      if (aStartsWith && !bStartsWith) return -1;
      if (!aStartsWith && bStartsWith) return 1;
      
      return 0;
    });
  }, [filteredTokens, customTokens, searchQuery]);
  
  return (
    <Box sx={{ position: 'relative' }}>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1,
          p: 1.5,
          borderRadius: 2,
          backgroundColor: theme.palette.mode === 'dark' 
            ? 'rgba(255, 255, 255, 0.05)' 
            : 'rgba(0, 0, 0, 0.02)',
          '&:hover': {
            backgroundColor: theme.palette.mode === 'dark' 
              ? 'rgba(255, 255, 255, 0.1)' 
              : 'rgba(0, 0, 0, 0.05)',
          },
          width: '100%',
          justifyContent: 'flex-start'
        }}
      >
        {currentToken ? (
          <>
            <img 
              src={currentToken.image} 
              alt={currentToken.name} 
              style={{ width: 24, height: 24, borderRadius: '50%' }} 
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/solana/info/logo.png';
              }}
            />
            <Typography>{currentToken.symbol}</Typography>
            {isCustomToken(currentToken.address) && (
              <Chip 
                size="small" 
                label="Imported" 
                color="primary" 
                variant="outlined" 
                sx={{ ml: 1, height: 16, fontSize: '0.6rem' }} 
              />
            )}
          </>
        ) : (
          <Typography>Select token</Typography>
        )}
      </Button>
      
      {isOpen && (
        <Paper
          elevation={3}
          sx={{
            position: 'absolute',
            // Position the dropdown above for TO token, below for FROM token
            ...(isFrom 
              ? { top: '100%', left: 0, mt: 1 } 
              : { bottom: '100%', left: 0, mb: 1 }),
            width: 380,
            maxHeight: 400,
            overflow: 'auto',
            zIndex: 1300, // Higher z-index to ensure it appears above other elements
            borderRadius: 2,
          }}
        >
          <Box sx={{ p: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Select a token
            </Typography>
            
            <TextField
              fullWidth
              placeholder="Search name, symbol, or paste address"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />
            
            {/* Search Results Section */}
            {searchQuery && searchResults.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Search Results
                </Typography>
                {searchResults.map((token) => (
                  <Box
                    key={token.address}
                    onClick={() => handleTokenSelect(token, isFrom)}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      p: 1.5,
                      borderRadius: 1,
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: theme.palette.mode === 'dark' 
                          ? 'rgba(255, 255, 255, 0.05)' 
                          : 'rgba(0, 0, 0, 0.02)',
                      },
                    }}
                  >
                    <img 
                      src={token.image} 
                      alt={token.name} 
                      style={{ width: 32, height: 32, borderRadius: '50%' }} 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/solana/info/logo.png';
                      }}
                    />
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body1">{token.symbol}</Typography>
                        {isCustomToken(token.address) && (
                          <Chip 
                            size="small" 
                            label="Imported" 
                            color="primary" 
                            variant="outlined" 
                            sx={{ ml: 1, height: 16, fontSize: '0.6rem' }} 
                          />
                        )}
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {token.name}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
            
            {/* Import token section */}
            {importTokenInfo && (
              <Box 
                sx={{ 
                  p: 2, 
                  mb: 2, 
                  borderRadius: 2, 
                  backgroundColor: theme.palette.mode === 'dark' 
                    ? 'rgba(255, 255, 255, 0.05)' 
                    : 'rgba(0, 0, 0, 0.02)',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <img 
                    src={importTokenInfo.image} 
                    alt={importTokenInfo.name} 
                    style={{ width: 24, height: 24, borderRadius: '50%' }} 
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/solana/info/logo.png';
                    }}
                  />
                  <Box>
                    <Typography variant="body1">{importTokenInfo.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {importTokenInfo.symbol}
                      {importTokenInfo.fromCoinCodex && (
                        <Chip 
                          size="small" 
                          label="CoinCodex" 
                          color="primary" 
                          variant="outlined" 
                          sx={{ ml: 1, height: 20, fontSize: '0.7rem' }} 
                        />
                      )}
                    </Typography>
                  </Box>
                </Box>
                <Button 
                  variant="contained" 
                  fullWidth
                  onClick={() => handleImportToken(isFrom)}
                >
                  Import Token
                </Button>
              </Box>
            )}
            
            {/* Custom tokens section */}
            {customTokens.length > 0 && !searchQuery && (
              <>
                <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                  Imported Tokens
                </Typography>
                {customTokens.map((token) => (
                  <Box
                    key={token.address}
                    onClick={() => handleTokenSelect(token, isFrom)}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      p: 1.5,
                      borderRadius: 1,
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: theme.palette.mode === 'dark' 
                          ? 'rgba(255, 255, 255, 0.05)' 
                          : 'rgba(0, 0, 0, 0.02)',
                      },
                    }}
                  >
                    <img 
                      src={token.image} 
                      alt={token.name} 
                      style={{ width: 32, height: 32, borderRadius: '50%' }} 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/solana/info/logo.png';
                      }}
                    />
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body1">{token.symbol}</Typography>
                        <Chip 
                          size="small" 
                          label="Imported" 
                          color="primary" 
                          variant="outlined" 
                          sx={{ ml: 1, height: 16, fontSize: '0.6rem' }} 
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {token.name}
                      </Typography>
                    </Box>
                  </Box>
                ))}
                <Divider sx={{ my: 1 }} />
              </>
            )}
            
            {/* Token list - show popular tokens when not searching, show search results when searching */}
            {!searchQuery ? (
              // When not searching, show only popular tokens
              <>
                <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                  Popular Tokens
                </Typography>
                
                {tokensLoading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                    <CircularProgress size={24} />
                  </Box>
                ) : popularTokens.length > 0 ? (
                  popularTokens.map((token) => (
                    <Box
                      key={token.address}
                      onClick={() => handleTokenSelect(token, isFrom)}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        p: 1.5,
                        borderRadius: 1,
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: theme.palette.mode === 'dark' 
                            ? 'rgba(255, 255, 255, 0.05)' 
                            : 'rgba(0, 0, 0, 0.02)',
                        },
                      }}
                    >
                      <img 
                        src={token.image} 
                        alt={token.name} 
                        style={{ width: 32, height: 32, borderRadius: '50%' }} 
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/solana/info/logo.png';
                        }}
                      />
                      <Box>
                        <Typography variant="body1">{token.symbol}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {token.name}
                        </Typography>
                      </Box>
                    </Box>
                  ))
                ) : (
                  <Box sx={{ p: 2, textAlign: 'center' }} color="text.secondary">
                    <Typography color="text.secondary">
                      No popular tokens found
                    </Typography>
                  </Box>
                )}
              </>
            ) : searchResults.length === 0 && (
              // No search results found
              <Box sx={{ p: 2, textAlign: 'center' }} color="text.secondary">
                <Typography color="text.secondary" gutterBottom>
                  No tokens found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                No results found. Try a different token symbol.
                </Typography>
              </Box>
            )}
          </Box>
        </Paper>
      )}
    </Box>
  );
};




  
  // Import warning dialog
  const ImportWarningDialog = () => (
    <Dialog
      open={showImportWarning}
      onClose={() => setShowImportWarning(false)}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <WarningIcon color="warning" />
          <Typography variant="h6">Import Token</Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        {tokenToImport && (
          <>
            <Alert severity="warning" sx={{ mb: 2 }}>
              <AlertTitle>Trade at your own risk!</AlertTitle>
              Anyone can create a token with any name, including fake versions of existing tokens. Learn about scams and security risks before proceeding.
            </Alert>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <img 
                src={tokenToImport.image} 
                alt={tokenToImport.name} 
                style={{ width: 40, height: 40, borderRadius: '50%' }} 
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/solana/info/logo.png';
                }}
              />
              <Box>
                <Typography variant="h6">{tokenToImport.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {tokenToImport.symbol}
                  {tokenToImport.fromCoinCodex && (
                    <Chip 
                      size="small" 
                      label="CoinCodex" 
                      color="primary" 
                      variant="outlined" 
                      sx={{ ml: 1, height: 20, fontSize: '0.7rem' }} 
                    />
                  )}
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" gutterBottom>
                <strong>Address:</strong> {tokenToImport.address}
              </Typography>
              {tokenToImport.website && (
                <Typography variant="body2" gutterBottom>
                  <strong>Website:</strong> {tokenToImport.website}
                </Typography>
              )}
            </Box>
            
            <FormControlLabel
              control={
                <Checkbox 
                  checked={importConfirmed} 
                  onChange={(e) => setImportConfirmed(e.target.checked)} 
                />
              }
              label="I understand that this token may be a scam and I take full responsibility for my actions."
            />
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setShowImportWarning(false)}>
          Cancel
        </Button>
        <Button 
          variant="contained" 
          disabled={!importConfirmed}
          onClick={() => confirmImportToken(true)}
        >
          Import
        </Button>
      </DialogActions>
    </Dialog>
  );
  
  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: theme.palette.mode === 'dark' 
        ? 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)' 
        : 'linear-gradient(135deg, #f5f7fa, #c3cfe2)',
      pt: 4,
      pb: 8
    }}>
      <Container maxWidth="xl">
        <Header />

        <TrendingSolanaTokens />
        
        <Grid container spacing={3} sx={{ mt: 4 }}>
          {/* Swap Form */}
          <Grid item xs={12} md={5} lg={4}>
            <Paper 
              elevation={0}
              className="glass"
              sx={{ 
                p: 4, 
                borderRadius: 4,
                width: '100%'
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" component="h1" fontWeight="bold">
                  Swap
                </Typography>
                
                <Tooltip title="Settings">
                  <IconButton onClick={() => setShowSettings(true)}>
                    <SettingsIcon />
                  </IconButton>
                </Tooltip>
              </Box>
              
              {/* Swap Tabs */}
              <Tabs 
                value={activeTab}
                onChange={(e, newValue) => setActiveTab(newValue)}
                sx={{ mb: 3 }}
              >
                <Tab value="market" label="Market" />
                <Tab value="limit" label="Limit" />
              </Tabs>
              
              {/* From token */}
              <Paper 
                elevation={0}
                sx={{ 
                  p: 2, 
                  mb: 1,
                  borderRadius: 3,
                  backgroundColor: theme.palette.mode === 'dark' 
                    ? 'rgba(255, 255, 255, 0.05)' 
                    : 'rgba(0, 0, 0, 0.02)'
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    From
                  </Typography>
                  
                  {connected && fromToken && (
                    <Typography variant="body2" color="text.secondary">
                      Balance: {fromTokenBalance.toFixed(6)} {fromToken.symbol}
                    </Typography>
                  )}
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ width: '40%' }}>
                    <TokenDropdown 
                      isFrom={true} 
                      isOpen={isFromDropdownOpen} 
                      setIsOpen={setIsFromDropdownOpen} 
                    />
                  </Box>
                  
                  <TextField 
                    fullWidth
                    placeholder="0.0"
                    value={fromAmount}
                    onChange={(e) => {
                      // Only allow numbers and decimals
                      const re = /^[0-9]*[.,]?[0-9]*$/;
                      if (e.target.value === '' || re.test(e.target.value)) {
                        setFromAmount(e.target.value);
                      }
                    }}
                    InputProps={{
                      disableUnderline: true,
                      endAdornment: connected && fromToken && (
                        <InputAdornment position="end">
                          <Button 
                            variant="text" 
                            size="small"
                            onClick={() => setFromAmount(fromTokenBalance.toString())}
                            sx={{ 
                              minWidth: 'auto',
                              color: theme.palette.primary.main,
                              fontWeight: 'bold',
                              p: 0
                            }}
                          >
                            MAX
                          </Button>
                        </InputAdornment>
                      ),
                      sx: { 
                        fontSize: '1.5rem',
                        fontWeight: 'medium',
                        '.MuiOutlinedInput-notchedOutline': { border: 'none' }
                      }
                    }}
                    variant="outlined"
                  />
                </Box>
                
                {fromUsdValue !== null && (
  <Typography variant="caption" color="text.secondary" sx={{ pl: 2 }}>
    ≈ {formatUsdValue(fromUsdValue)}
  </Typography>
)}

              </Paper>
              
              {/* Swap button */}
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 1 }}>
                <IconButton 
                  onClick={handleSwapTokens}
                  sx={{ 
                    backgroundColor: theme.palette.mode === 'dark' 
                      ? 'rgba(255, 255, 255, 0.05)' 
                      : 'rgba(0, 0, 0, 0.02)',
                    '&:hover': {
                      backgroundColor: theme.palette.mode === 'dark' 
                        ? 'rgba(255, 255, 255, 0.1)' 
                        : 'rgba(0, 0, 0, 0.05)',
                    }
                  }}
                >
                  <SwapVertIcon />
                </IconButton>
              </Box>
              
              {/* To token */}
              <Paper 
                elevation={0}
                sx={{ 
                  p: 2, 
                  mb: 3,
                  borderRadius: 3,
                  backgroundColor: theme.palette.mode === 'dark' 
                    ? 'rgba(255, 255, 255, 0.05)' 
                    : 'rgba(0, 0, 0, 0.02)'
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    To
                  </Typography>
                  
                  {connected && toToken && (
                    <Typography variant="body2" color="text.secondary">
                      Balance: {toTokenBalance.toFixed(6)} {toToken.symbol}
                    </Typography>
                  )}
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ width: '40%' }}>
                    <TokenDropdown 
                      isFrom={false} 
                      isOpen={isToDropdownOpen} 
                      setIsOpen={setIsToDropdownOpen} 
                    />
                  </Box>
                  
                  <TextField 
                    fullWidth
                    placeholder="0.0"
                    value={activeTab === 'market' ? toAmount : ''}
                    disabled={activeTab === 'market'}
                    InputProps={{
                      disableUnderline: true,
                      sx: { 
                        fontSize: '1.5rem',
                        fontWeight: 'medium',
                        '.MuiOutlinedInput-notchedOutline': { border: 'none' }
                      }
                    }}
                    variant="outlined"
                  />
                </Box>
                
                {toUsdValue !== null && activeTab === 'market' && (
  <Typography variant="caption" color="text.secondary" sx={{ pl: 2 }}>
    ≈ {formatUsdValue(toUsdValue)}
  </Typography>
)}

              </Paper>
              
              {/* Limit Price Input (only shown in limit tab) */}
              {activeTab === 'limit' && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Limit Price (in {toToken?.symbol})
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder={`Enter price in ${toToken?.symbol}`}
                    value={limitPrice}
                    onChange={(e) => {
                      // Only allow numbers and decimals
                      const re = /^[0-9]*[.,]?[0-9]*$/;
                      if (e.target.value === '' || re.test(e.target.value)) {
                        setLimitPrice(e.target.value);
                      }
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Typography variant="body2">{toToken?.symbol}</Typography>
                        </InputAdornment>
                      ),
                    }}
                    sx={{ 
                      '.MuiOutlinedInput-root': {
                        borderRadius: 2
                      }
                    }}
                  />
                  {fromAmount && limitPrice && (
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                      You will receive approximately {(parseFloat(fromAmount) * parseFloat(limitPrice)).toFixed(6)} {toToken?.symbol}
                    </Typography>
                  )}
                </Box>
              )}
              
            {/* Exchange rate info */}
{activeTab === 'market' && fromAmount && toAmount && (
  <SwapDetails
    fromToken={fromToken}
    toToken={toToken}
    exchangeRate={exchangeRate}
    priceImpact={priceImpact}
    slippage={slippage}
    networkFee={networkFee}
    route={route || [fromToken?.symbol, toToken?.symbol]} // Default to direct route if none provided
    markets={routeMarkets.length > 0 ? routeMarkets : ['Jupiter']} // Default to Jupiter if no specific markets
    fromUsdValue={fromUsdValue}
    airdropThreshold={OTFI_AIRDROP_THRESHOLD_USD}
    airdropAmount={OTFI_AIRDROP_AMOUNT}
  />
)}

{mevProtectionEnabled && fromUsdValue && (
  <Box 
    sx={{ 
      mb: 2,
      p: 2,
      borderRadius: 2,
      backgroundColor: 'rgba(153, 69, 255, 0.1)',
      border: '1px solid rgba(153, 69, 255, 0.3)'
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
      <Typography variant="body2" fontWeight="bold" color="#9945FF">
        🛡️ MEV Protection Active
      </Typography>
    </Box>
    
    {fromUsdValue >= MEV_PROTECTION.TWAP_THRESHOLD_USD ? (
      <Typography variant="caption" color="text.secondary">
        Large trade detected (${fromUsdValue.toFixed(0)}). Will use TWAP execution with {MEV_PROTECTION.TWAP_INTERVALS} chunks and {MEV_PROTECTION.TWAP_DELAY_MS/1000}s delays for maximum protection.
      </Typography>
    ) : (
      <Typography variant="caption" color="text.secondary">
        Using dynamic priority fees and price impact protection. Upgrade to TWAP execution for trades ≥ ${MEV_PROTECTION.TWAP_THRESHOLD_USD}.
      </Typography>
    )}
  </Box>
)}
            
              {/* Action button */}
              {!connected ? (
                <WalletConnectButton 
                  fullWidth
                  variant="contained"
                  size="large"
                  sx={{ 
                    py: 1.5,
                    borderRadius: 3,
                    fontSize: '1rem',
                    textTransform: 'none',
                    background: 'linear-gradient(45deg, #9945FF 0%, #14F195 100%)',
                  }}
                />
              ) : activeTab === 'market' ? (
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={!fromAmount || parseFloat(fromAmount) <= 0 || loading || parseFloat(fromAmount) > fromTokenBalance}
                  onClick={executeSwap}
                  sx={{ 
                    py: 1.5,
                    borderRadius: 3,
                    fontSize: '1rem',
                    textTransform: 'none',
                    background: 'linear-gradient(45deg, #9945FF 0%, #14F195 100%)',
                    '&.Mui-disabled': {
                      background: theme.palette.mode === 'dark' 
                        ? 'rgba(255, 255, 255, 0.12)' 
                        : 'rgba(0, 0, 0, 0.12)',
                      color: theme.palette.mode === 'dark' 
                        ? 'rgba(255, 255, 255, 0.3)' 
                        : 'rgba(0, 0, 0, 0.26)'
                    }
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : parseFloat(fromAmount) > fromTokenBalance ? (
                    'Insufficient Balance'
                  ) : (
                    'Swap'
                  )}
                </Button>
              ) : (
                <>
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={!fromAmount || !limitPrice || parseFloat(fromAmount) <= 0 || loading || parseFloat(fromAmount) > fromTokenBalance}
                    onClick={createLimitOrder}
                    sx={{ 
                      py: 1.5,
                      borderRadius: 3,
                      fontSize: '1rem',
                      textTransform: 'none',
                      background: 'linear-gradient(45deg, #9945FF 0%, #14F195 100%)',
                      '&.Mui-disabled': {
                        background: theme.palette.mode === 'dark' 
                          ? 'rgba(255, 255, 255, 0.12)' 
                          : 'rgba(0, 0, 0, 0.12)',
                        color: theme.palette.mode === 'dark' 
                          ? 'rgba(255, 255, 255, 0.3)' 
                          : 'rgba(0, 0, 0, 0.26)'
                      }
                    }}
                  >
                    {loading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : parseFloat(fromAmount) > fromTokenBalance ? (
                      'Insufficient Balance'
                    ) : (
                      'Place Limit Order'
                    )}
                  </Button>
                  
                  <Button
                    fullWidth
                    variant="outlined"
                    component={Link}
                    to="/limit-orders"
                    sx={{ 
                      mt: 2,
                      py: 1.5,
                      borderRadius: 3,
                      fontSize: '1rem',
                      textTransform: 'none',
                    }}
                  >
                    View My Limit Orders
                  </Button>
                </>
              )}
            
              {/* Transaction Status */}
              {txStatus && (
                <Box 
                  sx={{ 
                    mt: 3,
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: 
                      txStatus === 'success' ? 'rgba(46, 204, 113, 0.1)' : 
                      txStatus === 'error' ? 'rgba(231, 76, 60, 0.1)' : 
                      'rgba(52, 152, 219, 0.1)',
                    border: '1px solid',
                    borderColor: 
                      txStatus === 'success' ? 'rgba(46, 204, 113, 0.3)' : 
                      txStatus === 'error' ? 'rgba(231, 76, 60, 0.3)' : 
                      'rgba(52, 152, 219, 0.3)',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {txStatus === 'processing' && <CircularProgress size={20} />}
                    {txStatus === 'success' && <CheckCircleIcon color="success" />}
                    {txStatus === 'error' && <WarningIcon color="error" />}
                    <Typography 
                      color={
                        txStatus === 'success' ? 'success.main' : 
                        txStatus === 'error' ? 'error.main' : 
                        'info.main'
                      }
                    >
                      {txMessage}
                    </Typography>
                  </Box>

                  {/* TWAP Progress Indicator */}
    {twapProgress && (
      <Box sx={{ mt: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="caption" color="text.secondary">
            TWAP Progress
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {twapProgress.current}/{twapProgress.total}
          </Typography>
        </Box>
        <Box sx={{ width: '100%', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 1, height: 8 }}>
          <Box 
            sx={{ 
              width: `${(twapProgress.current / twapProgress.total) * 100}%`,
              backgroundColor: twapProgress.status === 'failed' ? '#e74c3c' : '#9945FF',
              height: '100%',
              borderRadius: 1
            }}
          />
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
          {twapProgress.status === 'executing' && '⏳ Executing chunk...'}
          {twapProgress.status === 'confirmed' && '✅ Chunk confirmed'}
          {twapProgress.status === 'failed' && '❌ Chunk failed'}
        </Typography>
      </Box>
    )}
  </Box>
)}

            </Paper>
          </Grid>
          


          {/* Trading View Chart */}
          <Grid item xs={12} md={7} lg={8}>
            <TradingViewChart fromToken={fromToken} toToken={toToken} />
          </Grid>
        </Grid>
      </Container>
      
      {/* Success notification */}
      <Snackbar 
        open={success} 
        autoHideDuration={6000} 
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSuccess(false)} 
          severity="success" 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {activeTab === 'market' ? 'Swap completed successfully!' : 'Limit order placed successfully!'}
        </Alert>
      </Snackbar>
      
      {/* Error notification */}
      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setError(null)} 
          severity="error" 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {error}
        </Alert>
      </Snackbar>
      
      {/* Import warning dialog */}
      <ImportWarningDialog />
      
      {/* Settings Dialog */}
      <Dialog
        open={showSettings}
        onClose={() => setShowSettings(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Settings</Typography>
            <IconButton onClick={() => setShowSettings(false)} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {/* MEV Protection Section */}
    <Box sx={{ mb: 3 }}>
      <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
        🛡️ MEV Protection
      </Typography>
      <FormControlLabel
        control={
          <Checkbox 
            checked={mevProtectionEnabled} 
            onChange={(e) => setMevProtectionEnabled(e.target.checked)} 
          />
        }
        label="Enable MEV Protection (Recommended)"
      />
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
        Uses dynamic priority fees and TWAP for large trades to protect against MEV bots
      </Typography>
      
      {mevProtectionEnabled && (
        <Box sx={{ mt: 2, p: 2, backgroundColor: 'rgba(153, 69, 255, 0.1)', borderRadius: 2 }}>
          <Typography variant="body2" gutterBottom>
            <strong>Protection Features:</strong>
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
            • Dynamic priority fees (up to {MEV_PROTECTION.MAX_PRIORITY_FEE.toLocaleString()} lamports)
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
            • TWAP execution for trades ≥ ${MEV_PROTECTION.TWAP_THRESHOLD_USD}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
            • Price impact protection (max {(MEV_PROTECTION.MAX_PRICE_IMPACT * 100)}%)
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
            • Multi-route verification
          </Typography>
        </Box>
      )}
    </Box>
          <Typography variant="subtitle2" gutterBottom>
            Slippage Tolerance
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Button 
              variant={slippage === 0.1 ? "contained" : "outlined"}
              size="small"
              onClick={() => setSlippage(0.1)}
              sx={{ borderRadius: 2 }}
            >
              0.1%
            </Button>
            <Button 
              variant={slippage === 0.5 ? "contained" : "outlined"}
              size="small"
              onClick={() => setSlippage(0.5)}
              sx={{ borderRadius: 2 }}
            >
              0.5%
            </Button>
            <Button 
              variant={slippage === 1.0 ? "contained" : "outlined"}
              size="small"
              onClick={() => setSlippage(1.0)}
              sx={{ borderRadius: 2 }}
            >
              1.0%
            </Button>
            <TextField
              size="small"
              value={customSlippage !== null ? customSlippage : ''}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '' || /^\d*\.?\d*$/.test(value)) {
                  setCustomSlippage(value);
                  if (value !== '') {
                    setSlippage(parseFloat(value));
                  }
                }
              }}
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
                sx: { borderRadius: 2 }
              }}
              placeholder="Custom"
              sx={{ width: 100 }}
            />
          </Box>
          
          <Typography variant="subtitle2" gutterBottom>
            Transaction Deadline
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TextField
              size="small"
              value={txDeadline}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '' || /^\d*$/.test(value)) {
                  setTxDeadline(value);
                }
              }}
              sx={{ width: 80 }}
              InputProps={{
                sx: { borderRadius: 2 }
              }}
            />
            <Typography variant="body2" color="text.secondary">
              minutes
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSettings(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Routes dialog */}
      <Dialog
        open={showRoutesDialog}
        onClose={() => setShowRoutesDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6">Available Routes</Typography>
        </DialogTitle>
        <DialogContent>
          {availableRoutes.length > 0 ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell>Route</TableCell>
                    <TableCell>Output</TableCell>
                    <TableCell>Price Impact</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {availableRoutes.map((route, index) => (
                    <TableRow 
                      key={index}
                      selected={selectedRouteIndex === index}
                      onClick={() => setSelectedRouteIndex(index)}
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell>
                        <Radio
                          checked={selectedRouteIndex === index}
                          onChange={() => setSelectedRouteIndex(index)}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 0.5 }}>
                          {route.marketInfos.map((market, i) => (
                            <React.Fragment key={i}>
                              {i > 0 && <ArrowRightAltIcon fontSize="small" sx={{ color: 'text.secondary' }} />}
                              <Chip 
                                label={formatMarketName(market.label)} 
                                size="small" 
                                variant="outlined"
                              />
                            </React.Fragment>
                          ))}
                        </Box>
                      </TableCell>
                      <TableCell>
                        {(route.outAmount / Math.pow(10, toToken?.decimals || 9)).toFixed(6)} {toToken?.symbol}
                      </TableCell>
                      <TableCell>
                        <Typography 
                          color={route.priceImpactPct > 1 ? 'error.main' : 'success.main'}
                        >
                          {(route.priceImpactPct * 100).toFixed(2)}%
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
              No routes available
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowRoutesDialog(false)}>
            Close
          </Button>
          <Button 
            variant="contained" 
            onClick={() => {
              // Apply selected route
              setShowRoutesDialog(false);
            }}
            disabled={availableRoutes.length === 0}
          >
            Select Route
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SwapPage;










  







