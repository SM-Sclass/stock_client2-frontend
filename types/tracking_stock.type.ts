export type TTrackingStock = {
  id: number;
  trading_symbol: string;
  exchange: string;
  instrument_token: number;
  target: number;
  stoploss: number;
  quantity: number;
  status: 'AUTO_ACTIVE' | 'ACTIVE' | 'INACTIVE' | 'AUTO_INACTIVE';
  created_at: string;
}