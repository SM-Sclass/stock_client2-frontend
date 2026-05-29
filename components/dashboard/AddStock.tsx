import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Dialog from '../molecule/Dialog'
import { z } from 'zod'
import toast from "react-hot-toast"
import { Loader2, Plus } from 'lucide-react'
import SearchStockInput from '../molecule/SearchStockInput'
import { TInstrument } from '@/types/instrument.type'

const addStock = async (bodyData: AddAndEditStockFormData) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tracking-stocks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(bodyData),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Failed to add stock')
  }

  const data = await response.json()
  return data
}

export const addAndEditStockSchema = z.object({
  trading_symbol: z.string().min(1, 'Trading symbol is required'),
  exchange: z.string().min(1, 'Exchange is required'),
  instrument_token: z.number().min(1, 'Instrument token is required'),
  target: z.number().min(0.01, 'Target must be greater than 0'),
  stoploss: z.number().min(0.01, 'Stoploss must be greater than 0'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  order_price_limit: z.number().optional(),
  status: z.string().min(1, 'Status is required'),
})

export type AddAndEditStockFormData = z.infer<typeof addAndEditStockSchema>

interface Props {
  onSuccess: () => void
}

function AddStock({ onSuccess }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<AddAndEditStockFormData>({
    resolver: zodResolver(addAndEditStockSchema),
    defaultValues: {
      trading_symbol: '',
      exchange: '',
      instrument_token: 0,
      target: 0,
      stoploss: 0,
      quantity: 1,
      order_price_limit:0,
      status: 'ACTIVE'
    },
  })

  const watchStatus = form.watch('status')
  const watchTradingSymbol = form.watch('trading_symbol')
  const { register, setValue, formState: { errors }, reset } = form

  const saveStock = () => {
    setValue('status', 'AUTO_INACTIVE')
    form.handleSubmit(onSubmit)()
  }

  const startTracking = () => {
    setValue('status', 'ACTIVE')
    form.handleSubmit(onSubmit)()
  }

  const onSubmit = async (data: AddAndEditStockFormData) => {
    try {
      setIsLoading(true)
      const response = await addStock(data)
      toast.success(response.message || 'Stock added successfully')
      setIsOpen(false)
      reset()
      onSuccess()
    } catch (error: any) {
      toast.error(error.message)
    }
    finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl hover:bg-primary/90 transition-all font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]"
      >
        <Plus className="w-5 h-5" />
        Add Stock
      </button>

      <Dialog isOpen={isOpen} setIsOpen={setIsOpen}>
        <div className='glass-card rounded-3xl overflow-hidden relative group'>
          <div className="absolute inset-0 premium-gradient opacity-30 pointer-events-none" />

          <div className='relative p-8 border-b border-white/5'>
            <h2 className='text-2xl font-extrabold text-white'>Add Stock to Track</h2>
            <p className='text-muted-foreground mt-1'>Search and select an instrument to start monitoring.</p>
          </div>

          <div className='relative p-8 space-y-6'>
            <div className='space-y-2 group/input'>
              <label className="text-sm font-semibold text-gray-400 ml-1" htmlFor="trading_symbol">Trading Symbol</label>
              <SearchStockInput
                value={watchTradingSymbol}
                setValue={(val) => setValue('trading_symbol', val)}
                handleUpdateFields={(inst: TInstrument) => {
                  setValue('exchange', inst.Exchange)
                  setValue('instrument_token', inst.InstrumentToken)
                }}
              />
              {errors.trading_symbol && <p className="text-red-400 text-xs mt-1.5 ml-1 font-medium">{errors.trading_symbol.message}</p>}
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <label htmlFor="exchange" className="text-sm font-semibold text-gray-400 ml-1">Exchange</label>
                <input
                  type="text"
                  id="exchange"
                  {...register('exchange')}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-sm text-gray-400 cursor-not-allowed outline-none"
                  readOnly
                />
                {errors.exchange && <p className="text-red-400 text-xs mt-1.5 ml-1 font-medium">{errors.exchange.message}</p>}
              </div>


              <div className='space-y-2'>
                <label htmlFor="instrument_token" className="text-sm font-semibold text-gray-400 ml-1">Instrument Token</label>
                <input
                  type="number"
                  id="instrument_token"
                  {...register('instrument_token', { valueAsNumber: true })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-sm text-gray-400 cursor-not-allowed outline-none"
                  readOnly
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
                  placeholder="0.00"
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
                  placeholder="0.00"
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
                  placeholder="1"
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
                onClick={saveStock}
                disabled={isLoading}
                className='w-full md:flex-1 px-6 py-4 text-sm font-bold text-gray-300 border border-white/10 rounded-2xl hover:bg-white/5 transition-all flex items-center justify-center gap-2 disabled:opacity-50'
              >
                {isLoading && watchStatus === 'AUTO_INACTIVE' ? (
                  <>
                    <Loader2 className='w-4 h-4 animate-spin mr-1' />
                    Saving...
                  </>
                ) : "Save as Draft"}
              </button>
              <button
                type="button"
                onClick={startTracking}
                disabled={isLoading}
                className='w-full md:flex-1 px-6 py-4 text-sm font-bold bg-primary text-white rounded-2xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-primary/20'
              >
                {isLoading && watchStatus === 'ACTIVE' ? (
                  <>
                    <Loader2 className='w-4 h-4 animate-spin mr-1' />
                    Starting...
                  </>
                ) : "Start Tracking"}
              </button>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  )
}

export default AddStock
