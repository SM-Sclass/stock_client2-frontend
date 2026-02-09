import { Metadata } from 'next'
import TrackingStockManagement from '@/components/dashboard/TrackingStockManagement'

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Tracking Stock Management',
}

function DashboardPage() {
  return (
    <TrackingStockManagement />
  )
}

export default DashboardPage