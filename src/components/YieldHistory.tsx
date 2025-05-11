import React, { useState, useEffect } from 'react';
import { YieldSummary, YieldHistoryEntry } from '../types';

interface YieldHistoryProps {
  walletAddress: string;
}

const YieldHistory: React.FC<YieldHistoryProps> = ({ walletAddress }) => {
  const [yieldData, setYieldData] = useState<YieldSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  useEffect(() => {
    if (walletAddress) {
      fetchYieldHistory();
    }
  }, [walletAddress]);

  const fetchYieldHistory = async () => {
    setLoading(true);
    
    try {
      const mockYieldHistory: YieldSummary = {
        totalYieldUSD: 847.32,
        dailyYields: generateMockYields('daily'),
        weeklyYields: generateMockYields('weekly'), 
        monthlyYields: generateMockYields('monthly')
      };
      
      setYieldData(mockYieldHistory);
    } catch (error) {
      console.error('Error fetching yield history:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockYields = (period: string): YieldHistoryEntry[] => {
    const yields: YieldHistoryEntry[] = [];
    const protocols = ['Uniswap V3', 'Compound', 'Aave'];
    const pools = ['USDC/ETH', 'cUSDC', 'aUSDC'];
    const tokens = ['USDC', 'ETH', 'COMP', 'AAVE'];
    
    const count = period === 'daily' ? 30 : period === 'weekly' ? 12 : 6;
    const multiplier = period === 'daily' ? 1 : period === 'weekly' ? 7 : 30;
    
    for (let i = 0; i < count; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i * multiplier);
      
      yields.push({
        date: date.toISOString().split('T')[0],
        protocol: protocols[Math.floor(Math.random() * protocols.length)],
        poolName: pools[Math.floor(Math.random() * pools.length)],
        yieldAmount: parseFloat((Math.random() * 5 + 0.1).toFixed(4)),
        tokenSymbol: tokens[Math.floor(Math.random() * tokens.length)],
        usdValue: parseFloat((Math.random() * 50 + 5).toFixed(2))
      });
    }
    
    return yields.sort((a, b) => b.date.localeCompare(a.date));
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getCurrentYields = (): YieldHistoryEntry[] => {
    if (!yieldData) return [];
    
    switch (timeframe) {
      case 'daily':
        return yieldData.dailyYields;
      case 'weekly':
        return yieldData.weeklyYields;
      case 'monthly':
        return yieldData.monthlyYields;
      default:
        return yieldData.dailyYields;
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>Loading yield history...</p>
      </div>
    );
  }

  if (!yieldData) {
    return null;
  }

  return (
    <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3>Yield History</h3>
        <div style={{ display: 'flex', gap: '10px' }}>
          {(['daily', 'weekly', 'monthly'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setTimeframe(period)}
              style={{
                padding: '5px 10px',
                backgroundColor: timeframe === period ? '#007bff' : '#f8f9fa',
                color: timeframe === period ? 'white' : 'black',
                border: '1px solid #ddd',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '5px' }}>
        <h4 style={{ margin: '0 0 10px 0' }}>Total Earned</h4>
        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>
          {formatCurrency(yieldData.totalYieldUSD)}
        </div>
      </div>

      <div>
        <h4>Recent Yields ({timeframe})</h4>
        {getCurrentYields().length > 0 ? (
          <div style={{ border: '1px solid #eee', borderRadius: '5px' }}>
            {getCurrentYields().slice(0, 10).map((entry, index) => (
              <div
                key={`${entry.date}-${entry.protocol}-${index}`}
                style={{
                  padding: '12px',
                  borderBottom: index < 9 ? '1px solid #eee' : 'none',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ fontWeight: 'bold' }}>
                    {entry.yieldAmount} {entry.tokenSymbol}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    {entry.protocol} • {entry.poolName} • {formatDate(entry.date)}
                  </div>
                </div>
                <div style={{ textAlign: 'right', color: '#28a745', fontWeight: 'bold' }}>
                  +{formatCurrency(entry.usdValue)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: '#666' }}>No yield history found</p>
        )}
      </div>
    </div>
  );
};

export default YieldHistory;