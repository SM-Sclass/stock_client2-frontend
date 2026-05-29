import { useState, useMemo } from 'react'
import { TTrackingStock, TTrackingStockTab } from '@/types/tracking_stock.type'
import { Power, OctagonX, MoreVertical, Edit2, Trash2, TrendingUp, Target, ShieldAlert, Loader2 } from 'lucide-react'
import Popover from '../molecule/Popover'

interface Props {
  trackingStocks: TTrackingStock[]
  handleEditTrackingStock: (trackingStock: TTrackingStock) => void
  handleViewOrders: (trackingStock: TTrackingStock) => void
  handleDeleteTrackingStock: (trackingStock: TTrackingStock) => void
  handleStartTrackingStock: (trackingStock: TTrackingStock) => void
  handleStopTrackingStock: (trackingStock: TTrackingStock) => void
  isLoading: boolean
  isMarketOpen: boolean
}

function ListTrackingStock({
  trackingStocks,
  handleEditTrackingStock,
  handleViewOrders,
  handleDeleteTrackingStock,
  handleStartTrackingStock,
  handleStopTrackingStock,
  isLoading,
  isMarketOpen
}: Props) {
  const [activeTab, setActiveTab] = useState<TTrackingStockTab>('ACTIVE')
  const [activePopover, setActivePopover] = useState<number | null>(null)
  const [triggerElement, setTriggerElement] = useState<HTMLElement | null>(null)

  const filteredStocks = useMemo(() => {
    return trackingStocks.filter(stock => {
      if (activeTab === 'ACTIVE') {
        return stock.status === 'ACTIVE' || stock.status === 'AUTO_ACTIVE'
      } else {
        return stock.status === 'INACTIVE' || stock.status === 'AUTO_INACTIVE'
      }
    })
  }, [trackingStocks, activeTab])

  const getStatusStyle = (status: TTrackingStock['status']) => {
    switch (status) {
      case 'ACTIVE':
      case 'AUTO_ACTIVE':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
      case 'INACTIVE':
      case 'AUTO_INACTIVE':
        return 'bg-gray-500/10 text-gray-400 border-white/5'
      default:
        return 'bg-gray-500/10 text-gray-400 border-white/5'
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
          <Loader2 className="w-12 h-12 text-primary animate-spin relative" />
        </div>
        <p className="text-gray-400 font-bold tracking-widest uppercase text-xs">Syncing Portfolio...</p>
      </div>
    )
  }

  if (trackingStocks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center px-4">
        <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mb-6 border border-primary/20">
          <TrendingUp className="w-10 h-10 text-primary" />
        </div>
        <h3 className="text-2xl font-black text-white tracking-tight">Your watchlist is empty</h3>
        <p className="text-muted-foreground max-w-xs mx-auto mt-2 leading-relaxed">
          Start building your stock portfolio by adding instruments to track in real-time.
        </p>
      </div>
    )
  }

  const toggleToStatus = (status: TTrackingStock['status']): React.ReactNode => {
    if (status === 'ACTIVE' || status === 'AUTO_ACTIVE') {
      return (
        <div className="flex items-center gap-2">
          <div className='p-1.5 bg-emerald-500/10 rounded-lg group-hover:bg-emerald-500/20 transition-colors'>
            <Power className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          Stop Tracking
        </div>
      )
    } else {
      return (
        <div className="flex items-center gap-2">
          <div className='p-1.5 bg-rose-500/10 rounded-lg group-hover:bg-rose-500/20 transition-colors'>
            <OctagonX className="w-3.5 h-3.5 text-rose-400" />
          </div>
          Start Tracking
        </div>
      )
    }
  }

  const handleToggleStatus = (trackingStock: TTrackingStock) => {
    if (trackingStock.status === 'ACTIVE' || trackingStock.status === 'AUTO_ACTIVE') {
      handleStopTrackingStock(trackingStock)
    } else {
      handleStartTrackingStock(trackingStock)
    }
  }

  return (
    <div className="flex flex-col w-full">
      <div className="flex gap-4 px-8 py-4 border-b border-white/5">
        <button
          onClick={() => setActiveTab('ACTIVE')}
          className={`px-6 py-2 rounded-xl font-bold text-sm transition-all ${activeTab === 'ACTIVE' ? 'bg-primary/10 text-primary border border-primary/20 shadow-lg shadow-primary/5' : 'bg-white/[0.02] text-gray-400 hover:text-gray-200 hover:bg-white/[0.05] border border-white/5'}`}
        >
          Active Tracking
          <span className='ml-2 px-2 py-1 rounded-lg bg-primary/10 text-primary hover:text-gray-200 hover:bg-white/[0.05]'>
            {trackingStocks.filter((stock) => stock.status === 'ACTIVE' || stock.status === 'AUTO_ACTIVE').length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('INACTIVE')}
          className={`px-6 py-2 rounded-xl font-bold text-sm transition-all ${activeTab === 'INACTIVE' ? 'bg-rose-500/10 text-rose-500 border border-rose-500/10 shadow-lg shadow-rose-500/5' : 'bg-white/[0.02] text-gray-400 hover:text-gray-200 hover:bg-white/[0.05] border border-white/5'}`}
        >
          Inactive Tracking
          <span className='ml-2 px-2 py-1 rounded-lg bg-rose-500/10 text-rose-500 hover:text-gray-200 hover:bg-white/[0.05]'>
            {trackingStocks.filter((stock) => stock.status === 'INACTIVE' || stock.status === 'AUTO_INACTIVE').length}
          </span>
        </button>
      </div>

      <div className="overflow-x-auto custom-scrollbar z-40">

        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-white/[0.02] border-b border-white/5">
              <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] rounded-tl-2xl">Instrument</th>
              <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Target</th>
              <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Stoploss</th>
              <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Exch / Qty</th>
              <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Status</th>
              <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] text-right rounded-tr-2xl">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredStocks.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-gray-500 font-bold">
                  No {activeTab.toLowerCase()} tracking stocks found.
                </td>
              </tr>
            ) : (
              filteredStocks.sort((a, b) => a.status.localeCompare(b.status)).map((stock) => (
                <tr key={stock.id} className="hover:bg-white/[0.01] transition-all group">
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-1">
                      <span className="text-base font-black text-white group-hover:text-primary transition-colors tracking-tight">{stock.trading_symbol}</span>
                      <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{stock.exchange}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2.5 text-emerald-400 font-black bg-emerald-500/5 w-fit px-3 py-1.5 rounded-xl border border-emerald-500/20 text-sm tracking-tighter shadow-lg shadow-emerald-500/5">
                      <Target className="w-4 h-4" />
                      ₹{stock.target.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2.5 text-rose-400 font-black bg-rose-500/5 w-fit px-3 py-1.5 rounded-xl border border-rose-500/20 text-sm tracking-tighter shadow-lg shadow-rose-500/5">
                      <ShieldAlert className="w-4 h-4" />
                      ₹{stock.stoploss.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-bold text-gray-300">{stock.quantity} Unit{stock.quantity > 1 ? 's' : ''}</span>
                      <span className="text-[10px] text-gray-500 font-bold font-mono tracking-tighter italic opacity-50">Market Lot</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black border uppercase tracking-[0.15em] ${getStatusStyle(stock.status)}`}>
                      {stock.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className={`px-8 py-6 text-right relative ${activePopover === stock.id ? 'z-[80]' : 'z-0'}`}>
                    <button
                      onClick={(e) => {
                        setTriggerElement(e.currentTarget)
                        setActivePopover(activePopover === stock.id ? null : stock.id)
                      }}
                      className="p-3 hover:bg-white/5 rounded-2xl transition-all text-gray-500 hover:text-white border border-transparent hover:border-white/5 active:scale-90"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>

                    <Popover
                      isOpen={activePopover === stock.id}
                      setIsOpen={() => setActivePopover(null)}
                      side="left"
                      triggerElement={triggerElement}
                    >
                      <div className="p-1.5 space-y-1">
                        <button
                          onClick={() => {
                            handleEditTrackingStock(stock)
                            setActivePopover(null)
                          }}
                          type='button'
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-300 hover:bg-white/5 hover:text-white rounded-xl transition-all"
                        >
                          <div className="p-1.5 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                            <Edit2 className="w-3.5 h-3.5 text-blue-400" />
                          </div>
                          Edit Rules
                        </button>
                        <button
                          onClick={() => {
                            handleToggleStatus(stock)
                            setActivePopover(null)
                          }}
                          type='button'
                          disabled={!isMarketOpen}
                          className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-300 hover:bg-white/5 hover:text-white rounded-xl transition-all ${!isMarketOpen ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          {toggleToStatus(stock.status)}
                        </button>
                        <button
                          onClick={() => {
                            handleViewOrders(stock)
                            setActivePopover(null)
                          }}
                          type='button'
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-300 hover:bg-white/5 hover:text-white rounded-xl transition-all"
                        >
                          <div className="p-1.5 bg-orange-500/10 rounded-lg group-hover:bg-orange-500/20 transition-colors">
                            <TrendingUp className="w-3.5 h-3.5 text-orange-400" />
                          </div>
                          Order History
                        </button>
                        <div className="my-1 border-t border-white/5" />
                        <button
                          onClick={() => {
                            handleDeleteTrackingStock(stock)
                            setActivePopover(null)
                          }}
                          type='button'
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                        >
                          <div className="p-1.5 bg-red-500/10 rounded-lg">
                            <Trash2 className="w-3.5 h-3.5 text-red-500" />
                          </div>
                          Remove Stock
                        </button>
                      </div>
                    </Popover>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ListTrackingStock
