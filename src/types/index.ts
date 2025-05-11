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

export interface YieldHistoryEntry {
  date: string;
  protocol: string;
  poolName: string;
  yieldAmount: number;
  tokenSymbol: string;
  usdValue: number;
}

export interface YieldSummary {
  totalYieldUSD: number;
  dailyYields: YieldHistoryEntry[];
  weeklyYields: YieldHistoryEntry[];
  monthlyYields: YieldHistoryEntry[];
}