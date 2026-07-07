// services/finnhubService.js
import axios from "axios";

const BASE_URL = "https://finnhub.io/api/v1";
const API_KEY = process.env.FINNHUB_API_KEY;

// Check if API key exists
if (!API_KEY) {
  console.error('❌ FINNHUB_API_KEY is not set in environment variables');
}

const finnhubAPI = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  params: {
    token: API_KEY
  }
});

export const getCompanyProfile = async (symbol) => {
  try {
    console.log(`📊 Fetching profile for ${symbol}...`);
    
    const response = await finnhubAPI.get('/stock/profile2', { 
      params: { symbol: symbol.toUpperCase() } 
    });
    
    // Check if we got valid data
    if (!response.data || Object.keys(response.data).length === 0) {
      console.warn(`⚠️ No profile data found for ${symbol}`);
      
      // Try alternative API endpoint or return mock data for testing
      // For development, you can return mock data
      return getMockProfile(symbol);
    }
    
    console.log(`✅ Profile found for ${symbol}`);
    return response.data;
  } catch (error) {
    console.error(`📊 Finnhub Profile Error for ${symbol}:`, error.message);
    
    if (error.response?.status === 403) {
      throw new Error('FINNHUB_API_KEY_INVALID - Please check your API key');
    }
    if (error.response?.status === 429) {
      throw new Error('RATE_LIMITED - Too many requests. Please wait.');
    }
    
    // For development, return mock data
    console.warn(`⚠️ Using mock data for ${symbol} (development mode)`);
    return getMockProfile(symbol);
  }
};

export const getStockQuote = async (symbol) => {
  try {
    console.log(`💰 Fetching quote for ${symbol}...`);
    
    const response = await finnhubAPI.get('/quote', { 
      params: { symbol: symbol.toUpperCase() } 
    });
    
    if (!response.data || response.data.c === 0) {
      console.warn(`⚠️ No quote data found for ${symbol}`);
      return getMockQuote(symbol);
    }
    
    console.log(`✅ Quote found for ${symbol}`);
    return response.data;
  } catch (error) {
    console.error(`💰 Finnhub Quote Error for ${symbol}:`, error.message);
    return getMockQuote(symbol);
  }
};

export const getHistoricalData = async (symbol) => {
  try {
    const now = Math.floor(Date.now() / 1000);
    const from = now - 60 * 60 * 24 * 30; // 30 days
    
    const response = await finnhubAPI.get('/stock/candle', {
      params: { 
        symbol: symbol.toUpperCase(), 
        resolution: 'D', 
        from, 
        to: now 
      }
    });
    
    if (response.data.s === 'no_data') {
      console.warn(`⚠️ No historical data for ${symbol}`);
      return getMockHistorical(symbol);
    }
    
    return response.data;
  } catch (error) {
    console.error(`📈 Historical Data Error for ${symbol}:`, error.message);
    return getMockHistorical(symbol);
  }
};

export const getCompanyNews = async (symbol, limit = 5) => {
  try {
    const today = new Date();
    const from = new Date();
    from.setDate(today.getDate() - 7);
    
    const formatDate = (date) => date.toISOString().split('T')[0];
    
    const response = await finnhubAPI.get('/company-news', {
      params: {
        symbol: symbol.toUpperCase(),
        from: formatDate(from),
        to: formatDate(today)
      }
    });
    
    return response.data.slice(0, limit);
  } catch (error) {
    console.error(`📰 News Error for ${symbol}:`, error.message);
    return [];
  }
};

// MOCK DATA for development (remove in production)
function getMockProfile(symbol) {
  const mockData = {
    'TSLA': {
      name: 'Tesla, Inc.',
      ticker: 'TSLA',
      exchange: 'NASDAQ',
      finnhubIndustry: 'Automotive',
      country: 'US',
      ipo: '2010-06-29',
      marketCapitalization: 750000000000,
      logo: 'https://logo.clearbit.com/tesla.com'
    },
    'AAPL': {
      name: 'Apple Inc.',
      ticker: 'AAPL',
      exchange: 'NASDAQ',
      finnhubIndustry: 'Technology',
      country: 'US',
      ipo: '1980-12-12',
      marketCapitalization: 2800000000000,
      logo: 'https://logo.clearbit.com/apple.com'
    },
    'MSFT': {
      name: 'Microsoft Corporation',
      ticker: 'MSFT',
      exchange: 'NASDAQ',
      finnhubIndustry: 'Technology',
      country: 'US',
      ipo: '1986-03-13',
      marketCapitalization: 3100000000000,
      logo: 'https://logo.clearbit.com/microsoft.com'
    }
  };
  
  return mockData[symbol.toUpperCase()] || {
    name: `${symbol} Inc.`,
    ticker: symbol.toUpperCase(),
    exchange: 'NASDAQ',
    finnhubIndustry: 'Technology',
    country: 'US',
    ipo: '2000-01-01',
    marketCapitalization: 100000000000,
    logo: `https://logo.clearbit.com/${symbol.toLowerCase()}.com`
  };
}

function getMockQuote(symbol) {
  const basePrice = Math.random() * 500 + 50;
  return {
    c: basePrice, // Current price
    h: basePrice * 1.02, // High
    l: basePrice * 0.98, // Low
    o: basePrice * 0.99, // Open
    pc: basePrice * 0.97, // Previous close
    t: Math.floor(Date.now() / 1000),
    v: Math.random() * 10000000
  };
}

function getMockHistorical(symbol) {
  const count = 30;
  const data = [];
  let price = Math.random() * 200 + 50;
  
  for (let i = 0; i < count; i++) {
    price = price * (1 + (Math.random() - 0.5) * 0.03);
    data.push(price);
  }
  
  const now = Math.floor(Date.now() / 1000);
  const timestamps = [];
  for (let i = count - 1; i >= 0; i--) {
    timestamps.push(now - i * 86400);
  }
  
  return {
    s: 'ok',
    c: data,
    h: data.map(d => d * 1.02),
    l: data.map(d => d * 0.98),
    o: data.map((d, i) => i === 0 ? d : data[i-1] * 0.99),
    t: timestamps,
    v: data.map(() => Math.random() * 1000000)
  };
}