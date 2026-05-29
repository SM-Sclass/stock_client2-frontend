import { useEffect, useRef, useState } from 'react'
import { TTrackingStock } from '@/types/tracking_stock.type'
import { AddAndEditStockFormData, addAndEditStockSchema } from './AddStock'
import Dialog from '../molecule/Dialog'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

const editStock = async (bodyData: AddAndEditStockFormData, id: number, signal: AbortSignal) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tracking-stocks/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(bodyData),
    signal,
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Failed to edit stock')
  }

  const data = await response.json()
  return data
}


type Props = {
  trackingStock: TTrackingStock
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  onSuccess: () => void
}

function EditTrackingStock({ trackingStock, isOpen, setIsOpen, onSuccess }: Props) {
  const [isLoading, setIsLoading] = useState(false)
  const abortRef = useRef<AbortController | null>(null)

  const form = useForm<AddAndEditStockFormData>({
    resolver: zodResolver(addAndEditStockSchema),
    defaultValues: {
      trading_symbol: trackingStock.trading_symbol,
      exchange: trackingStock.exchange,
      instrument_token: trackingStock.instrument_token,
      target: trackingStock.target,
      stoploss: trackingStock.stoploss,
      quantity: trackingStock.quantity,
      order_price_limit: trackingStock.order_price_limit,
      status: trackingStock.status,
    },
  })

  useEffect(() => {
    form.reset({
      trading_symbol: trackingStock.trading_symbol,
      exchange: trackingStock.exchange,
      instrument_token: trackingStock.instrument_token,
      target: trackingStock.target,
      stoploss: trackingStock.stoploss,
      quantity: trackingStock.quantity,
      order_price_limit: trackingStock.order_price_limit,
      status: trackingStock.status,
    })
  }, [trackingStock, form])

  const { register, handleSubmit, formState: { errors } } = form

  const onSubmit = async (data: AddAndEditStockFormData) => {
    if (!trackingStock.id) {
      return
    }
    try {
      abortRef.current = new AbortController()
      setIsLoading(true)
      await editStock(data, trackingStock.id, abortRef.current.signal)
      setIsOpen(false)
      toast.success('Stock updated successfully')
      onSuccess()
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        toast.error('Request aborted')
      } else {
        toast.error('Error updating stock')
      }
    } finally {
      setIsLoading(false)
      abortRef.current = null
    }
  }

  const cancelEdit = () => {
    abortRef.current?.abort()
  }

  return (
    <Dialog isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className='glass-card rounded-3xl overflow-hidden relative group'>
        <div className="absolute inset-0 premium-gradient opacity-30 pointer-events-none" />

        <div className='relative p-8 border-b border-white/5'>
          <h2 className='text-2xl font-extrabold text-white'>Edit Tracking Stock</h2>
          <p className='text-muted-foreground mt-1'>Update your tracking parameters for <span className="text-primary font-bold">{trackingStock.trading_symbol}</span>.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className='relative p-8 space-y-6'>
          <div className='space-y-2'>
            <label className="text-sm font-semibold text-gray-400 ml-1" htmlFor="trading_symbol">Trading Symbol</label>
            <input
              type="text"
              id="trading_symbol"
              readOnly
              disabled
              {...register('trading_symbol')}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-sm text-gray-500 cursor-not-allowed outline-none"
            />
            {errors.trading_symbol && <p className="text-red-400 text-xs mt-1.5 ml-1 font-medium">{errors.trading_symbol.message}</p>}
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <label htmlFor="exchange" className="text-sm font-semibold text-gray-400 ml-1">Exchange</label>
              <input
                type="text"
                id="exchange"
                readOnly
                disabled
                {...register('exchange')}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-sm text-gray-500 cursor-not-allowed outline-none"
              />
              {errors.exchange && <p className="text-red-400 text-xs mt-1.5 ml-1 font-medium">{errors.exchange.message}</p>}
            </div>

            <div className='space-y-2'>
              <label htmlFor="instrument_token" className="text-sm font-semibold text-gray-400 ml-1">Instrument Token</label>
              <input
                type="number"
                id="instrument_token"
                readOnly
                disabled
                {...register('instrument_token', { valueAsNumber: true })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-sm text-gray-500 cursor-not-allowed outline-none"
              />
              {errors.instrument_token && <p className="text-red-400 text-xs mt-1.5 ml-1 font-medium">{errors.instrument_token.message}</p>}
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div className='space-y-2 group/input'>
              <label htmlFor="target" className="text-sm font-semibold text-gray-400 ml-1">Target</label>
              <input
                type="number"
                step="0.05"
                id="target"
                {...register('target', { valueAsNumber: true })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none text-sm font-medium text-white"
              />
              {errors.target && <p className="text-red-400 text-[10px] font-medium mt-1 ml-1">{errors.target.message}</p>}
            </div>

            <div className='space-y-2 group/input'>
              <label htmlFor="stoploss" className="text-sm font-semibold text-gray-400 ml-1">Stoploss</label>
              <input
                type="number"
                step="0.05"
                id="stoploss"
                {...register('stoploss', { valueAsNumber: true })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none text-sm font-medium text-white"
              />
              {errors.stoploss && <p className="text-red-400 text-[10px] font-medium mt-1 ml-1">{errors.stoploss.message}</p>}
            </div>

            <div className='space-y-2 group/input'>
              <label htmlFor="quantity" className="text-sm font-semibold text-gray-400 ml-1">Quantity</label>
              <input
                type="number"
                id="quantity"
                {...register('quantity', { valueAsNumber: true })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none text-sm font-medium text-white"
              />
              {errors.quantity && <p className="text-red-400 text-[10px] font-medium mt-1 ml-1">{errors.quantity.message}</p>}
            </div>

            <div className='space-y-2 group/input'>
                <label htmlFor="order_price_limit" className="text-sm font-semibold text-gray-400 ml-1">Order Price Limit</label>
                <input
                  type="number"
                  id="order_price_limit"
                  {...register('order_price_limit', { valueAsNumber: true })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none text-sm font-medium text-white"
                  placeholder="50,000.50"
                />
                {errors.order_price_limit && <p className="text-red-400 text-[10px] font-medium mt-1 ml-1">{errors.order_price_limit.message}</p>}
              </div>
          </div>

          <div className='flex flex-col md:flex-row items-center justify-end gap-3 pt-4'>
            <button
              type="button"
              onClick={cancelEdit}
              className='w-full md:w-auto px-8 py-3.5 text-sm font-bold text-gray-400 border border-white/10 rounded-2xl hover:bg-white/5 transition-all'
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className='w-full md:flex-1 px-8 py-3.5 text-sm font-bold bg-primary text-white rounded-2xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-primary/20'
            >
              {isLoading ? (
                <>
                  <Loader2 className='w-4 h-4 animate-spin mr-1' />
                  Updating...
                </>
              ) : "Update Changes"}
            </button>
          </div>
        </form>
      </div>
    </Dialog>
  )
}

export default EditTrackingStock
