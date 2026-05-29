export type TTrackingStockTab = 'ACTIVE' | 'INACTIVE';

export type TTrackingStock = {
  id: number;
  trading_symbol: string;
  exchange: string;
  instrument_token: number;
  target: number;
  stoploss: number;
  quantity: number;
  order_price_limit:number;
  status: 'AUTO_ACTIVE' | 'ACTIVE' | 'INACTIVE' | 'AUTO_INACTIVE';
  created_at: string;
}