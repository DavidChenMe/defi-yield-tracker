import { ethers } from 'ethers';
import { PoolPosition } from '../types';

export interface DeFiProtocol {
  name: string;
  chainId: number;
  contractAddress: string;
}

export const SUPPORTED_PROTOCOLS: DeFiProtocol[] = [
  {
    name: 'Uniswap V3',
    chainId: 1,
    contractAddress: '0x1F98431c8aD98523631AE4a59f267346ea31F984'
  },
  {
    name: 'Compound',
    chainId: 1,
    contractAddress: '0x3d9819210A31b4961b30EF54bE2aeD79B9c9Cd3B'
  }
];

class DeFiProtocolService {
  private provider: ethers.BrowserProvider | null = null;

  constructor() {
    if (typeof window.ethereum !== 'undefined') {
      this.provider = new ethers.BrowserProvider(window.ethereum);
    }
  }

  async getUniswapPositions(walletAddress: string): Promise<PoolPosition[]> {
    if (!this.provider) {
      throw new Error('Web3 provider not available');
    }

    return [
      {
        protocol: 'Uniswap V3',
        poolName: 'USDC/ETH 0.05%',
        lpTokens: '0.5421',
        token0: {
          token: '0xA0b86a33E6417E8A7E0A48a50A0f67a9aEd3C81D',
          symbol: 'USDC',
          balance: '1250.00',
          usdValue: 1250.00
        },
        token1: {
          token: '0x0000000000000000000000000000000000000000',
          symbol: 'ETH',
          balance: '0.5',
          usdValue: 1250.00
        },
        totalUsdValue: 2500.00,
        apr: 12.5
      }
    ];
  }

  async getCompoundPositions(walletAddress: string): Promise<PoolPosition[]> {
    if (!this.provider) {
      throw new Error('Web3 provider not available');
    }

    return [
      {
        protocol: 'Compound',
        poolName: 'cUSDC Supply',
        lpTokens: '45.2134',
        token0: {
          token: '0xA0b86a33E6417E8A7E0A48a50A0f67a9aEd3C81D',
          symbol: 'USDC',
          balance: '1000.00',
          usdValue: 1000.00
        },
        token1: {
          token: '',
          symbol: '',
          balance: '0',
          usdValue: 0
        },
        totalUsdValue: 1000.00,
        apr: 8.2
      }
    ];
  }

  async getAllPositions(walletAddress: string): Promise<PoolPosition[]> {
    try {
      const [uniswapPositions, compoundPositions] = await Promise.all([
        this.getUniswapPositions(walletAddress),
        this.getCompoundPositions(walletAddress)
      ]);

      return [...uniswapPositions, ...compoundPositions];
    } catch (error) {
      console.error('Error fetching DeFi positions:', error);
      return [];
    }
  }

  async getProtocolTVL(protocol: string): Promise<number> {
    const mockTVL: { [key: string]: number } = {
      'Uniswap V3': 4200000000,
      'Compound': 2800000000
    };

    return mockTVL[protocol] || 0;
  }
}

export const defiProtocolService = new DeFiProtocolService();