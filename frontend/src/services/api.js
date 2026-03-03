// Local data imports — no backend needed for demo
// When backend is ready, swap these back to axios calls
import macroData from '../data/macro.json';
import scannerData from '../data/scanner.json';
import portfolioData from '../data/portfolio.json';
import briefingData from '../data/briefing.json';
import abclData from '../data/stocks/ABCL.json';

const stocksMap = {
  ABCL: abclData,
};

// Simulate async API calls (keeps the same interface as real API)
const delay = (data) => new Promise((resolve) => setTimeout(() => resolve(data), 200));

export const getMacro = () => delay(macroData);
export const getScanner = () => delay(scannerData);
export const getStock = (symbol) => {
  const data = stocksMap[symbol?.toUpperCase()];
  if (!data) return Promise.reject(new Error(`Stock ${symbol} not found`));
  return delay(data);
};
export const getPortfolio = () => delay(portfolioData);
export const getBriefing = () => delay(briefingData);
