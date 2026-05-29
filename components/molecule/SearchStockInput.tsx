import { useEffect, useRef, useState } from 'react'
import { useDebounce } from '@/hooks/useDebounce'
import { TInstrument } from '@/types/instrument.type'
import { Search, Loader2 } from 'lucide-react'

const searchStock = async (name: string): Promise<TInstrument[]> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/stocks/search?name=${name}`, {
    method: "GET",
    credentials: "include"
  })
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Failed to search stock')
  }

  const data = await response.json();
  return data.instruments || [];
}

type Props = {
  value: string
  setValue: (val: string) => void
  handleUpdateFields: (inst: TInstrument) => void
}

function SearchStockInput({ value, setValue, handleUpdateFields }: Props) {
  const [open, setOpen] = useState(false);
  const searchTerm = useDebounce(value, 600);
  const popoverRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isManualChange = useRef(false);
  const [stocks, setStocks] = useState<TInstrument[]>([]);
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node) &&
        inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (!isManualChange.current) return;

    if (searchTerm && searchTerm.length > 2) {
      const fetchStocks = async () => {
        try {
          setIsLoading(true)
          const stocks = await searchStock(searchTerm)
          setStocks(stocks)
        } catch (error) {
          console.error(error)
        }
        finally {
          setIsLoading(false)
        }
      }
      fetchStocks()
    } else {
      setStocks([]);
    }
  }, [searchTerm])

  const handleSelectInstrument = (inst: TInstrument) => {
    isManualChange.current = false;
    setValue(inst.Tradingsymbol);
    setOpen(false);
    setStocks([]);
    handleUpdateFields(inst)
    inputRef.current?.focus();
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    isManualChange.current = true;
    setValue(e.target.value)

    if (e.target.value.trim() && !open) {
      setOpen(true);
    }
  }

  return (
    <div className='relative w-full group/search'>
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 group-focus-within/search:text-primary transition-colors pointer-events-none" />
      <input
        ref={inputRef}
        type="text"
        placeholder='Search stock (e.g. INFY)'
        value={value}
        onChange={handleOnChange}
        onFocus={() => { if (value.trim()) setOpen(true) }}
        className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm font-medium placeholder:text-gray-500 text-white shadow-xl backdrop-blur-sm"
      />

      {open && (
        <div
          ref={popoverRef}
          className="absolute z-[100] w-full mt-3 rounded-2xl border border-white/10 bg-[#0f0f12]/95 backdrop-blur-xl shadow-2xl transition-all overflow-hidden animate-in fade-in zoom-in-95 scale-in-center origin-top"
        >
          <div className="p-2 space-y-1">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center p-10 gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Searching Market...</p>
              </div>
            ) : stocks?.length === 0 && value.trim().length > 2 ? (
              <div className="p-10 text-center bg-white/[0.02] rounded-2xl border border-white/5">
                <p className="text-sm text-gray-400 font-bold">No results found for "{value}"</p>
                <p className="text-[10px] text-gray-500 mt-2 uppercase tracking-widest leading-relaxed">Try searching with a different ticker symbol</p>
              </div>
            ) : stocks?.length > 0 ? (
              <div className="max-h-72 overflow-y-auto custom-scrollbar p-1">
                {stocks.map((inst: TInstrument) => (
                  <div
                    key={inst.InstrumentToken}
                    className="flex items-center justify-between p-4 hover:bg-primary/10 rounded-xl cursor-pointer transition-all group border border-transparent hover:border-primary/20"
                    onClick={() => handleSelectInstrument(inst)}
                  >
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-black text-white group-hover:text-primary transition-colors uppercase tracking-tight">{inst.Tradingsymbol}</span>
                      <span className="text-[10px] text-gray-500 font-semibold truncate max-w-[180px]">{inst.Name || inst.Tradingsymbol}</span>
                    </div>
                    <div className="flex flex-col items-end gap-1.5 text-right">
                      <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest ${inst.Exchange === 'NSE' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                        }`}>{inst.Exchange}</span>
                      <span className="text-[8px] text-gray-600 font-mono font-bold tracking-tighter">ID: {inst.InstrumentToken}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  )
}

export default SearchStockInput