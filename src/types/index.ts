export interface TokenBalance {
  token: string;
  symbol: string;
  balance: string;
  usdValue: number;
}

export interface PoolPosition {
  protocol: string;
  poolName: string;
  lpTokens: string;
  token0: TokenBalance;
  token1: TokenBalance;
  totalUsdValue: number;
  apr: number;
}

export interface Portfolio {
  totalValue: number;
  tokens: TokenBalance[];
  pools: PoolPosition[];
}