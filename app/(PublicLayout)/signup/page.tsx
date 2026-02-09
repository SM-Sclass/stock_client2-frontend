
import { Metadata } from 'next'
import Signup from '@/components/auth/Signup'

export const metadata: Metadata = {
  title: 'Signup',
  description: 'Signup to your account',
}

function Page() {
  return (
    <Signup />
  )
}

export default Page