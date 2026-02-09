"use client"
import { useEffect, useState, useCallback } from 'react'
import ListTrackingStock from './ListTrackingStock'
import AddStock from './AddStock'
import EditTrackingStock from './EditTrackingStock'
import { TTrackingStock } from '@/types/tracking_stock.type'
import toast from 'react-hot-toast'
import DeleteTrackingStock from './DeleteTrackingStock'
import OrdersTableModal from './OrdersTableModal'

function TrackingStockManagement() {
  const [trackingStocks, setTrackingStocks] = useState<TTrackingStock[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedStock, setSelectedStock] = useState<TTrackingStock | null>(null)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isViewOrdersOpen, setIsViewOrdersOpen] = useState(false)

  const fetchTrackingStocks = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tracking-stocks`, {
        headers: {
          Accept: 'application/json',
        },
        credentials: 'include',
      })
      if (!response.ok) throw new Error('Failed to fetch tracking stocks')
      const data = await response.json()
      setTrackingStocks(data || [])
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTrackingStocks()
  }, [fetchTrackingStocks])

  const handleEditTrackingStock = (stock: TTrackingStock) => {
    setSelectedStock(stock)
    setIsEditOpen(true)
  }

  const handleViewOrders = (stock: TTrackingStock) => {
    setSelectedStock(stock)
    setIsViewOrdersOpen(true)
  }

  const handleDeleteTrackingStock = async (selectedStock: TTrackingStock) => {
    setIsDeleteOpen(true)
    setSelectedStock(selectedStock)
  }

  const onConfirmDelete = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tracking-stocks/${selectedStock?.id}`, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
        },
        credentials: 'include',
      })
      if (!response.ok) throw new Error('Failed to delete tracking stock')
      toast.success('Deleted successfully')
      fetchTrackingStocks()
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  return (
    <div className='space-y-8'>
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
        <div className="space-y-1">
          <h1 className='text-3xl font-extrabold tracking-tight text-white'>Stock Tracking</h1>
          <p className='text-muted-foreground'>Manage and monitor your tracked stocks in real-time</p>
        </div>
        <AddStock onSuccess={fetchTrackingStocks} />
      </div>

      <div className='glass-card rounded-2xl overflow-hidden border border-white/5'>
        <ListTrackingStock
          trackingStocks={trackingStocks}
          isLoading={isLoading}
          handleEditTrackingStock={handleEditTrackingStock}
          handleDeleteTrackingStock={handleDeleteTrackingStock}
          handleViewOrders={handleViewOrders}
        />
      </div>

      {selectedStock && (
        <OrdersTableModal
          isOpen={isViewOrdersOpen}
          setIsOpen={setIsViewOrdersOpen}
          selectedStock={selectedStock}
        />
      )}

      {selectedStock && (
        <EditTrackingStock
          trackingStock={selectedStock}
          isOpen={isEditOpen}
          setIsOpen={setIsEditOpen}
          onSuccess={fetchTrackingStocks}
        />
      )}

      {selectedStock && (
        <DeleteTrackingStock
          isOpen={isDeleteOpen}
          setIsOpen={setIsDeleteOpen}
          onConfirm={onConfirmDelete}
          stockName={selectedStock.trading_symbol}
        />
      )}
    </div>
  )
}

export default TrackingStockManagement
