
export type TOrder = {
  id: number
  tracking_stock_id: number
  order_id: string
  exchange_order_id: string
  parent_order_id: string
  order_type: string
  event_type: string
  transaction_type: string
  exchange: string
  product: string
  quantity: number
  base_price: number
  trigger_price: number
  purchase_price: number
  status_message: string
  status: string
  placed_at: string
  updated_at: string
}