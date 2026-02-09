import React from 'react'
import PageLayout from '@/components/shared/PageLayout'
import PlainHeader from '@/components/shared/PlainHeader'

function layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className='flex flex-col min-h-screen bg-background relative pt-20'>
      <PlainHeader />
      <PageLayout>
        <main>
          {children}
        </main>
      </PageLayout>
    </div>
  )
}

export default layout