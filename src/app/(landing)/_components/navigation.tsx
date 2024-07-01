'use client'

import Link from 'next/link'
import { SignInButton, SignUpButton, UserButton } from '@clerk/clerk-react'
import { useConvexAuth } from 'convex/react'
import { Button } from '../../../components/ui/button'
import { cn } from '@/lib/utils'
import { useScrollTop } from '@/hooks/use-scroll-top'
import { SwitchTheme } from '@/components/switch-theme'
import { Spinner } from '@/components/spinner'
import { useEffect, useRef, useState } from 'react'
import { TimeOut } from '@/components/timeout'

const Navigation = () => {
  const isIntersecting = useScrollTop(30)
  const { isAuthenticated, isLoading } = useConvexAuth()
  const timeoutRef = useRef<null | NodeJS.Timeout>(null)
  const [isTimeOut, updateTimeOut] = useState(false) // Use a state to track the timeout status

  useEffect(() => {
    if (isLoading) {
      // Clear any existing timeout to avoid memory leaks or unexpected behavior
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null // Reset timeoutRef.current to null after clearing
      }

      timeoutRef.current = setTimeout(() => {
        updateTimeOut(true)
      }, 5000)
    }

    return () => {
      // Clear the timeout when the component unmounts or isLoading changes
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null // Reset timeoutRef.current to null after clearing
      }
    }
  }, [isLoading]) // Dependency array to re-run the effect when `isLoading` changes

  if (isTimeOut) {
    return <TimeOut />
  }

  return (
    <header
      className={cn(
        'bg-white dark:bg-[#191919] transition fixed top-0 left-0 w-full z-50',
        isIntersecting && 'border-b border-slate-200 dark:border-zinc-700',
      )}
    >
      <div className="container lg:max-w-full flex items-center justify-between py-3">
        <div>
          <Link href="/" className="flex space-x-3 items-center">
            <div className="logo h-10 w-auto rounded-full flex items-center">
              {/* <Image src="/brand.svg" alt="brand" width={32} height={32} /> */}
              <svg
                width="32px"
                height="32px"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7 1H5v3H2v2h3v3h2V6h3V4H7V1zm12 1h-7v2h7v10h-6v6H5v-9H3v11h12v-2h2v-2h2v-2h2V2h-2zm-2 16h-2v-2h2v2z"
                  fill="#fff"
                  className='hidden dark:block'
                />
                <path
                  d="M7 1H5v3H2v2h3v3h2V6h3V4H7V1zm12 1h-7v2h7v10h-6v6H5v-9H3v11h12v-2h2v-2h2v-2h2V2h-2zm-2 16h-2v-2h2v2z"
                  fill="#000"
                  className='dark:hidden'
                />
              </svg>
            </div>
            <span className="text-xl font-bold relative">NoteFusion</span>
          </Link>
        </div>
        <div className="space-x-3 flex items-center">
          {isLoading && <Spinner />}
          {isAuthenticated && !isLoading && (
            <>
              <Link href="/home">
                <Button className="h-9" variant={'ghost'}>
                  Your notes
                </Button>
              </Link>
              <UserButton afterSignOutUrl="/" />
            </>
          )}
          {!isAuthenticated && !isLoading && (
            <>
              <SignInButton mode="modal" afterSignInUrl='/home'>
                <Button variant={'ghost'} size={'sm'}>
                  Login
                </Button>
              </SignInButton>

              <SignUpButton mode="modal" afterSignUpUrl='/home'>
                <Button size="sm" className="h-9">
                  Let&apos;s start for free
                </Button>
              </SignUpButton>
            </>
          )}
          <SwitchTheme />
        </div>
      </div>
    </header>
  )
}

export default Navigation
