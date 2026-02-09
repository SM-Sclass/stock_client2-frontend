'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Loader2, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import * as z from 'zod'

async function signupUser({
  fullName,
  phone,
  password,
}: {
  fullName: string
  phone: string
  password: string
}) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/signup`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ full_name: fullName, phone, password }),
    }
  )

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Failed to signup')
  }

  return response.json()
}

export const signupSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, 'Enter valid mobile number'),
  password: z.string().min(6, 'Minimum 6 characters').max(10, 'Maximum 10 characters'),
})

export type SignupFormData = z.infer<typeof signupSchema>

function Signup() {
  const router = useRouter()
  const [isLoggedInSuccessfully, setIsLoggedInSuccessfully] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: { fullName: '', phone: '', password: '' },
  })

  const { register, handleSubmit, formState: { errors } } = form

  const onSubmit = async (data: SignupFormData) => {
    setLoading(true)
    try {
      await signupUser(data)
      toast.success('Login successful')
      setIsLoggedInSuccessfully(true)
      router.push('/dashboard')
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="glass-card rounded-3xl overflow-hidden relative group">
          <div className="absolute inset-0 premium-gradient opacity-50 group-hover:opacity-70 transition-opacity duration-500" />

          <div className="relative p-8 md:p-10 space-y-8">
            <div className="text-center space-y-2">
              <h1 className="text-4xl font-extrabold tracking-tight text-white">
                Get Started
              </h1>
              <p className="text-muted-foreground">
                Create an account to start tracking
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Full Name Field */}
              <div className="space-y-2">
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-gray-300 ml-1"
                >
                  Full Name
                </label>
                <div className="relative group/input">
                  <input
                    type="text"
                    id="fullName"
                    {...register('fullName')}
                    className={`w-full px-4 py-3.5 bg-white/5 border rounded-2xl focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all duration-300 backdrop-blur-sm ${errors.fullName
                      ? 'border-red-500/50 focus:ring-red-500/30'
                      : 'border-white/10 group-hover/input:border-white/20'
                      }`}
                    placeholder="Enter your full name"
                  />
                  {errors.fullName && (
                    <motion.p
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-red-400 text-xs mt-1.5 ml-1"
                    >
                      {errors.fullName.message}
                    </motion.p>
                  )}
                </div>
              </div>

              {/* Phone Number Field */}
              <div className="space-y-2">
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-300 ml-1"
                >
                  Phone Number
                </label>
                <div className="relative group/input">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within/input:text-primary transition-colors">
                    +91
                  </div>
                  <input
                    type="tel"
                    id="phone"
                    {...register('phone')}
                    className={`w-full pl-12 pr-4 py-3.5 bg-white/5 border rounded-2xl focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all duration-300 backdrop-blur-sm ${errors.phone
                      ? 'border-red-500/50 focus:ring-red-500/30'
                      : 'border-white/10 group-hover/input:border-white/20'
                      }`}
                    placeholder="9XXXXXXXXX"
                    maxLength={10}
                  />
                  {errors.phone && (
                    <motion.p
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-red-400 text-xs mt-1.5 ml-1"
                    >
                      {errors.phone.message}
                    </motion.p>
                  )}
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-300 ml-1"
                >
                  Password
                </label>
                <div className="relative group/input">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    {...register('password')}
                    className={`w-full pr-12 pl-4 py-3.5 bg-white/5 border rounded-2xl focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all duration-300 backdrop-blur-sm ${errors.password
                      ? 'border-red-500/50 focus:ring-red-500/30'
                      : 'border-white/10 group-hover/input:border-white/20'
                      }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                  >
                    {showPassword ? (
                      <Eye className="w-5 h-5" />
                    ) : (
                      <EyeOff className="w-5 h-5" />
                    )}
                  </button>
                  {errors.password && (
                    <motion.p
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-red-400 text-xs mt-1.5 ml-1"
                    >
                      {errors.password.message}
                    </motion.p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || isLoggedInSuccessfully}
                className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary/20 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            {/* Footer Links */}
            <div className="pt-4 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <button
                  onClick={() => router.push('/login')}
                  className="text-primary hover:text-primary/80 font-semibold transition-colors decoration-primary/30 underline-offset-4 hover:underline"
                >
                  Login here
                </button>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Signup