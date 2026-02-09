import Dialog from '../molecule/Dialog'
import { Trash2 } from 'lucide-react'

type Props = {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  onConfirm: () => void
  stockName: string
}

function DeleteTrackingStock({ isOpen, setIsOpen, onConfirm, stockName }: Props) {
  return (
    <Dialog
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    >
      <div className='glass-card rounded-3xl overflow-hidden relative group p-8 space-y-8'>
        <div className="absolute inset-0 premium-gradient opacity-20 pointer-events-none" />

        <div className="flex flex-col items-center justify-center gap-6 relative">
          <div className="p-6 bg-red-500/10 rounded-full border border-red-500/20 group-hover:scale-110 transition-transform duration-500">
            <Trash2 className="w-12 h-12 text-red-500" />
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-extrabold text-white">Delete Tracking Stock</h3>
            <p className="text-muted-foreground max-w-xs mx-auto">
              Are you sure you want to delete <span className="text-primary font-bold">{stockName}</span>? This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4 relative">
          <button
            onClick={() => setIsOpen(false)}
            className="w-full md:w-auto px-10 py-3.5 text-sm font-bold text-gray-400 border border-white/10 rounded-2xl hover:bg-white/5 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="w-full md:flex-1 px-10 py-3.5 text-sm font-bold text-white bg-red-600/90 hover:bg-red-600 rounded-2xl transition-all shadow-lg shadow-red-600/20"
          >
            Delete Stock
          </button>
        </div>
      </div>
    </Dialog>
  )
}

export default DeleteTrackingStock