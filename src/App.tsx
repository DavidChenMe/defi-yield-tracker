import React, { useState } from 'react';
import WalletConnect from './components/WalletConnect';
import PortfolioBalance from './components/PortfolioBalance';
import YieldHistory from './components/YieldHistory';

function App() {
  const [connectedAccount, setConnectedAccount] = useState<string>('');

  const handleWalletConnect = (address: string) => {
    setConnectedAccount(address);
  };

  return (
    <div className="App">
      <header style={{ padding: '20px', textAlign: 'center' }}>
        <h1>DeFi Yield Tracker</h1>
        <p>Track your DeFi yield farming rewards</p>
      </header>
      <main style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
        <WalletConnect onConnect={handleWalletConnect} />
        
        {connectedAccount && (
          <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <PortfolioBalance walletAddress={connectedAccount} />
            <YieldHistory walletAddress={connectedAccount} />
          </div>
        )}
        
        {!connectedAccount && (
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <p>Please connect your wallet to start tracking your DeFi yields</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;