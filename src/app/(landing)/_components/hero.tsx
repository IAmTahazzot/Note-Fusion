'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useConvexAuth } from 'convex/react'
import { Spinner } from '@/components/spinner'

const Hero = () => {
  const { isAuthenticated, isLoading } = useConvexAuth()

  return (
    <section className="container w-full mx-auto mt-[140px]">
      <h1 className="font-bold text-[36px] sm:text-[44px] md:text-[64px] leading-[1] text-center -tracking-[2.56px]">
        Write, plan, organize, play
      </h1>

      <h2 className="text-[18px] sm:text-[20px] md:text-[24px] mt-8 font-medium text-center">
        Turn ideas into action
        <br className="hidden md:block" />
        with NoteFusion&apos;s AI-powered workspace.
      </h2>

      <div className="flex items-center justify-center mt-8">
        {!isAuthenticated && !isLoading && (
          <Button
            className="h-9"
            style={{
              borderRadius: '4px',
            }}
          >
            Get for free →
          </Button>
        )}

        {isLoading && (
          <Button className="h-9" variant={'ghost'}>
            <Spinner />
          </Button>
        )}

        {isAuthenticated && !isLoading && (
          <Link href="/home">
            <Button className="h-9" variant={'secondary'}>
              Open your notes
            </Button>
          </Link>
        )}
      </div>
    </section>
  )
}

export default Hero
