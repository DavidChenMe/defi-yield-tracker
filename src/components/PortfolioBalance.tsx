import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Portfolio, TokenBalance } from '../types';

interface PortfolioBalanceProps {
  walletAddress: string;
}

const PortfolioBalance: React.FC<PortfolioBalanceProps> = ({ walletAddress }) => {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (walletAddress) {
      fetchPortfolioData();
    }
  }, [walletAddress]);

  const fetchPortfolioData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.BrowserProvider(window.ethereum);
        
        const ethBalance = await provider.getBalance(walletAddress);
        const ethBalanceFormatted = ethers.formatEther(ethBalance);
        
        const mockPortfolio: Portfolio = {
          totalValue: parseFloat(ethBalanceFormatted) * 2500,
          tokens: [
            {
              token: '0x0000000000000000000000000000000000000000',
              symbol: 'ETH',
              balance: ethBalanceFormatted,
              usdValue: parseFloat(ethBalanceFormatted) * 2500
            }
          ],
          pools: []
        };
        
        setPortfolio(mockPortfolio);
      }
    } catch (err) {
      setError('Failed to fetch portfolio data');
      console.error('Error fetching portfolio:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatTokenAmount = (amount: string, decimals: number = 4): string => {
    const num = parseFloat(amount);
    return num.toFixed(decimals);
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>Loading portfolio data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', color: 'red' }}>
        <p>Error: {error}</p>
        <button onClick={fetchPortfolioData} style={{ marginTop: '10px', padding: '5px 10px' }}>
          Retry
        </button>
      </div>
    );
  }

  if (!portfolio) {
    return null;
  }

  return (
    <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3>Portfolio Overview</h3>
        <button onClick={fetchPortfolioData} style={{ padding: '5px 10px' }}>
          Refresh
        </button>
      </div>
      
      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '5px' }}>
        <h4 style={{ margin: '0 0 10px 0' }}>Total Portfolio Value</h4>
        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2e7d32' }}>
          {formatCurrency(portfolio.totalValue)}
        </div>
      </div>

      <div>
        <h4>Token Balances</h4>
        {portfolio.tokens.length > 0 ? (
          <div style={{ border: '1px solid #eee', borderRadius: '5px' }}>
            {portfolio.tokens.map((token, index) => (
              <div 
                key={token.token} 
                style={{ 
                  padding: '10px', 
                  borderBottom: index < portfolio.tokens.length - 1 ? '1px solid #eee' : 'none',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <strong>{token.symbol}</strong>
                  <div style={{ fontSize: '14px', color: '#666' }}>
                    {formatTokenAmount(token.balance)} {token.symbol}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div>{formatCurrency(token.usdValue)}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: '#666' }}>No tokens found</p>
        )}
      </div>

      {portfolio.pools.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h4>LP Positions</h4>
          <p style={{ color: '#666' }}>Coming soon...</p>
        </div>
      )}
    </div>
  );
};

export default PortfolioBalance;