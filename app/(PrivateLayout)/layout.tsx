import React from 'react'
import PageLayout from '@/components/shared/PageLayout'
import UserHeader from '@/components/shared/UserHeader'

function layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className='flex flex-col min-h-screen bg-background relative pt-20'>
      <UserHeader />
      <PageLayout>
        <main>
          {children}
        </main>
      </PageLayout>
    </div>
  )
}

export default layout