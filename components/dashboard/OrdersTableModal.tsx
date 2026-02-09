import { Loader2 } from 'lucide-react'
import { TTrackingStock } from '@/types/tracking_stock.type'
import Dialog from '../molecule/Dialog'
import { useOrdersQuery } from '@/hooks/useOrderQuery'

type Props = {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  selectedStock: TTrackingStock
}

function OrdersTableModal({ isOpen, setIsOpen, selectedStock }: Props) {
  const { pageNumber, next, prev, data, isLoading, isError, error, totalCount } = useOrdersQuery(selectedStock.id)
  return (
    <Dialog isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className='glass-card rounded-3xl overflow-hidden relative group'>
        <div className="absolute inset-0 premium-gradient opacity-20 pointer-events-none" />

        <div className='relative p-8 border-b border-white/5'>
          <h2 className='text-2xl font-extrabold text-white'>Order History</h2>
          <p className='text-muted-foreground mt-1'>Detailed log for <span className="text-primary font-bold">{selectedStock.trading_symbol}</span></p>
        </div>

        <div className='relative p-2 md:p-6 overflow-hidden'>
          <div className='overflow-x-auto custom-scrollbar rounded-2xl border border-white/5'>
            <table className='w-full text-left'>
              <thead>
                <tr className='bg-white/5 border-b border-white/5'>
                  {['Order ID', 'Exch. ID', 'Type', 'Transaction', 'Qty', 'Price', 'Status', 'Time'].map((head) => (
                    <th key={head} className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">{head}</th>
                  ))}
                </tr>
              </thead>
              <tbody className='divide-y divide-white/5'>
                {isLoading ? (
                  <tr>
                    <td colSpan={8} className='h-40 text-center'>
                      <div className="flex flex-col items-center justify-center gap-3 text-gray-500">
                        <Loader2 className='w-8 h-8 animate-spin text-primary' />
                        <span className="text-sm font-medium">Fetching orders...</span>
                      </div>
                    </td>
                  </tr>
                ) : isError ? (
                  <tr>
                    <td colSpan={8} className='h-40 text-center text-red-400 font-medium'>
                      {error}
                    </td>
                  </tr>
                ) : data?.length === 0 ? (
                  <tr>
                    <td colSpan={8} className='h-40 text-center text-gray-500 font-medium'>
                      No orders found matching this stock.
                    </td>
                  </tr>
                ) : data?.map((order) => (
                  <tr key={order.id} className="hover:bg-white/[0.02] transition-colors group/row">
                    <td className="px-6 py-4 text-sm font-medium text-gray-300">#{order.order_id?.slice(-6)}</td>
                    <td className="px-6 py-4 text-sm text-gray-400">{order.exchange_order_id || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm text-gray-300">{order.order_type}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight ${order.transaction_type === 'BUY' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}>
                        {order.transaction_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300 font-mono">{order.quantity}</td>
                    <td className="px-6 py-4 text-sm text-primary font-bold">₹{order.purchase_price || order.base_price}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight ${order.status === 'COMPLETE' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-500/20 text-gray-400'
                        }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500 whitespace-nowrap">
                      {order.placed_at ? new Date(order.placed_at).toLocaleString() : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className='relative p-6 bg-white/[0.02] border-t border-white/5 flex items-center justify-between'>
          <div className="text-sm text-gray-500">
            Page <span className="text-white font-bold">{pageNumber}</span> of <span className="text-white font-bold">{Math.ceil(totalCount / 10)}</span>
          </div>
          <div className='flex gap-2 text-white'>
            <button onClick={prev}
              disabled={isLoading || pageNumber === 1}
              className='px-6 py-2 text-xs font-bold border border-white/10 rounded-xl hover:bg-white/5 transition-all disabled:opacity-30 disabled:pointer-events-none'
            >Previous</button>
            <button onClick={next}
              disabled={isLoading || pageNumber === Math.ceil(totalCount / 10)}
              className='px-6 py-2 text-xs font-bold bg-white/10 rounded-xl hover:bg-white/20 transition-all disabled:opacity-30 disabled:pointer-events-none'
            >Next</button>
          </div>
        </div>
      </div>
    </Dialog>
  )
}

export default OrdersTableModal