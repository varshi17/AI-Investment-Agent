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
    
    if (!response.data || Object.keys(response.data).length === 0) {
      console.warn(`⚠️ No profile data found for ${symbol}`);
      return getMockProfile(symbol);
    }
    
    console.log(`✅ Profile found for ${symbol}`);
    return response.data;
  } catch (error) {
    console.error(`📊 Finnhub Profile Error for ${symbol}:`, error.message);
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

export const getCompanyNews = async (symbol, limit = 10) => {
  try {
    console.log(`📰 Fetching news for ${symbol}...`);
    
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
    
    console.log(`✅ Found ${response.data.length} news articles for ${symbol}`);
    
    // Return up to limit articles, filtered for quality
    const articles = response.data
      .filter(item => item.headline && item.headline.length > 10)
      .slice(0, limit);
    
    if (articles.length === 0) {
      console.warn(`⚠️ No quality news found for ${symbol}`);
      return getMockNews(symbol);
    }
    
    return articles;
  } catch (error) {
    console.error(`📰 News Error for ${symbol}:`, error.message);
    return getMockNews(symbol);
  }
};

// MOCK DATA for development
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
    c: basePrice,
    h: basePrice * 1.02,
    l: basePrice * 0.98,
    o: basePrice * 0.99,
    pc: basePrice * 0.97,
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

function getMockNews(symbol) {
  const companies = {
    'AAPL': ['Apple', 'iPhone', 'iOS', 'Mac'],
    'TSLA': ['Tesla', 'Electric Vehicle', 'Elon Musk', 'Cybertruck'],
    'MSFT': ['Microsoft', 'Windows', 'Azure', 'AI'],
    'GOOGL': ['Google', 'Alphabet', 'Android', 'Search'],
    'AMZN': ['Amazon', 'AWS', 'E-commerce', 'Bezos'],
    'NVDA': ['NVIDIA', 'GPU', 'AI Chip', 'Graphics']
  };

  const keywords = companies[symbol.toUpperCase()] || [symbol, 'Stock', 'Market', 'Tech'];
  
  return [
    {
      headline: `${keywords[0]} Announces Strong Quarterly Earnings`,
      summary: `${keywords[0]} reported better than expected Q3 results with revenue growth of 15% year-over-year.`,
      source: 'MarketWatch',
      url: '#',
      datetime: Math.floor(Date.now() / 1000) - 3600,
      image: null
    },
    {
      headline: `${keywords[0]} Partners with Leading AI Company`,
      summary: `Strategic partnership aims to integrate advanced AI capabilities into ${keywords[0]}'s products.`,
      source: 'TechCrunch',
      url: '#',
      datetime: Math.floor(Date.now() / 1000) - 7200,
      image: null
    },
    {
      headline: `Analysts Upgrade ${keywords[0]} Stock Target`,
      summary: `Multiple analysts have raised their price targets for ${keywords[0]} citing strong growth potential.`,
      source: 'Bloomberg',
      url: '#',
      datetime: Math.floor(Date.now() / 1000) - 14400,
      image: null
    },
    {
      headline: `${keywords[0]} Expands into New Markets`,
      summary: `Company announces expansion plans into emerging markets as part of global growth strategy.`,
      source: 'Reuters',
      url: '#',
      datetime: Math.floor(Date.now() / 1000) - 86400,
      image: null
    },
    {
      headline: `${keywords[0]} Faces Regulatory Challenges`,
      summary: `Regulatory bodies are reviewing ${keywords[0]}'s business practices in key markets.`,
      source: 'Financial Times',
      url: '#',
      datetime: Math.floor(Date.now() / 1000) - 172800,
      image: null
    }
  ];
}