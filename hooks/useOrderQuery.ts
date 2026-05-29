import { TOrder } from "@/types/orders.type"
import { useCallback, useEffect, useState } from "react"

const getOrderByTrackingStockId = async (stockId: number, pageNumber: number, limit: number): Promise<{
  total_count: number,
  orders: TOrder[]
}> => {
  if (!stockId) return { total_count: 0, orders: [] }
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/orders/tracking-stocks/${stockId}?page=${pageNumber}&limit=${limit}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      credentials: 'include',
    })
    if (!response.ok) throw new Error('Failed to fetch orders')
    const data = await response.json()
    return data
  } catch (error) {
    if (error instanceof Error) throw new Error(error.message);
    throw new Error("Failed to fetch orders");
  }
}

export const useOrdersQuery = (stockId: number) => {
  const [pageNumber, setPageNumber] = useState(1)
  const [data, setData] = useState<TOrder[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalCount, setTotalCount] = useState(0)

  const fetchOrders = useCallback(async () => {
    try {
      setIsLoading(true)
      const orders = await getOrderByTrackingStockId(stockId, pageNumber, 10)
      setData(orders.orders)
      setTotalCount(orders.total_count)
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
        throw new Error(error.message);
      }
      setError("Failed to fetch orders")
      throw new Error("Failed to fetch orders");
    } finally {
      setIsLoading(false)
    }
  }, [pageNumber, stockId])

  useEffect(() => {
    let isMounted = true
    const executeFetch = async () => {
      if (isMounted) await fetchOrders()
    }
    executeFetch()
    return () => { isMounted = false }
  }, [fetchOrders])

  useEffect(() => {
    setPageNumber(1)
  }, [stockId])

  const next = () => {
    if (pageNumber === Math.ceil(totalCount / 10)) return
    setPageNumber((prev) => prev + 1)
  }

  const prev = () => {
    if (pageNumber === 1) return
    setPageNumber((prev) => prev - 1)
  }

  return {
    data,
    isLoading,
    isError: error !== null,
    error,
    pageNumber,
    totalCount,
    next,
    prev
  }
}